
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Calculator, ArrowLeft } from 'lucide-react';
import LogoUploader from './LogoUploader';
import type { FormValues } from './types';

interface FunnelStep3Props {
  form: UseFormReturn<FormValues>;
  logoPreview: string | null;
  handleLogoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveLogo: () => void;
  onSubmit: () => void;
  onBack: () => void;
}

const FunnelStep3: React.FC<FunnelStep3Props> = ({ 
  form, 
  logoPreview,
  handleLogoChange,
  handleRemoveLogo,
  onSubmit, 
  onBack 
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-semibold mb-3 text-gray-800">
          Detalhes Finais e Logo
        </h3>
        <p className="text-gray-500">
          Complete as informações para calcular seu ROI e adicione sua logo ao relatório
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="bedrooms"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número de Quartos</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Array.from({ length: 15 }, (_, i) => i + 1).map(num => (
                      <SelectItem key={num} value={num.toString()}>
                        {num}
                      </SelectItem>
                    ))}
                    <SelectItem value="15+">15+</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="hasPool"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Piscina</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Possui piscina?" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Sim">Sim</SelectItem>
                    <SelectItem value="Não">Não</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="purchasePrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor de Compra (R$)</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    type="number" 
                    placeholder="Ex: 500000"
                    className="h-12"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <div>
            <FormLabel>Logo da Empresa (opcional)</FormLabel>
            <div className="mt-1">
              <LogoUploader 
                logoPreview={logoPreview} 
                onLogoChange={handleLogoChange}
                onRemoveLogo={handleRemoveLogo}
              />
            </div>
          </div>
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
            <Calculator size={18} className="mr-1" />
            <span>Calcular ROI</span>
          </Button>
        </div>
      </form>
    </div>
  );
};

export default FunnelStep3;
