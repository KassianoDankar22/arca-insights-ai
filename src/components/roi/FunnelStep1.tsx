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
import { Button } from '@/components/ui/button';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFormContext } from 'react-hook-form';
import type { FormValues } from './types';

interface FunnelStep1Props {
  onSubmit: () => void;
}

const FunnelStep1: React.FC<FunnelStep1Props> = ({ onSubmit }) => {
  const { control } = useFormContext<FormValues>();
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Informações Básicas do Imóvel</h2>
        <p className="text-gray-500">Preencha os detalhes básicos da propriedade para análise.</p>
      </div>
      
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
                  <SelectValue placeholder="Selecione o tipo de investimento" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="shortTerm">Aluguel de Temporada</SelectItem>
                <SelectItem value="longTerm">Aluguel de Longo Prazo</SelectItem>
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
            <FormLabel>Nome do Projeto/Propriedade</FormLabel>
            <FormControl>
              <Input placeholder="Ex: Condomínio Beira Mar" {...field} />
            </FormControl>
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="location"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Localização</FormLabel>
            <FormControl>
              <Input placeholder="Ex: Florianópolis, SC" {...field} />
            </FormControl>
          </FormItem>
        )}
      />
      
      <div className="pt-4">
        <Button 
          type="button" 
          onClick={onSubmit}
          className="w-full bg-arca-blue hover:bg-blue-600 text-white transition-colors rounded-lg"
        >
          Continuar
        </Button>
      </div>
    </div>
  );
};

export default FunnelStep1;
