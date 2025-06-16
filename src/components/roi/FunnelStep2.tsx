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
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import type { FormValues } from './types';

interface FunnelStep2Props {
  onSubmit: () => void;
  onBack: () => void;
}

const FunnelStep2: React.FC<FunnelStep2Props> = ({ onSubmit, onBack }) => {
  const { control, handleSubmit } = useFormContext<FormValues>();
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

      <form onSubmit={handleSubmit(() => onSubmit())} className="space-y-5">
        <div className="grid grid-cols-1 gap-4">
          <FormField
            control={control}
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
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={control}
            name="projectName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={isMobile ? 'text-sm' : ''}>Nome do Condomínio</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Ex: Windsor at Westside" className={isMobile ? 'h-10 text-sm' : 'h-12'} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={isMobile ? 'text-sm' : ''}>Localização</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Ex: Kissimmee, Davenport" className={isMobile ? 'h-10 text-sm' : 'h-12'} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="modelType"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={isMobile ? 'text-sm' : ''}>Modelo da Casa</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Ex: Townhouse, Lakeshore" className={isMobile ? 'h-10 text-sm' : 'h-12'} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className={`pt-3 flex ${isMobile ? 'mt-2' : 'mt-4'} justify-between`}>
          <button 
            type="button"
            onClick={onBack}
            className={`flex items-center shadow-[0_4px_14px_0_rgb(0,118,255,39%)] hover:shadow-[0_6px_20px_rgba(0,118,255,23%)] hover:bg-[rgba(0,118,255,0.9)] px-8 py-2 bg-[#0070f3] rounded-md text-white font-light transition duration-200 ease-linear ${isMobile ? 'px-4 py-1.5 text-sm h-auto' : 'px-6 py-2'}`}
          >
            <ArrowLeft size={isMobile ? 16 : 18} className={isMobile ? 'mr-1.5' : 'mr-2'} />
            Voltar
          </button>
          
          <button 
            type="submit"
            className={`shadow-[0_4px_14px_0_rgb(0,118,255,39%)] hover:shadow-[0_6px_20px_rgba(0,118,255,23%)] hover:bg-[rgba(0,118,255,0.9)] px-8 py-2 bg-[#0070f3] rounded-md text-white font-light transition duration-200 ease-linear flex items-center justify-center gap-2 ${isMobile ? 'px-6 py-4 text-sm' : 'px-8 py-6'} h-auto`}
          >
            <span>Avançar</span>
            <ArrowRight size={isMobile ? 16 : 18} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default FunnelStep2;
