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
 * Component: TomROIAnalyzer - Main ROI Analysis Engine
 * ========================================
 */

import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useIsMobile } from '@/hooks/use-mobile';
import TomROIForm from './TomROIForm';
import TomROIResults from './TomROIResults';
import AnalysisLoading from './results/AnalysisLoading';
import { ROIAnalysisResult } from './types/analyzer-types';
import { useTomAssistant } from './hooks/useTomAssistant';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth';
import ErrorBoundary from '@/components/ErrorBoundary';
import AnalysisLimitGuard from '@/components/AnalysisLimitGuard';
import { useAnalysisLimits } from '@/hooks/useAnalysisLimits';
import { extractNumbersFromText, formatCurrency } from '@/components/tom-roi/utils/formatter';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, ArrowLeft, FileQuestion } from 'lucide-react';
import { calcularROIUnificado, ROIInputData } from './utils/roi-calculator';
import { FormValues as TomROIFormValues } from './TomROIForm';

interface TomROIAnalyzerProps {
  showBackButton?: boolean;
  backPath?: string;
  backText?: string;
}

const TOTAL_FORM_STEPS = 3; // Definindo o número total de etapas do formulário

// Função auxiliar para extrair despesas comuns com nomes variados
const extrairDespesaComum = (texto: string, termosVariados: string[], valorPadrao: number): number => {
  for (const termo of termosVariados) {
    const regexComum = new RegExp(`${termo}[^:]*:?\\s*\\$?(\\d+[.,]\\d*)`, 'i');
    const match = texto.match(regexComum);
    if (match) {
      return parseFloat(match[1].replace(/,/g, ''));
    }
  }
  return valorPadrao;
};

// Componente para exibir erros de API de forma amigável
const ApiErrorDisplay = ({ 
  error, 
  onRetry, 
  onBack 
}: { 
  error: Error | null; 
  onRetry: () => void; 
  onBack: () => void; 
}) => {
  // Determinar tipo de erro para melhor feedback
  const isTimeout = error?.message?.includes('Timeout') || error?.message?.includes('tempo limite');
  const isDataError = error?.message?.includes('dados insuficientes') || error?.message?.includes('valor do imóvel');
  const isApiError = error?.message?.includes('API') || error?.message?.includes('OpenAI');
  
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="mb-6 rounded-full p-4 bg-amber-50 text-amber-500">
        <AlertTriangle size={48} />
      </div>
      
      <h2 className="text-2xl font-bold mb-3">
        {isTimeout ? 'Tempo limite excedido' : 
         isDataError ? 'Dados insuficientes para análise' : 
         isApiError ? 'Problema de comunicação com a API' : 
         'Não foi possível completar a análise'}
      </h2>
      
      <div className="max-w-md mb-6">
        <p className="text-gray-600 mb-4">
          {isTimeout ? 
            'A API está demorando muito para responder. Isso geralmente acontece quando há muitas solicitações simultâneas.' :
           isDataError ? 
            'A OpenAI não conseguiu calcular o ROI porque alguns dados importantes estão faltando.' :
           isApiError ?
            'Ocorreu um problema na comunicação com a OpenAI. Este é um problema temporário.' :
            'Ocorreu um erro inesperado durante a análise do seu investimento.'}
        </p>
        
        <p className="text-gray-600 font-medium">
          {isTimeout ? 
            'Tente novamente mais tarde quando o tráfego estiver menor.' :
           isDataError ? 
            'Verifique se preencheu todos os campos do formulário com valores realistas.' :
           isApiError ?
            'Aguarde alguns minutos e tente novamente.' :
            'Tente novamente ou contate o suporte se o problema persistir.'}
        </p>
      </div>
      
      <div className="flex flex-wrap gap-3 justify-center">
        <Button 
          onClick={onBack} 
          variant="outline" 
          className="flex items-center gap-2"
        >
          <ArrowLeft size={16} /> 
          Voltar ao formulário
        </Button>
        
        <Button 
          onClick={onRetry} 
          variant="default" 
          className="flex items-center gap-2"
        >
          <RefreshCw size={16} /> 
          Tentar novamente
        </Button>
      </div>
    </div>
  );
};

