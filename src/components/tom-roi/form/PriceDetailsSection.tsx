
import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useIsMobile } from '@/hooks/use-mobile';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { formatCurrency } from '../utils/form-utils';

const PriceDetailsSection: React.FC = () => {
  const { control, watch, setValue } = useFormContext();
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

  const handleCurrencyInput = (e: React.ChangeEvent<HTMLInputElement>, field: any) => {
    const value = e.target.value.replace(/[^0-9.]/g, '');
    field.onChange(value);
  };

  return (
    <>
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
            <FormLabel>Valor de compra do imóvel ($)</FormLabel>
            <FormControl>
              <Input 
                placeholder="Ex: 500000" 
                type="text"
                {...field} 
                value={field.value ? formatCurrency(field.value) : ''}
                onChange={(e) => handleCurrencyInput(e, field)}
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
            <TabsTrigger value="valor">Valor ($)</TabsTrigger>
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
                      type="text"
                      value={field.value ? formatCurrency(field.value) : ''}
                      onChange={(e) => {
                        handleCurrencyInput(e, field);
                        handleEntradaValorChange(e.target.value.replace(/[^0-9.]/g, ''));
                      }}
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
    </>
  );
};

export default PriceDetailsSection;
