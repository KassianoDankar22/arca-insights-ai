
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useIsMobile } from '@/hooks/use-mobile';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const PropertyDetailsSection: React.FC = () => {
  const { control } = useFormContext();
  const isMobile = useIsMobile();

  const tiposInvestimento = [
    "Casas de Férias",
    "Residencial"
  ];

  return (
    <>
      <FormField
        control={control}
        name="condominio"
        rules={{ required: 'Este campo é obrigatório' }}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nome do condomínio/projeto</FormLabel>
            <FormControl>
              <Input 
                placeholder="Ex: Solara Resort, Windsor Way, Champions Gate" 
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
                placeholder="Ex: Kissimmee, Clermont, Davenport" 
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
                placeholder="Ex: Single Family, Townhouse" 
                {...field} 
                className={isMobile ? 'h-10' : 'h-12'}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default PropertyDetailsSection;