// Componente principal
const TomROIAnalyzer: React.FC<TomROIAnalyzerProps> = ({ 
  showBackButton = false,
  backPath = '/meus-rois',
  backText = 'Voltar para Meus ROIs'
}) => {
  const isMobile = useIsMobile();
  const resultRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { refetchUsage } = useAnalysisLimits();
  const { 
    isLoading: isAnalysisLoadingFromHook,
    progress, 
    analyzeROI, 
    isApiAvailable,
    currentError
  } = useTomAssistant();
  
  // Estado local para controlar o loading do formulário antes de chamar a IA
  const [isFormProcessing, setIsFormProcessing] = useState(false); 
  const [result, setResult] = useState<ROIAnalysisResult | null>(null);
  const [uploadedLogoFile, setUploadedLogoFile] = useState<File | null>(null);
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(null);
  const [uploadedLogoStorageUrl, setUploadedLogoStorageUrl] = useState<string | null>(null);
  
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [analysisSaved, setAnalysisSaved] = useState(false);
  const [apiError, setApiError] = useState<Error | null>(null);
  const [currentAnalysisId, setCurrentAnalysisId] = useState<string | null>(null);
  
  const [uploadMode, setUploadMode] = useState<'offline' | 'supabase'>('offline');
  
  const [currentStep, setCurrentStep] = useState(1);
  
  const methods = useForm<TomROIFormValues>({
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
    }
  });
  const { watch, trigger } = methods;

  // Função para calcular valores base com dados do formulário e texto da IA
  const calcularValoresBase = useCallback((dadosFormulario: TomROIFormValues, textoAnaliseIA?: string) => {
    // Prioriza dados do formulário, depois tenta extrair do texto da IA se disponível
    let valorImovel = parseFloat(dadosFormulario.valor_imovel || '0');
    let entradaPercentual = parseFloat(dadosFormulario.entrada_percentual || '20'); // Default 20%
    let entradaValor = parseFloat(dadosFormulario.entrada_valor || '0');

    if (textoAnaliseIA) {
        const valorImovelMatchIA = textoAnaliseIA.match(/Valor da Propriedade:\s*\$?([\d,.]+)/i);
        if (valorImovelMatchIA) valorImovel = parseFloat(valorImovelMatchIA[1].replace(/,/g, ''));

        const entradaMatchIA = textoAnaliseIA.match(/Entrada\s*\(([^)]+)%\):\s*\$?([\d,.]+)/i);
        if (entradaMatchIA) {
            entradaPercentual = parseFloat(entradaMatchIA[1]);
            entradaValor = parseFloat(entradaMatchIA[2].replace(/,/g, ''));
        }
    }

    if (entradaValor <= 0 && valorImovel > 0 && entradaPercentual > 0) {
      entradaValor = valorImovel * (entradaPercentual / 100);
    } else if (entradaValor > 0 && valorImovel > 0 && entradaPercentual <= 0) {
      entradaPercentual = (entradaValor / valorImovel) * 100;
    }
    // Garante que percentual e valor sejam consistentes se ambos forem fornecidos ou um for zero
    else if (entradaValor > 0 && valorImovel > 0 && entradaPercentual > 0 && Math.abs(valorImovel * (entradaPercentual / 100) - entradaValor) > 1) { // Tolerância de $1
        // Se houver uma discrepância significativa, recalcula o percentual com base no valor da entrada.
        entradaPercentual = (entradaValor / valorImovel) * 100;
    }

    const valorFinanciado = valorImovel > entradaValor ? valorImovel - entradaValor : 0;
    
    // Taxa de juros e prazo
    let taxaJuros = 7; // Padrão
    let prazoAnos = 30; // Padrão
    if (textoAnaliseIA) {
        const taxaJurosMatch = textoAnaliseIA.match(/Taxa de Juros Anual:?\s*(\d+[.,]?\d*)%/i);
        if (taxaJurosMatch) taxaJuros = parseFloat(taxaJurosMatch[1].replace(',', '.'));
        const prazoMatch = textoAnaliseIA.match(/Prazo do Financiamento:?\s*(\d+)\s*anos/i);
        if (prazoMatch) prazoAnos = parseInt(prazoMatch[1]);
    }

    const taxaMensal = taxaJuros / 100 / 12;
    const numPagamentos = prazoAnos * 12;

    return {
      valorImovel,
      entradaValor,
      entradaPercentual,
      valorFinanciado,
      taxaJuros,
      prazoAnos,
      taxaMensal,
      numPagamentos
    };
  }, []);

  // Função para extrair despesas do texto da IA
  const extrairDespesa = (texto: string, nomeDespesa: string, valorPadrao: number): number => {
    const regex = new RegExp(`${nomeDespesa}[^:]*:?\\s*\\$?(\\d+[.,]\\d*)`, 'i');
    const match = texto.match(regex);
    return match ? parseFloat(match[1].replace(/,/g, '')) : valorPadrao;
  };

  // Função para garantir que os buckets do Supabase existam
  const ensureStorageBuckets = async () => {
    try {
      const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
      
      if (bucketsError) {
        console.error('Erro ao listar buckets:', bucketsError);
        return false;
      }

      const requiredBuckets = ['logos', 'analises'];
      for (const bucketName of requiredBuckets) {
        if (!buckets?.find(b => b.name === bucketName)) {
          const { error: createError } = await supabase.storage.createBucket(bucketName, {
            public: false,
            allowedMimeTypes: ['image/*'],
            fileSizeLimit: 1024 * 1024 * 2 // 2MB
          });
          if (createError) {
            console.error(`Erro ao criar bucket '${bucketName}':`, createError);
            return false;
          }
        }
      }
      return true;
    } catch (e) {
      console.error('Erro inesperado na verificação de buckets:', e);
      return false;
    }
  };

  const handleLogoChange = async (file: File | null, dataUrl: string | null) => {
    setLogoPreviewUrl(dataUrl); 
    setUploadedLogoFile(file);

    if (file && uploadMode === 'supabase') {
      setIsUploadingLogo(true);
      
      const bucketsOk = await ensureStorageBuckets();
      if (!bucketsOk) {
        toast.error("Falha ao verificar o armazenamento. O logo não pode ser salvo.");
          setIsUploadingLogo(false);
          return;
        }

        const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}_${Date.now()}.${fileExt}`;
      const filePath = `public/${fileName}`;
        
      const { error: uploadError } = await supabase.storage
          .from('logos')
        .upload(filePath, file, { upsert: true });

        if (uploadError) {
        toast.error("Falha ao enviar o logo.");
        console.error("Erro de upload do logo:", uploadError);
          setIsUploadingLogo(false);
          return;
        }

      const { data: urlData } = supabase.storage.from('logos').getPublicUrl(filePath);
      setUploadedLogoStorageUrl(urlData.publicUrl);
      toast.success("Logo enviado com sucesso!");
      setIsUploadingLogo(false);
    }
  };

  const resetAnalysis = () => {
    setResult(null);
    setApiError(null);
    setIsFormProcessing(false); 
    setAnalysisSaved(false);
    setUploadedLogoFile(null);
    setLogoPreviewUrl(null);
    setUploadedLogoStorageUrl(null);
    setCurrentStep(1); // Volta para a primeira etapa do formulário
  };

  const handleNextStep = () => {
    if (currentStep < TOTAL_FORM_STEPS) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const convertToAnalyzerFormValues = (formData: TomROIFormValues) => {
    return {
      ...formData,
      logoUrl: uploadedLogoStorageUrl,
    };
  };

  const handleSubmitForm = async (formData: TomROIFormValues) => {
      setIsFormProcessing(true);
      setApiError(null);

    try {
      // Assegura que o logo seja enviado se existir antes de prosseguir
      if (uploadedLogoFile && !uploadedLogoStorageUrl && uploadMode === 'supabase') {
        await handleLogoChange(uploadedLogoFile, logoPreviewUrl);
      }
    
      const handleFormUpdate = (calculatedValues: Partial<TomROIFormValues>) => {
        console.log('[FORM_UPDATE] Atualizando campos com valores calculados:', calculatedValues);
        Object.entries(calculatedValues).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            methods.setValue(key as keyof TomROIFormValues, value as any, { shouldValidate: true });
          }
        });
      };

      const { result: analysisResult, propertyData } = await analyzeROI(formData, logoPreviewUrl, handleFormUpdate);
      setResult(analysisResult);
      
      if (resultRef.current) {
        resultRef.current.scrollIntoView({ behavior: 'smooth' });
      }

      // 2. Salvar o resultado da análise no Supabase
      if (user && analysisResult && !analysisSaved) {
        setIsSaving(true);
        console.log("Tentando salvar análise no banco...");
        
        try {
          const analysisPayload = {
            user_id: user.id,
            condominio: analysisResult.projectName,
            tipo_investimento: analysisResult.propertyData.tipo_investimento,
            localizacao: analysisResult.propertyData.localizacao_imovel,
            modelo: analysisResult.propertyData.modelo_imovel,
            quartos: parseInt(analysisResult.propertyData.quartos_imovel || '0', 10),
            piscina: analysisResult.propertyData.piscina_imovel,
            valor_imovel: analysisResult.propertyData.valor_imovel,
            entrada_valor: analysisResult.propertyData.valor_entrada,
            entrada_percentual: analysisResult.propertyData.percentual_entrada,
            resultado_texto: JSON.stringify({
              ...analysisResult,
              // CORREÇÃO: Incluir dados específicos de decoração e closing costs baseados na seleção do usuário
              decoracao_total: formData.incluir_decoracao ? analysisResult.propertyData.decoracao_total : 0,
              closing_costs_total: formData.incluir_closing_costs ? analysisResult.propertyData.closing_costs_total : 0,
              incluiu_decoracao: formData.incluir_decoracao || false,
              incluiu_closing_costs: formData.incluir_closing_costs || false,
              decoracao_percentual: formData.incluir_decoracao ? 
                (parseFloat(formData.decoracao_percentual?.replace('%', '') || '15')) : 0,
              closing_costs_percentual: formData.incluir_closing_costs ? 
                (parseFloat(formData.closing_costs_percentual?.replace('%', '') || '5')) : 0,
            }),
            logo_storage_url: uploadedLogoStorageUrl,
          };

          const { data: savedAnalysis, error: saveError } = await supabase
            .from('roi_analises')
            .insert(analysisPayload)
            .select()
            .single();

          if (saveError) {
            if (saveError.message.includes("violates row-level security policy")) {
              console.warn("Erro de RLS ou permissão detectado ao salvar, mas a análise foi completada com sucesso");
              toast.warning("Sua análise foi gerada, mas não pôde ser salva em seu histórico.");
            } else {
              throw saveError;
            }
          }
          
          if (savedAnalysis) {
            setAnalysisSaved(true);
            setCurrentAnalysisId(savedAnalysis.id);
            toast.success("Análise salva com sucesso no seu histórico!");
            await refetchUsage();
          }
        } catch (error) {
          console.error("Erro ao salvar a análise:", error);
          toast.error("Houve um problema ao salvar sua análise no histórico.");
        } finally {
          setIsSaving(false);
        }
      }
    } catch (error: any) {
      console.error("Erro na análise:", error);
      setApiError(error);
      setResult(null);
    } finally {
      setIsFormProcessing(false); // Garante que o form seja liberado independentemente do resultado
    }
  };

  const handleRetryAnalysis = () => {
    // Pega os dados atuais do formulário e tenta reenviar
    const currentFormData = methods.getValues();
    handleSubmitForm(currentFormData);
  };

  const getFieldsForStep = (step: number): (keyof TomROIFormValues)[] => {
    switch(step) {
      case 1:
        return ['condominio', 'valor_imovel', 'entrada_valor', 'entrada_percentual'];
      case 2:
        return ['localizacao', 'modelo', 'quartos'];
      case 3:
        return []; // Nenhum campo obrigatório na etapa de logo
      default:
        return [];
    }
  };

  const renderContent = () => {
    const isAnalysisLoading = isFormProcessing || isAnalysisLoadingFromHook;
    
    if (isAnalysisLoading) {
      return <AnalysisLoading stage={progress.stage} percentage={progress.percentage} />;
    }
    
    if (apiError) {
      return <ApiErrorDisplay error={apiError} onRetry={handleRetryAnalysis} onBack={resetAnalysis} />;
    }
    
    if (result) {
      return (
        <div ref={resultRef}>
        <TomROIResults 
          result={result}
          onBack={resetAnalysis}
          />
        </div>
      );
    }
    
    return (
      <>
        <div className="text-center mb-8">
          <img 
            src="/img/tom-avatar.jpg" 
                alt="Tom, seu especialista em ROI" 
                className="w-24 h-24 mx-auto rounded-full mb-4 shadow-lg" 
            />
            <h1 className="text-3xl font-bold">Análise de ROI</h1>
            <p className="text-muted-foreground mt-2">Preencha os dados abaixo para que eu possa te ajudar!</p>
        </div>

        <AnalysisLimitGuard>
            <FormProvider {...methods}>
                <TomROIForm
                  onSubmit={handleSubmitForm}
                isFormProcessing={isAnalysisLoading}
                  isLogoUploading={isUploadingLogo}
                  onLogoChange={handleLogoChange}
                  logoPreviewUrl={logoPreviewUrl}
                  currentStep={currentStep}
                  totalSteps={TOTAL_FORM_STEPS}
                  handleNextStep={handleNextStep}
                  handlePrevStep={handlePrevStep}
                  fieldsToValidatePerStep={getFieldsForStep}
                  triggerValidation={trigger}
                />
            </FormProvider>
        </AnalysisLimitGuard>
      </>
      );
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        {showBackButton && !result && (
          <Button onClick={() => navigate(backPath)} variant="outline">
            <ArrowLeft size={16} className="mr-2" />
            {backText}
          </Button>
        )}
      </div>
      <ErrorBoundary>
        {renderContent()}
      </ErrorBoundary>
    </div>
  );
};

export default TomROIAnalyzer;
