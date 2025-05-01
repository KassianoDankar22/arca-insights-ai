
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useIsMobile } from '@/hooks/use-mobile';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';

const PropertyFeaturesSection: React.FC = () => {
  const { control } = useFormContext();
  const isMobile = useIsMobile();

  return (
    <>
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
                className="data-[state=checked]:bg-arca-blue"
              />
            </FormControl>
          </FormItem>
        )}
      />
    </>
  );
};

export default PropertyFeaturesSection;
