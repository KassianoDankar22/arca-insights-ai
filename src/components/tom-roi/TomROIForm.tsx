import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Card, CardContent } from '@/components/ui/card';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Loader } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';

interface TomROIFormProps {
  onSubmit: (data: any) => void;
  isLoading: boolean;
}

const TomROIForm: React.FC<TomROIFormProps> = ({ onSubmit, isLoading }) => {
  const { control, handleSubmit, formState: { errors }, setValue, watch } = useFormContext();
  const isMobile = useIsMobile();
  const [entradaType, setEntradaType] = useState<'valor' | 'percentual'>('valor');
  
  const valorImovel = watch('valor_imovel');
  
  const handleEntradaPercentualChange = (value: string) => {
    if (valorImovel) {
      const percentage = parseFloat(value) || 0;
      const valorEntrada = (parseFloat(valorImovel) * percentage) / 100;
      setValue('entrada_valor', valorEntrada.toString());
    }
    setValue('entrada_percentual', value);
  };
  
  const handleEntradaValorChange = (value: string) => {
    if (valorImovel) {
      const entrada = parseFloat(value) || 0;
      const percentage = valorImovel ? (entrada / parseFloat(valorImovel)) * 100 : 0;
      setValue('entrada_percentual', percentage.toFixed(2));
    }
    setValue('entrada_valor', value);
  };

  const tiposInvestimento = [
    "Casa de Férias",
    "Residencial",
    "Apartamento",
    "Condomínio Fechado",
    "Chácara",
    "Chalé",
    "Resort",
    "Flat",
    "Outro"
  ];

  return (
    <Card className="bg-white/80 backdrop-blur-lg border border-gray-200 shadow-lg">
      <CardContent className={`${isMobile ? 'p-4' : 'p-6'}`}>
        <div className="text-center mb-6">
          <h2 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-semibold text-gray-800 mb-3`}>
            Tom - Análise de ROI para Imóveis
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Olá! Sou o Tom, seu assistente de ROI para imóveis. Vamos começar sua análise. Por favor, preencha os campos abaixo:
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-w-2xl mx-auto">
          <FormField
            control={control}
            name="condominio"
            rules={{ required: 'Este campo é obrigatório' }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do condomínio/projeto</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Ex: Condomínio Beira Mar" 
                    {...field} 
                    className={isMobile ? 'h-10' : 'h-12'}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="tipo_investimento"
            rules={{ required: 'Este campo é obrigatório' }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de investimento</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className={isMobile ? 'h-10' : 'h-12'}>
                      <SelectValue placeholder="Selecione o tipo de investimento" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {tiposInvestimento.map((tipo) => (
                      <SelectItem key={tipo} value={tipo}>
                        {tipo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="localizacao"
            rules={{ required: 'Este campo é obrigatório' }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Localização da propriedade</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Ex: Florianópolis, SC" 
                    {...field} 
                    className={isMobile ? 'h-10' : 'h-12'}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="modelo"
            rules={{ required: 'Este campo é obrigatório' }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Modelo da casa</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Ex: Apartamento, Casa de Praia, Chalé" 
                    {...field} 
                    className={isMobile ? 'h-10' : 'h-12'}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="quartos"
            rules={{ 
              required: 'Este campo é obrigatório',
              pattern: {
                value: /^[0-9]+$/,
                message: 'Digite apenas números'
              }
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número de quartos</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Ex: 2" 
                    type="number"
                    min="0"
                    {...field} 
                    className={isMobile ? 'h-10' : 'h-12'}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="piscina"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel>Possui piscina?</FormLabel>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="valor_imovel"
            rules={{ 
              required: 'Este campo é obrigatório',
              pattern: {
                value: /^[0-9]+(\.[0-9]+)?$/,
                message: 'Digite um valor válido'
              }
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor de compra do imóvel (R$)</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Ex: 500000" 
                    type="number"
                    step="0.01"
                    min="0"
                    {...field} 
                    className={isMobile ? 'h-10' : 'h-12'}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormItem>
            <FormLabel>Valor da entrada</FormLabel>
            <Tabs defaultValue="valor" onValueChange={(value) => setEntradaType(value as 'valor' | 'percentual')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="valor">Valor (R$)</TabsTrigger>
                <TabsTrigger value="percentual">Percentual (%)</TabsTrigger>
              </TabsList>
              <TabsContent value="valor">
                <FormField
                  control={control}
                  name="entrada_valor"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Ex: 100000"
                          type="number"
                          step="0.01"
                          min="0"
                          {...field}
                          onChange={(e) => handleEntradaValorChange(e.target.value)}
                          className={isMobile ? 'h-10' : 'h-12'}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
              <TabsContent value="percentual">
                <FormField
                  control={control}
                  name="entrada_percentual"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Ex: 20"
                          type="number"
                          step="0.01"
                          min="0"
                          max="100"
                          {...field}
                          onChange={(e) => handleEntradaPercentualChange(e.target.value)}
                          className={isMobile ? 'h-10' : 'h-12'}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>
          </FormItem>

          <div className="pt-4">
            <Button 
              type="submit" 
              disabled={isLoading}
              className={`w-full ${isMobile ? 'h-12' : 'h-14'} bg-arca-blue hover:bg-blue-600 text-white transition-colors rounded-lg`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader className="animate-spin" size={20} />
                  <span>🔍 Tom está analisando os dados...</span>
                </div>
              ) : (
                'Iniciar Análise com o Tom'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default TomROIForm;
