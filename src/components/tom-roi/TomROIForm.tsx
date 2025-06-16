/**
 * ========================================
 * ARCA AI - ROI ANALYSIS PLATFORM
 * ========================================
 * 
 * Copyright (c) 2025 JimmyDev
 * All rights reserved.
 * 
 * PROPRIETARY AND CONFIDENTIAL
 * This file contains proprietary code developed by JimmyDev.
 * Unauthorized copying, distribution, or use is strictly prohibited.
 * 
 * Developed by: JimmyDev
 * ========================================
 */

/**
 * ========================================
 * ARCA AI - ROI ANALYSIS PLATFORM
 * ========================================
 * 
 * Copyright (c) 2024 JimmyDev
 * All rights reserved.
 * 
 * PROPRIETARY AND CONFIDENTIAL
 * This file contains proprietary code developed by JimmyDev.
 * Unauthorized copying, distribution, or use is strictly prohibited.
 * 
 * Developed by: JimmyDev
 * ========================================
 */

import React, { useEffect, useState } from 'react';
import { useForm, Controller, UseFormTrigger } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FormValues as OriginalFormValues } from './types/analyzer-types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { formatCurrency, parseCurrency } from './utils/formatter';
import { Loader2, ArrowLeft, ArrowRight } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { CondominiumAutocomplete } from './form/CondominiumAutocomplete';
import { LocationAutocomplete } from './form/LocationAutocomplete';
import { HOA_TABLE } from './data/hoa-table';

export interface FormValues {
  condominio: string;
  localizacao: string;
  modelo: string;
  quartos: string;
  piscina: boolean;
  valor_imovel: string;
  entrada_valor: string;
  entrada_percentual: string;
  logoUrl: string | null;
  incluir_decoracao?: boolean;
  decoracao_valor?: string;
  decoracao_percentual?: string;
  incluir_closing_costs?: boolean;
  closing_costs_percentual?: string;

  // Novos campos para dados realistas
  valor_iptu_anual?: string;
  taxa_juros_anual_financiamento?: string; // percentual
  prazo_financiamento_anos?: string;
}

interface TomROIFormProps {
  onSubmit: (data: FormValues) => void;
  isFormProcessing?: boolean;
  isLogoUploading?: boolean;
  onLogoChange?: (file: File | null, dataUrl: string | null) => void;
  logoPreviewUrl?: string | null;
  currentStep: number;
  totalSteps: number;
  handleNextStep: () => void;
  handlePrevStep: () => void;
  fieldsToValidatePerStep: (step: number) => (keyof FormValues)[];
  triggerValidation: UseFormTrigger<FormValues>;
  initialData?: Partial<FormValues>;
}

// Funções de formatação e parsing de moeda atualizadas
const parseCurrencyUSD = (value: string | null | undefined): number => {
  if (!value) {
    return NaN;
  }
  // Remove tudo exceto dígitos e o primeiro ponto decimal se houver.
  const cleanedValue = String(value).replace(/[^\d.]/g, ''); 
  // Se houver múltiplos pontos, considera apenas a parte antes do segundo ponto.
  const parts = cleanedValue.split('.');
  let parsableValue = cleanedValue;
  if (parts.length > 2) {
    parsableValue = parts[0] + '.' + parts.slice(1).join('');
  }
  const num = parseFloat(parsableValue);
  return isNaN(num) ? NaN : num;
};

const formatNumberToCurrencyString = (value: number | null | undefined, includeDecimals = false): string => {
  if (value === null || value === undefined || isNaN(value)) {
    return '';
  }
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: includeDecimals ? 2 : 0,
    maximumFractionDigits: includeDecimals ? 2 : 0,
  }).format(value);
};

// Formata uma string de input (que pode ter lixo) para uma string de moeda limpa para EXIBIÇÃO
const formatInputToCurrencyStringDisplay = (value: string | null | undefined): string => {
  if (!value || value.trim() === '') return '';
  const cleanedValue = String(value).replace(/[^\d]/g, ''); // Remove tudo exceto dígitos
  if (cleanedValue === '') return '';
  const numberValue = parseInt(cleanedValue, 10);
  if (isNaN(numberValue)) return '';
  return formatNumberToCurrencyString(numberValue, false); // false para não incluir decimais na exibição de valores como 650,000
};

