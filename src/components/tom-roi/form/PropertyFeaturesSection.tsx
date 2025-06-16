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
import { useIsMobile } from '@/hooks/use-mobile';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Control } from 'react-hook-form';
import { TomPropertyAnalysisInput } from '../types/analyzer-types';

interface PropertyFeaturesSectionProps {
  control: Control<TomPropertyAnalysisInput>;
  errors: any;
}

const PropertyFeaturesSection: React.FC<PropertyFeaturesSectionProps> = ({ control, errors }) => {
  const isMobile = useIsMobile();

  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="modelType"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={`${isMobile ? 'text-sm' : ''} font-medium text-gray-700`}>
              Tipo do Modelo
            </FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className={`${isMobile ? 'h-12' : 'h-14'} mt-1 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500`}>
                  <SelectValue placeholder="Selecione o tipo do modelo" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="standard">Padrão</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
                <SelectItem value="luxury">Luxo</SelectItem>
              </SelectContent>
            </Select>
            {errors.modelType && (
              <FormMessage className="text-sm text-red-500 mt-1">
                {errors.modelType.message}
              </FormMessage>
            )}
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="bedrooms"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={`${isMobile ? 'text-sm' : ''} font-medium text-gray-700`}>
              Número de Quartos
            </FormLabel>
            <FormControl>
              <Input 
                type="number"
                min="0"
                placeholder="4" 
                {...field}
                value={field.value === undefined ? '' : field.value}
                onChange={(e) => {
                  const value = e.target.value ? parseInt(e.target.value) : 0;
                  field.onChange(value);
                }}
                className={`${isMobile ? 'h-12' : 'h-14'} mt-1 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500`}
              />
            </FormControl>
            {errors.bedrooms && (
              <FormMessage className="text-sm text-red-500 mt-1">
                {errors.bedrooms.message}
              </FormMessage>
            )}
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="hasPool"
        render={({ field }) => (
          <FormItem>
            <div className="flex items-center justify-between">
              <FormLabel className={`${isMobile ? 'text-sm' : ''} font-medium text-gray-700`}>
                Possui Piscina
              </FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="data-[state=checked]:bg-blue-500"
                />
              </FormControl>
            </div>
            {errors.hasPool && (
              <FormMessage className="text-sm text-red-500 mt-1">
                {errors.hasPool.message}
              </FormMessage>
            )}
          </FormItem>
        )}
      />
    </div>
  );
};

export default PropertyFeaturesSection;
