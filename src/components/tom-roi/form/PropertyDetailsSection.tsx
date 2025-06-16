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
import { Control } from 'react-hook-form';
import { TomPropertyAnalysisInput } from '../types/analyzer-types';

interface PropertyDetailsSectionProps {
  control: Control<TomPropertyAnalysisInput>;
  errors: any;
}

const PropertyDetailsSection: React.FC<PropertyDetailsSectionProps> = ({ control, errors }) => {
  const isMobile = useIsMobile();

  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="projectName"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={`${isMobile ? 'text-sm' : ''} font-medium text-gray-700`}>
              Nome do Projeto
            </FormLabel>
            <FormControl>
              <Input 
                placeholder="Ex: Casa em Orlando" 
                {...field}
                className={`${isMobile ? 'h-12' : 'h-14'} mt-1 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500`}
              />
            </FormControl>
            {errors.projectName && (
              <FormMessage className="text-sm text-red-500 mt-1">
                {errors.projectName.message}
              </FormMessage>
            )}
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="location"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={`${isMobile ? 'text-sm' : ''} font-medium text-gray-700`}>
              Localização
            </FormLabel>
            <FormControl>
              <Input 
                placeholder="Ex: Orlando, FL" 
                {...field}
                className={`${isMobile ? 'h-12' : 'h-14'} mt-1 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500`}
              />
            </FormControl>
            {errors.location && (
              <FormMessage className="text-sm text-red-500 mt-1">
                {errors.location.message}
              </FormMessage>
            )}
          </FormItem>
        )}
      />
    </div>
  );
};

export default PropertyDetailsSection;
