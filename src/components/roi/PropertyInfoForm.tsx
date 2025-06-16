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
 * ========================================
 */


import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calculator } from 'lucide-react';
import LogoUploader from './LogoUploader';
import type { FormValues } from './types';

interface PropertyInfoFormProps {
  logoPreview: string | null;
  handleLogoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveLogo: () => void;
  onSubmit: () => void;
}

const PropertyInfoForm: React.FC<PropertyInfoFormProps> = ({ 
  logoPreview, 
  handleLogoChange, 
  handleRemoveLogo,
  onSubmit 
}) => {
  const { control } = useFormContext<FormValues>();
  
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
              control={control}
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
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            
            <FormField
              control={control}
              name="projectName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Condomínio</FormLabel>
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
          control={control}
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
          control={control}
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
          control={control}
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
          control={control}
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
          control={control}
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
      </div>

      <Button 
        type="button"
        onClick={onSubmit}
        className="mt-6 bg-arca-purple hover:bg-arca-dark-purple mx-auto px-6 py-2 flex items-center justify-center"
      >
        <Calculator className="mr-2" size={18} />
        Analisar ROI
      </Button>
    </div>
  );
};

export default PropertyInfoForm;
