
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import type { FormValues } from './types';

interface FunnelStep2Props {
  form: UseFormReturn<FormValues>;
  onSubmit: () => void;
  onBack: () => void;
}

const FunnelStep2: React.FC<FunnelStep2Props> = ({ form, onSubmit, onBack }) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-semibold mb-2 text-gray-800`}>
          Detalhes do Imóvel
        </h3>
        <p className={`text-gray-500 ${isMobile ? 'text-sm px-3' : ''}`}>
          Informe as características básicas do imóvel que deseja analisar
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-5">
        <div className="grid grid-cols-1 gap-4">
          <FormField
            control={form.control}
            name="investmentType"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={isMobile ? 'text-sm' : ''}>Tipo de Investimento</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className={isMobile ? 'h-10 text-sm' : 'h-12'}>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-white">
                    <SelectItem value="casa_ferias">Casa de Férias</SelectItem>
                    <SelectItem value="residencial">Residencial</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="projectName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={isMobile ? 'text-sm' : ''}>Nome do Condomínio</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Ex: Windsor at Westside" className={isMobile ? 'h-10 text-sm' : 'h-12'} />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={isMobile ? 'text-sm' : ''}>Localização</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Ex: Kissimmee, Davenport" className={isMobile ? 'h-10 text-sm' : 'h-12'} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="modelType"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={isMobile ? 'text-sm' : ''}>Modelo da Casa</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Ex: Townhouse, Lakeshore" className={isMobile ? 'h-10 text-sm' : 'h-12'} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        
        <div className={`pt-3 flex ${isMobile ? 'mt-2' : 'mt-4'} justify-between`}>
          <Button 
            type="button"
            variant="outline"
            onClick={onBack}
            className={isMobile ? 'px-4 py-1.5 text-sm' : 'px-6 py-2'}
          >
            <ArrowLeft size={isMobile ? 16 : 18} className={isMobile ? 'mr-1.5' : 'mr-2'} />
            Voltar
          </Button>
          
          <Button 
            type="submit"
            className={`${isMobile ? 'px-6 py-4 text-sm' : 'px-8 py-6'} h-auto bg-arca-purple hover:bg-arca-dark-purple text-white rounded-lg flex items-center justify-center gap-2`}
          >
            <span>Avançar</span>
            <ArrowRight size={isMobile ? 16 : 18} />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default FunnelStep2;
