
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import type { FormValues } from './types';

interface FunnelStep2Props {
  form: UseFormReturn<FormValues>;
  onSubmit: () => void;
  onBack: () => void;
}

const FunnelStep2: React.FC<FunnelStep2Props> = ({ form, onSubmit, onBack }) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-semibold mb-3 text-gray-800">
          Detalhes do Imóvel
        </h3>
        <p className="text-gray-500">
          Informe as características básicas do imóvel que deseja analisar
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="investmentType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Investimento</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
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
                <FormLabel>Nome do Condomínio</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Ex: Windsor at Westside" className="h-12" />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Localização</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Ex: Kissimmee, Davenport" className="h-12" />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="modelType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Modelo da Casa</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Ex: Townhouse, Lakeshore" className="h-12" />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        
        <div className="pt-4 flex justify-between">
          <Button 
            type="button"
            variant="outline"
            onClick={onBack}
            className="px-6 py-2"
          >
            <ArrowLeft size={18} className="mr-2" />
            Voltar
          </Button>
          
          <Button 
            type="submit"
            className="px-8 py-6 h-auto bg-arca-purple hover:bg-arca-dark-purple text-white rounded-lg flex items-center justify-center gap-2"
          >
            <span>Avançar</span>
            <ArrowRight size={18} />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default FunnelStep2;
