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
import { Button } from '@/components/ui/button';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Calculator, ArrowLeft } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import LogoUploader from './LogoUploader';
import type { FormValues } from './types';

interface FunnelStep3Props {
  logoPreview: string | null;
  handleLogoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveLogo: () => void;
  onSubmit: () => void;
  onBack: () => void;
}

const FunnelStep3: React.FC<FunnelStep3Props> = ({ 
  logoPreview,
  handleLogoChange,
  handleRemoveLogo,
  onSubmit, 
  onBack 
}) => {
  const { control, handleSubmit } = useFormContext<FormValues>();
  const isMobile = useIsMobile();
  
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-semibold mb-2 text-gray-800`}>
          Detalhes Finais e Logo
        </h3>
        <p className={`text-gray-500 ${isMobile ? 'text-sm px-3' : ''}`}>
          Complete as informações para calcular seu ROI e adicione sua logo ao relatório
        </p>
      </div>

      <form onSubmit={handleSubmit(() => onSubmit())} className="space-y-5">
        <div className={`grid ${isMobile ? 'grid-cols-1 gap-3' : 'grid-cols-1 md:grid-cols-2 gap-4'}`}>
          <FormField
            control={control}
            name="bedrooms"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={isMobile ? 'text-sm' : ''}>Número de Quartos</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className={isMobile ? 'h-10 text-sm' : 'h-12'}>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-white max-h-[40vh] overflow-y-auto">
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
                <FormLabel className={isMobile ? 'text-sm' : ''}>Piscina</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className={isMobile ? 'h-10 text-sm' : 'h-12'}>
                      <SelectValue placeholder="Possui piscina?" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-white">
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
                <FormLabel className={isMobile ? 'text-sm' : ''}>Valor de Compra (R$)</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    type="number" 
                    placeholder="Ex: 500000"
                    className={isMobile ? 'h-10 text-sm' : 'h-12'}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <div>
            <FormLabel className={isMobile ? 'text-sm' : ''}>Logo da Empresa (opcional)</FormLabel>
            <div className="mt-1">
              <LogoUploader 
                logoPreview={logoPreview} 
                onLogoChange={handleLogoChange}
                onRemoveLogo={handleRemoveLogo}
              />
            </div>
          </div>
        </div>
        
        <div className={`pt-3 flex ${isMobile ? 'mt-2' : 'mt-4'} justify-between`}>
          <button 
            type="button"
            onClick={onBack}
            className={`flex items-center shadow-[0_4px_14px_0_rgb(0,118,255,39%)] hover:shadow-[0_6px_20px_rgba(0,118,255,23%)] hover:bg-[rgba(0,118,255,0.9)] px-8 py-2 bg-[#0070f3] rounded-md text-white font-light transition duration-200 ease-linear ${isMobile ? 'px-4 py-1.5 text-sm' : 'px-6 py-2'}`}
          >
            <ArrowLeft size={isMobile ? 16 : 18} className={isMobile ? 'mr-1.5' : 'mr-2'} />
            Voltar
          </button>
          
          <button 
            type="submit"
            className={`shadow-[0_4px_14px_0_rgb(0,118,255,39%)] hover:shadow-[0_6px_20px_rgba(0,118,255,23%)] hover:bg-[rgba(0,118,255,0.9)] px-8 py-2 bg-[#0070f3] rounded-md text-white font-light transition duration-200 ease-linear flex items-center justify-center gap-2 ${isMobile ? 'px-6 py-4 text-sm' : 'px-8 py-6'} h-auto`}
          >
            <Calculator size={isMobile ? 16 : 18} className={isMobile ? 'mr-1' : 'mr-1.5'} />
            <span>Calcular ROI</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default FunnelStep3;
