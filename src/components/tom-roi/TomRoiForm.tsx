
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Card, CardContent } from '@/components/ui/card';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Loader } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { TomRoiFormValues } from './types';

interface TomRoiFormProps {
  onSubmit: (data: TomRoiFormValues) => void;
  isLoading: boolean;
}

const TomRoiForm: React.FC<TomRoiFormProps> = ({ onSubmit, isLoading }) => {
  const { control, handleSubmit, formState: { errors } } = useFormContext<TomRoiFormValues>();
  const isMobile = useIsMobile();

  return (
    <Card className="bg-white/80 backdrop-blur-lg border border-gray-200 shadow-lg">
      <CardContent className={`${isMobile ? 'p-4' : 'p-6'}`}>
        <div className="text-center mb-6">
          <h2 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-semibold text-gray-800 mb-3`}>
            Análise de ROI para Imóveis de Temporada
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Olá! Sou o Tom, especialista em análise de ROI para imóveis de temporada. Preencha os dados abaixo para iniciarmos sua simulação.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-w-2xl mx-auto">
          <FormField
            control={control}
            name="projectName"
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
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="location"
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
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="modelType"
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
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="bedrooms"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número de quartos</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Ex: 2, 3, 4..." 
                    {...field} 
                    className={isMobile ? 'h-10' : 'h-12'}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="hasPool"
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
            name="purchasePrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor de compra do imóvel (R$)</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Ex: 500000" 
                    type="number"
                    {...field} 
                    className={isMobile ? 'h-10' : 'h-12'}
                  />
                </FormControl>
              </FormItem>
            )}
          />

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

export default TomRoiForm;