const formSchema = z.object({
  condominio: z.string().min(1, 'Nome do condomínio é obrigatório'),
  valor_imovel: z.string()
    .min(1, 'Valor do imóvel é obrigatório')
    .refine(value => {
        const parsed = parseCurrencyUSD(value);
        return !isNaN(parsed) && parsed > 0;
    }, {
      message: "Valor do imóvel deve ser um número positivo válido",
    }),
  entrada_valor: z.string().optional(),
  entrada_percentual: z.string().optional(),
  localizacao: z.string().optional(),
  modelo: z.string().optional(),
  quartos: z.string().optional(),
  piscina: z.boolean().optional(),
  logoUrl: z.string().nullable().optional(),
  incluir_decoracao: z.boolean().optional().default(false),
  decoracao_valor: z.string().optional(),
  decoracao_percentual: z.string().optional(),
  incluir_closing_costs: z.boolean().optional().default(false),
  closing_costs_percentual: z.string().optional(),

  // Validadores para novos campos (marcados como opcionais por enquanto)
  valor_iptu_anual: z.string().optional(),
  taxa_juros_anual_financiamento: z.string().optional(),
  prazo_financiamento_anos: z.string().optional(),
}).refine((data) => {
  // Validação condicional para entrada
  const valorImovelNum = parseCurrencyUSD(data.valor_imovel);
  if (!isNaN(valorImovelNum) && valorImovelNum > 0) {
    const entradaValorStr = data.entrada_valor;
    const entradaPercentualStr = data.entrada_percentual;
    const temEntradaValor = entradaValorStr && !isNaN(parseCurrencyUSD(entradaValorStr)) && parseCurrencyUSD(entradaValorStr) >= 0;
    const temEntradaPercentual = entradaPercentualStr && !isNaN(parseFloat(entradaPercentualStr.replace('%',''))) && parseFloat(entradaPercentualStr.replace('%','')) >= 0;
    if (!temEntradaValor && !temEntradaPercentual) {
      return false;
    }
  }
  return true;
}, {
  message: "Preencha o valor ou o percentual da entrada",
  path: ["entrada_valor"]
}).refine((data) => {
  // Validação condicional para decoração
  if (data.incluir_decoracao) {
    const valorImovelNum = parseCurrencyUSD(data.valor_imovel);
    if (!isNaN(valorImovelNum) && valorImovelNum > 0) {
      const decoracaoValorStr = data.decoracao_valor;
      const decoracaoPercentualStr = data.decoracao_percentual;
      const temDecoracaoValor = decoracaoValorStr && !isNaN(parseCurrencyUSD(decoracaoValorStr)) && parseCurrencyUSD(decoracaoValorStr) >= 0;
      const temDecoracaoPercentual = decoracaoPercentualStr && !isNaN(parseFloat(decoracaoPercentualStr.replace('%',''))) && parseFloat(decoracaoPercentualStr.replace('%','')) >= 0;
      if (!temDecoracaoValor && !temDecoracaoPercentual) {
        return false;
      }
    }
  }
  return true;
}, {
  message: "Preencha o valor ou o percentual da decoração",
  path: ["decoracao_valor"]
}).refine((data) => {
  // Validação condicional para closing costs
  if (data.incluir_closing_costs) {
    const valorImovelNum = parseCurrencyUSD(data.valor_imovel);
    if (!isNaN(valorImovelNum) && valorImovelNum > 0) {
      const closingCostsPercentualStr = data.closing_costs_percentual;
      const temClosingCostsPercentual = closingCostsPercentualStr && !isNaN(parseFloat(closingCostsPercentualStr.replace('%',''))) && parseFloat(closingCostsPercentualStr.replace('%','')) >= 0;
      if (!temClosingCostsPercentual) {
        return false;
      }
    }
  }
  return true;
}, {
  message: "Preencha o percentual dos custos de fechamento",
  path: ["closing_costs_percentual"]
});

