
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Calculator } from 'lucide-react';
import LogoUploader from './LogoUploader';

export type FormValues = {
  investmentType: string;
  projectName: string;
  location: string;
  modelType: string;
  bedrooms: string;
  hasPool: string;
  purchasePrice: string;
  aluguelMensal: string;
  despesasMensais: string;
  logoImage: File | null;
};

interface PropertyInfoFormProps {
  form: UseFormReturn<FormValues>;
  logoPreview: string | null;
  handleLogoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveLogo: () => void;
  onSubmit: () => void;
}

const PropertyInfoForm: React.FC<PropertyInfoFormProps> = ({ 
  form, 
  logoPreview, 
  handleLogoChange, 
  handleRemoveLogo,
  onSubmit 
}) => {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <LogoUploader 
          logoPreview={logoPreview} 
          onLogoChange={handleLogoChange}
          onRemoveLogo={handleRemoveLogo}
        />

        <div className="md:col-span-2 space-y-4">
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
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="casa_ferias">Casa de Férias</SelectItem>
                      <SelectItem value="residencial">Residencial</SelectItem>
                      <SelectItem value="comercial">Comercial</SelectItem>
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
                  <FormLabel>Nome do Condomínio/Projeto</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ex: Windsor at Westside" />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Localização</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Ex: Kissimmee, Davenport" />
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
                <Input {...field} placeholder="Ex: Townhouse, Lakeshore" />
              </FormControl>
            </FormItem>
          )}
        />
        
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
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                    <SelectItem key={num} value={num.toString()}>
                      {num}
                    </SelectItem>
                  ))}
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
                  <SelectTrigger>
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
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="aluguelMensal"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Aluguel Mensal (R$)</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  type="number"
                  placeholder="Ex: 2500" 
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="despesasMensais"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Despesas Mensais (R$)</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  type="number"
                  placeholder="Ex: 500" 
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>

      <Button 
        type="submit"
        onClick={onSubmit}
        className="w-full mt-6 bg-arca-purple hover:bg-arca-dark-purple"
      >
        <Calculator className="mr-2" size={18} />
        Analisar ROI
      </Button>
    </div>
  );
};

export default PropertyInfoForm;