const TomROIForm: React.FC<TomROIFormProps> = ({
  onSubmit,
  isFormProcessing = false,
  isLogoUploading = false,
  onLogoChange,
  logoPreviewUrl,
  currentStep,
  totalSteps,
  handleNextStep,
  handlePrevStep,
  fieldsToValidatePerStep,
  triggerValidation,
  initialData,
}) => {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
    trigger,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      condominio: '',
      localizacao: '',
      modelo: '',
      quartos: '',
      piscina: false,
      valor_imovel: '',
      entrada_valor: '',
      entrada_percentual: '',
      logoUrl: null,
      incluir_decoracao: false,
      decoracao_valor: '',
      decoracao_percentual: '',
      incluir_closing_costs: false,
      closing_costs_percentual: '',

      // Defaults para novos campos
      valor_iptu_anual: '',
      taxa_juros_anual_financiamento: '', // Começa vazio/zerado
      prazo_financiamento_anos: '',
    },
    mode: 'onChange',
  });

  const watchValorImovel = watch('valor_imovel');
  const watchIncluirDecoracao = watch('incluir_decoracao');
  const watchIncluirClosingCosts = watch('incluir_closing_costs');
  const watchPrazoFinanciamento = watch('prazo_financiamento_anos'); // Observar o prazo
  const watchTaxaJuros = watch('taxa_juros_anual_financiamento');
  const watchCondominio = watch('condominio');
  const watchQuartos = watch('quartos');

  const condominiumNames = HOA_TABLE.map(item => item.condominio);

  // Debug log para verificar se os dados estão sendo carregados
  console.log('[TomROIForm] condominiumNames:', condominiumNames.length, condominiumNames.slice(0, 5));

  React.useEffect(() => {
    if (!watchIncluirDecoracao) {
      // Limpeza mais agressiva dos campos de decoração
      setValue('decoracao_valor', '', { shouldValidate: false, shouldDirty: false });
      setValue('decoracao_percentual', '', { shouldValidate: false, shouldDirty: false });
      
      // Trigger validation após limpeza para remover possíveis erros
      setTimeout(() => {
        trigger(['decoracao_valor', 'decoracao_percentual']);
      }, 100);
    }
  }, [watchIncluirDecoracao, setValue, trigger]);

  React.useEffect(() => {
    if (!watchIncluirClosingCosts) {
      setValue('closing_costs_percentual', '', { shouldValidate: true });
    }
  }, [watchIncluirClosingCosts, setValue]);

  // Preenchimento automático para taxa de juros baseado no prazo
  React.useEffect(() => {
    const prazo = parseInt(watchPrazoFinanciamento, 10);
    const currentTaxa = watch('taxa_juros_anual_financiamento');

    if (prazo === 30 && !currentTaxa) {
      setValue('taxa_juros_anual_financiamento', '7');
    } else if (prazo === 15 && !currentTaxa) {
      setValue('taxa_juros_anual_financiamento', '6.5');
    }
  }, [watchPrazoFinanciamento, setValue, watchTaxaJuros]);

  // Preenchimento automático para prazo baseado na taxa de juros
  React.useEffect(() => {
    const taxa = parseFloat(watchTaxaJuros?.replace('%', '') || '');
    const currentPrazo = watch('prazo_financiamento_anos');

    // Só define o prazo automaticamente se o campo do prazo estiver vazio
    // e o usuário mudar a taxa para valores predefinidos.
    if (currentPrazo === '' || currentPrazo === null || typeof currentPrazo === 'undefined') {
      if (taxa === 7) {
        setValue('prazo_financiamento_anos', '30', { shouldValidate: true });
      } else if (taxa === 6.19) {
        setValue('prazo_financiamento_anos', '15', { shouldValidate: true });
      }
    } else if (isNaN(taxa)) {
      // Se a taxa for apagada, e o prazo era um dos nossos automáticos, limpa o prazo.
      if (currentPrazo === '30' || currentPrazo === '15') {
        setValue('prazo_financiamento_anos', '', { shouldValidate: true });
      }
    }
    // Se o usuário já digitou um prazo, não fazemos nada para não apagar a entrada manual.
  }, [watchTaxaJuros, setValue, watch]);

  // Efeito para logar mudanças nos campos observados (para depuração)
  useEffect(() => {
    console.log('[TomROIForm] condominio field value:', watchCondominio);
  }, [watchCondominio]);

  useEffect(() => {
    console.log('[TomROIForm] valor_imovel field object:', { value: watchValorImovel, error: errors.valor_imovel?.message });
  }, [watchValorImovel, errors.valor_imovel]);

  const internalSubmitHandler = (data: FormValues) => {
    onSubmit(data);
  };  

  const handleCurrencyInputChange = (
    field: 'valor_imovel' | 'entrada_valor' | 'decoracao_valor' | 'valor_iptu_anual',
    rawValue: string
  ) => {
    const formattedDisplayValue = formatInputToCurrencyStringDisplay(rawValue);
    setValue(field, formattedDisplayValue, { shouldValidate: true });

    // Lógica de cálculo cruzado entre valor e percentual
    const valorImovelNum = parseCurrencyUSD(watchValorImovel);
    if (isNaN(valorImovelNum) || valorImovelNum <= 0) return;

    if (field === 'valor_imovel' || field === 'entrada_valor') {
      const entradaValorNum = parseCurrencyUSD(field === 'entrada_valor' ? rawValue : watch('entrada_valor'));
      if (!isNaN(entradaValorNum)) {
        const percent = (entradaValorNum / valorImovelNum) * 100;
        if (!isNaN(percent) && percent >= 0) {
          setValue('entrada_percentual', `${percent.toFixed(1)}%`, { shouldValidate: true });
        }
      }
    }

    if (field === 'valor_imovel' || field === 'decoracao_valor') {
      const decoracaoValorNum = parseCurrencyUSD(field === 'decoracao_valor' ? rawValue : watch('decoracao_valor'));
      if (!isNaN(decoracaoValorNum) && watchIncluirDecoracao) {
        const percent = (decoracaoValorNum / valorImovelNum) * 100;
        if (!isNaN(percent) && percent >= 0) {
          setValue('decoracao_percentual', `${percent.toFixed(1)}%`, { shouldValidate: true });
        }
      }
    }
  };

  const handlePercentInputChange = (
    field: 'entrada_percentual' | 'decoracao_percentual' | 'closing_costs_percentual',
    rawValue: string
  ) => {
    // Se o valor estiver vazio ou for apenas o símbolo %, limpa o campo
    if (!rawValue || rawValue.trim() === '' || rawValue.trim() === '%') {
      setValue(field, '', { shouldValidate: true });
      
      // Limpar campo de valor correspondente
      if (field === 'entrada_percentual') {
        setValue('entrada_valor', '', { shouldValidate: true });
    } else if (field === 'decoracao_percentual') {
            setValue('decoracao_valor', '', { shouldValidate: true });
        }
      return;
    }
    
    // Remove tudo exceto dígitos
    let numericValueStr = rawValue.replace(/[^\d]/g, '');
    
    // Converte para número e verifica se é válido
    let numericValue = parseInt(numericValueStr, 10);
    
    // Limita o valor entre 1 e 100
    if (!isNaN(numericValue)) {
      // Se o valor for maior que 100, mantém apenas os dois primeiros dígitos
      if (numericValue > 100) {
        numericValue = parseInt(numericValueStr.slice(0, 2), 10);
      }
      
      // Formata como número inteiro com símbolo %
      const finalValue = `${numericValue}%`;
      setValue(field, finalValue, { shouldValidate: true });

      // Lógica de cálculo cruzado
      const valorImovelNum = parseCurrencyUSD(watchValorImovel);
      if (isNaN(valorImovelNum) || valorImovelNum <= 0) return;

      if (field === 'entrada_percentual') {
        const valorCalculado = (numericValue / 100) * valorImovelNum;
      setValue('entrada_valor', formatNumberToCurrencyString(valorCalculado, false), { shouldValidate: true });
      } else if (field === 'decoracao_percentual' && watchIncluirDecoracao) {
        const valorCalculado = (numericValue / 100) * valorImovelNum;
      setValue('decoracao_valor', formatNumberToCurrencyString(valorCalculado, false), { shouldValidate: true });
      }
    }
  };

  const handlePercentKeyDown = (
    field: 'entrada_percentual' | 'decoracao_percentual' | 'closing_costs_percentual',
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    const target = event.target as HTMLInputElement;
    const value = target.value;
    const cursorPosition = target.selectionStart || 0;
    
    if (event.key === 'Backspace' || event.key === 'Delete') {
      // Previne o comportamento padrão
        event.preventDefault();
      
      let newValue = value;
      
      // Remove o símbolo % se estiver tentando apagar ele
      if (value.endsWith('%') && cursorPosition === value.length) {
        newValue = value.slice(0, -1);
      } else if (event.key === 'Backspace' && cursorPosition > 0) {
        // Remove o caractere antes do cursor
        newValue = value.slice(0, cursorPosition - 1) + value.slice(cursorPosition);
      } else if (event.key === 'Delete' && cursorPosition < value.length) {
        // Remove o caractere na posição do cursor
        newValue = value.slice(0, cursorPosition) + value.slice(cursorPosition + 1);
      }
      
      // Se o valor ficou vazio, limpa o campo
      if (!newValue || newValue === '%') {
        setValue(field, '', { shouldValidate: true });
        if (field === 'entrada_percentual') {
          setValue('entrada_valor', '', { shouldValidate: true });
        } else if (field === 'decoracao_percentual') {
          setValue('decoracao_valor', '', { shouldValidate: true });
        }
        return;
      }
      
      // Atualiza o valor mantendo o cursor na posição correta
      handlePercentInputChange(field, newValue);
      setTimeout(() => {
        const input = document.getElementById(field) as HTMLInputElement;
        if (input) {
          const newPosition = event.key === 'Backspace' ? cursorPosition - 1 : cursorPosition;
          input.setSelectionRange(newPosition, newPosition);
        }
      }, 0);
    }
  };
  
  const [activeEntradaTab, setActiveEntradaTab] = useState("valor");
  const [activeDecoracaoTab, setActiveDecoracaoTab] = useState("valor");

  // Efeito para sincronizar os valores de abas
  useEffect(() => {
    const valorImovelNum = parseCurrencyUSD(watchValorImovel);
    if (isNaN(valorImovelNum) || valorImovelNum <= 0) return;

    if (activeEntradaTab === 'percentual') {
      const percentStr = watch('entrada_percentual').replace('%','');
      const percentNum = parseInt(percentStr, 10);
      if (!isNaN(percentNum)) {
        const valor = (percentNum / 100) * valorImovelNum;
        setValue('entrada_valor', formatNumberToCurrencyString(valor), { shouldValidate: true });
      }
    } else {
      const valorNum = parseCurrencyUSD(watch('entrada_valor'));
      if (!isNaN(valorNum)) {
        const percent = Math.round((valorNum / valorImovelNum) * 100);
        setValue('entrada_percentual', `${percent}%`, { shouldValidate: true });
      }
    }
  }, [watchValorImovel, activeEntradaTab, watch('entrada_valor'), watch('entrada_percentual')]);
  
  useEffect(() => {
    const valorImovelNum = parseCurrencyUSD(watchValorImovel);
    if (isNaN(valorImovelNum) || valorImovelNum <= 0 || !watchIncluirDecoracao) return;

    if (activeDecoracaoTab === 'percentual') {
      const percentStr = watch('decoracao_percentual').replace('%','');
      const percentNum = parseInt(percentStr, 10);
      if (!isNaN(percentNum)) {
        const valor = (percentNum / 100) * valorImovelNum;
        setValue('decoracao_valor', formatNumberToCurrencyString(valor), { shouldValidate: true });
      }
    } else {
      const valorNum = parseCurrencyUSD(watch('decoracao_valor'));
      if (!isNaN(valorNum)) {
        const percent = Math.round((valorNum / valorImovelNum) * 100);
        setValue('decoracao_percentual', `${percent}%`, { shouldValidate: true });
      }
    }
  }, [watchValorImovel, activeDecoracaoTab, watch('decoracao_valor'), watch('decoracao_percentual'), watchIncluirDecoracao]);

  const onNext = async () => {
    const fieldsToValidate = fieldsToValidatePerStep(currentStep);
    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      handleNextStep();
    }
  };

  const handleLogoChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onLogoChange) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onLogoChange(file, reader.result as string);
      };
      reader.readAsDataURL(file);
    } else if (onLogoChange) {
      onLogoChange(null, null);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <div className="mb-4">
              <Label htmlFor="condominio">Condomínio</Label>
              <Controller
                name="condominio"
                control={control}
                render={({ field }) => (
                  <CondominiumAutocomplete
                    value={field.value}
                    onChange={field.onChange}
                    condominiums={condominiumNames}
                  />
                )}
              />
              {errors.condominio && <p className="text-sm text-red-500">{errors.condominio.message}</p>}
            </div>

            <div className="mb-4">
              <Label htmlFor="valor_imovel">Valor do Imóvel</Label>
              <Controller
                name="valor_imovel"
                control={control}
                render={({ field }) => {
                  return (
                    <Input
                      id="valor_imovel"
                      placeholder="Ex: 650.000"
                      {...field}
                      value={field.value || ''}
                      onChange={(e) => handleCurrencyInputChange('valor_imovel', e.target.value)}
                      disabled={isFormProcessing}
                    />
                  );
                }}
              />
              {errors.valor_imovel && <p className="text-sm text-red-500">{errors.valor_imovel.message}</p>}
            </div>
            
            <div className="mb-4">
            <Label>Entrada</Label>
              <Tabs defaultValue="valor" className="w-full mt-1">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="valor">Valor ($)</TabsTrigger>
                  <TabsTrigger value="percentual">Percentual (%)</TabsTrigger>
                </TabsList>
                <TabsContent value="valor" className="mt-2">
                <Controller
                  name="entrada_valor"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="entrada_valor"
                        placeholder="Ex: 90.000"
                      {...field}
                      onChange={(e) => handleCurrencyInputChange('entrada_valor', e.target.value)}
                      disabled={isFormProcessing || !watchValorImovel || parseCurrencyUSD(watchValorImovel) <= 0}
                    />
                  )}
                />
                  {errors.entrada_valor && !errors.entrada_percentual && <p className="text-sm text-red-500">{errors.entrada_valor.message}</p>}
                </TabsContent>
                <TabsContent value="percentual" className="mt-2">
                <Controller
                  name="entrada_percentual"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="entrada_percentual"
                      placeholder="Ex: 20"
                      {...field}
                      onChange={(e) => handlePercentInputChange('entrada_percentual', e.target.value)}
                      onKeyDown={(e) => handlePercentKeyDown('entrada_percentual', e)}
                      disabled={isFormProcessing || !watchValorImovel || parseCurrencyUSD(watchValorImovel) <= 0}
                    />
                  )}
                />
                {errors.entrada_percentual && <p className="text-sm text-red-500">{errors.entrada_percentual.message}</p>}
                </TabsContent>
              </Tabs>
              {errors.entrada_valor && errors.entrada_valor.type === 'manual' && errors.entrada_valor.message?.includes("Preencha o valor ou o percentual da entrada") && (
                <p className="text-sm text-red-500 mt-1">{errors.entrada_valor.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <Label htmlFor="taxa_juros_anual_financiamento">Taxa de Juros Anual (%)</Label>
                    <Controller name="taxa_juros_anual_financiamento" control={control} render={({ field }) => <Input id="taxa_juros_anual_financiamento" placeholder="Ex: 6.5" {...field} disabled={isFormProcessing} />} />
                    {errors.taxa_juros_anual_financiamento && <p className="text-sm text-red-500">{errors.taxa_juros_anual_financiamento.message}</p>}
                </div>
                <div>
                    <Label htmlFor="prazo_financiamento_anos">Prazo Financiamento (Anos)</Label>
                    <Controller name="prazo_financiamento_anos" control={control} render={({ field }) => <Input id="prazo_financiamento_anos" placeholder="Ex: 30" {...field} disabled={isFormProcessing} />} />
                    {errors.prazo_financiamento_anos && <p className="text-sm text-red-500">{errors.prazo_financiamento_anos.message}</p>}
              </div>
            </div>

            <div className="mb-4 space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="incluir_decoracao" className="flex flex-col space-y-1">
                  <span>Incluir Custos de Decoração?</span>
                  <span className="font-normal leading-snug text-muted-foreground">
                    Adicionar custos de decoração média.
                  </span>
                </Label>
                <Controller
                  name="incluir_decoracao"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      id="incluir_decoracao"
                      checked={field.value ?? false}
                      onCheckedChange={field.onChange}
                      disabled={isFormProcessing}
                    />
                  )}
                />
              </div>
              {watchIncluirDecoracao && (
                <div className="grid grid-cols-2 gap-4 pt-2">
                     <div>
                        <Label htmlFor="decoracao_valor">Valor da Decoração</Label>
                        <Controller
                            name="decoracao_valor"
                            control={control}
                            render={({ field }) => (
                            <Input
                                id="decoracao_valor"
                                placeholder="Ex: 10.000"
                                {...field}
                                onChange={(e) => handleCurrencyInputChange('decoracao_valor', e.target.value)}
                                disabled={isFormProcessing || !watchValorImovel || parseCurrencyUSD(watchValorImovel) <= 0}
                            />
                            )}
                        />
                        {errors.decoracao_valor && <p className="text-sm text-red-500">{errors.decoracao_valor.message}</p>}
                    </div>
                    <div>
                        <Label htmlFor="decoracao_percentual">% sobre V. Imóvel (Decoração)</Label>
                        <Controller
                            name="decoracao_percentual"
                            control={control}
                            render={({ field }) => (
                            <Input
                                id="decoracao_percentual"
                                placeholder="Ex: 5"
                                {...field}
                                onChange={(e) => handlePercentInputChange('decoracao_percentual', e.target.value)}
                                onKeyDown={(e) => handlePercentKeyDown('decoracao_percentual', e)}
                                disabled={isFormProcessing || !watchValorImovel || parseCurrencyUSD(watchValorImovel) <= 0}
                            />
                            )}
                        />
                        {errors.decoracao_percentual && <p className="text-sm text-red-500">{errors.decoracao_percentual.message}</p>}
                    </div>    
                </div>
              )}
            </div>

            <div className="mb-6 space-y-2">
                <div className="flex items-center justify-between">
                    <Label htmlFor="incluir_closing_costs" className="flex flex-col space-y-1">
                    <span>Incluir Custos de Fechamento (Closing Costs)?</span>
                    <span className="font-normal leading-snug text-muted-foreground">
                        Adicione as despesas de transação ao cálculo.
                    </span>
                    </Label>
                    <Controller
                    name="incluir_closing_costs"
                    control={control}
                    render={({ field }) => (
                        <Switch
                        id="incluir_closing_costs"
                        checked={field.value ?? false}
                        onCheckedChange={field.onChange}
                        disabled={isFormProcessing}
                        />
                    )}
                    />
                </div>
                {watchIncluirClosingCosts && (
                    <div className="pt-2">
                        <Label htmlFor="closing_costs_percentual">% sobre V. Imóvel (Custos de Fechamento)</Label>
                        <Controller
                            name="closing_costs_percentual"
                            control={control}
                            render={({ field }) => (
                            <Input
                                id="closing_costs_percentual"
                                placeholder="Ex: 2"
                                {...field}
                                onChange={(e) => handlePercentInputChange('closing_costs_percentual', e.target.value)}
                                onKeyDown={(e) => handlePercentKeyDown('closing_costs_percentual', e)}
                                disabled={isFormProcessing || !watchValorImovel || parseCurrencyUSD(watchValorImovel) <= 0}
                            />
                            )}
                        />
                        {errors.closing_costs_percentual && <p className="text-sm text-red-500">{errors.closing_costs_percentual.message}</p>}
                    </div>
                )}
            </div>
          </>
        );
      case 2:
        return (
            <>
                <div className="mb-4">
                    <Label htmlFor="localizacao">Localização</Label>
                    <Controller
                        name="localizacao"
                        control={control}
                        render={({ field }) => (
                  <LocationAutocomplete
                    value={field.value}
                    onChange={field.onChange}
                  />
                        )}
                    />
                    {errors.localizacao && <p className="text-sm text-red-500">{errors.localizacao.message}</p>}
                </div>

                <div className="mb-4">
                    <Label htmlFor="modelo">Modelo do Imóvel</Label>
                    <Controller
                        name="modelo"
                        control={control}
                        render={({ field }) => (
                  <Input 
                    id="modelo" 
                    placeholder="Ex: Casa, Apartamento" 
                    {...field} 
                    disabled={isFormProcessing} 
                  />
                        )}
                    />
                    {errors.modelo && <p className="text-sm text-red-500">{errors.modelo.message}</p>}
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <FormField
                        control={control}
                            name="quartos"
                        render={({ field }) => (
                              <FormItem>
                                <FormLabel>Quartos</FormLabel>
                                <FormControl>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent>
                                      {[...Array(15)].map((_, i) => (
                                  <SelectItem key={i + 1} value={String(i + 1)}>
                                          {i + 1} quarto{i > 0 ? 's' : ''}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                            </Select>
                                </FormControl>
                              </FormItem>
                        )}
                        />
                    </div>
                        <div className="flex items-center space-x-2 pt-8">
                          <FormField
                        control={control}
                            name="piscina"
                        render={({ field }) => (
                              <FormItem>
                                <FormLabel>Piscina Privativa?</FormLabel>
                                <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              disabled={isFormProcessing}
                            />
                                </FormControl>
                              </FormItem>
                          )}
                        />
                            </div>
                      </div>
                    </div>
                </div>
            </>
        );
      case 3: 
        return (
          <>
            <div className="mb-4">
              <Label htmlFor="logo">Logo do Corretor (Opcional)</Label>
              <Input 
                id="logo" 
                type="file" 
                accept="image/*" 
                onChange={handleLogoChangeHandler} 
                disabled={isFormProcessing || isLogoUploading}
              />
              {isLogoUploading && <p className="text-sm text-blue-500 mt-1">Enviando logo...</p>}
              {logoPreviewUrl && (
                <div className="mt-4">
                  <img src={logoPreviewUrl} alt="Pré-visualização do Logo" className="max-w-xs h-auto rounded-md border" />
                </div>
              )}
            </div>
          </>
        );
      default:
        return <div>Etapa desconhecida</div>;
    }
  };

  useEffect(() => {
    if (currentStep === 2) {
      // Se não houver initialData ou se initialData não tiver localizacao/modelo,
      // garante que os campos comecem vazios para nova entrada na Etapa 2.
      if (!initialData?.localizacao) {
        setValue('localizacao', '');
      }
      if (!initialData?.modelo) {
        setValue('modelo', '');
      }
    }
  }, [currentStep, setValue, initialData]);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit(internalSubmitHandler)} className="space-y-6">
          <div className="mb-6">
             <Progress value={(currentStep / totalSteps) * 100} className="w-full" />
             <p className="text-sm text-center mt-2 text-gray-600">Etapa {currentStep} de {totalSteps}</p>
          </div>
          
          {renderStepContent()}

          <div className="flex justify-between items-center pt-6">
            <button 
              type="button" 
              onClick={handlePrevStep} 
              disabled={currentStep === 1 || isFormProcessing}
              className="shadow-[0_4px_14px_0_rgb(0,118,255,39%)] hover:shadow-[0_6px_20px_rgba(0,118,255,23%)] hover:bg-[rgba(0,118,255,0.9)] px-8 py-2 bg-[#0070f3] rounded-md text-white font-light transition duration-200 ease-linear flex items-center disabled:opacity-50"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Anterior
            </button>
            {currentStep < totalSteps && (
              <button 
                type="button" 
                onClick={onNext}
                className="ml-auto shadow-[0_4px_14px_0_rgb(0,118,255,39%)] hover:shadow-[0_6px_20px_rgba(0,118,255,23%)] hover:bg-[rgba(0,118,255,0.9)] px-8 py-2 bg-[#0070f3] rounded-md text-white font-light transition duration-200 ease-linear flex items-center"
              >
                Próximo <ArrowRight size={16} className="ml-2" />
              </button>
            )}
            {currentStep === totalSteps && (
              <button 
                type="submit" 
                disabled={isFormProcessing || isLogoUploading}
                className="w-full sm:w-auto shadow-[0_4px_14px_0_rgb(0,118,255,39%)] hover:shadow-[0_6px_20px_rgba(0,118,255,23%)] hover:bg-[rgba(0,118,255,0.9)] px-8 py-2 bg-[#0070f3] rounded-md text-white font-light transition duration-200 ease-linear flex items-center justify-center disabled:opacity-50"
              >
                {isFormProcessing ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Analisar ROI
              </button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default TomROIForm; 