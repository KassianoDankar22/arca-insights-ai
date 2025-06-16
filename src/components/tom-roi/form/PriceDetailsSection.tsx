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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Control, useFormContext } from 'react-hook-form';
import { TomPropertyAnalysisInput } from '../types/analyzer-types';

interface PriceDetailsSectionProps {
  control: Control<TomPropertyAnalysisInput>;
  errors: any;
  watchedPurchasePrice: number;
  watchedInvestmentType: 'cash' | 'local_financing' | 'foreign_financing';
}

const formatNumberWithCommas = (value: string | number): string => {
  if (!value) return '';
  const number = value.toString().replace(/[^\d]/g, '');
  return number.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const parseFormattedNumber = (value: string): number => {
  return parseFloat(value.replace(/,/g, '')) || 0;
};

const PriceDetailsSection: React.FC<PriceDetailsSectionProps> = ({ 
  control, 
  errors, 
  watchedPurchasePrice,
  watchedInvestmentType 
}) => {
  const isMobile = useIsMobile();
  const { watch, setValue } = useFormContext<TomPropertyAnalysisInput>();
  const decorationEnabled = watch('decorationCostType') !== undefined;
  const decorationType = watch('decorationCostType');

  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="purchasePrice"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={`${isMobile ? 'text-sm' : ''} font-medium text-gray-700`}>
              Valor de compra (US$)
            </FormLabel>
            <FormControl>
              <Input 
                type="text"
                placeholder="Ex: 650,000" 
                {...field}
                value={formatNumberWithCommas(field.value || 0)}
                onChange={(e) => {
                  const value = parseFormattedNumber(e.target.value);
                  field.onChange(value);
                }}
                className={`${isMobile ? 'h-12' : 'h-14'} mt-1 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500`}
              />
            </FormControl>
            {errors.purchasePrice && (
              <FormMessage className="text-sm text-red-500 mt-1">
                {errors.purchasePrice.message}
              </FormMessage>
            )}
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="investmentType"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={`${isMobile ? 'text-sm' : ''} font-medium text-gray-700`}>
              Tipo de investimento
            </FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className={`${isMobile ? 'h-12' : 'h-14'} mt-1 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500`}>
                  <SelectValue placeholder="Selecione o tipo de investimento" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="cash">À vista</SelectItem>
                <SelectItem value="local_financing">Financiamento Local (EUA)</SelectItem>
                <SelectItem value="foreign_financing">Financiamento Internacional</SelectItem>
              </SelectContent>
            </Select>
            {errors.investmentType && (
              <FormMessage className="text-sm text-red-500 mt-1">
                {errors.investmentType.message}
              </FormMessage>
            )}
          </FormItem>
        )}
      />

      {(watchedInvestmentType === 'local_financing' || watchedInvestmentType === 'foreign_financing') && (
        <>
          <FormField
            control={control}
            name="downPaymentPercent"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={`${isMobile ? 'text-sm' : ''} font-medium text-gray-700`}>
                  Entrada (%)
                </FormLabel>
                <FormControl>
                  <Input 
                    type="number"
                    min="0"
                    max="100"
                    placeholder={watchedInvestmentType === 'foreign_financing' ? '25' : '20'} 
                    {...field}
                    value={field.value === undefined ? '' : field.value}
                    onChange={(e) => {
                      const value = e.target.value ? parseFloat(e.target.value) : 0;
                      field.onChange(value);
                      if (watchedPurchasePrice) {
                        setValue('downPaymentValue', (watchedPurchasePrice * value) / 100, { shouldValidate: true });
                      }
                    }}
                    className={`${isMobile ? 'h-12' : 'h-14'} mt-1 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500`}
                  />
                </FormControl>
                {errors.downPaymentPercent && (
                  <FormMessage className="text-sm text-red-500 mt-1">
                    {errors.downPaymentPercent.message}
                  </FormMessage>
                )}
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="downPaymentValue"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={`${isMobile ? 'text-sm' : ''} font-medium text-gray-700`}>
                  Valor da entrada (US$)
                </FormLabel>
                <FormControl>
                  <Input 
                    type="text"
                    placeholder={watchedPurchasePrice ? formatNumberWithCommas(watchedPurchasePrice * (watchedInvestmentType === 'foreign_financing' ? 0.25 : 0.20)) : '0'} 
                    {...field}
                    value={formatNumberWithCommas(field.value || 0)}
                    onChange={(e) => {
                      const value = parseFormattedNumber(e.target.value);
                      field.onChange(value);
                      if (watchedPurchasePrice) {
                        setValue('downPaymentPercent', (value / watchedPurchasePrice) * 100, { shouldValidate: true });
                      }
                    }}
                    className={`${isMobile ? 'h-12' : 'h-14'} mt-1 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500`}
                  />
                </FormControl>
                {errors.downPaymentValue && (
                  <FormMessage className="text-sm text-red-500 mt-1">
                    {errors.downPaymentValue.message}
                  </FormMessage>
                )}
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="closingCostsValue"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={`${isMobile ? 'text-sm' : ''} font-medium text-gray-700`}>
                  Custos de cartório (US$)
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder={watchedPurchasePrice ? formatNumberWithCommas(watchedPurchasePrice * 0.03) : '0'} 
                    {...field}
                    value={formatNumberWithCommas(field.value || 0)}
                    onChange={(e) => {
                      const value = parseFormattedNumber(e.target.value);
                      field.onChange(value);
                    }}
                    className={`${isMobile ? 'h-12' : 'h-14'} mt-1 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500`}
                  />
                </FormControl>
                {errors.closingCostsValue && (
                  <FormMessage className="text-sm text-red-500 mt-1">
                    {errors.closingCostsValue.message}
                  </FormMessage>
                )}
              </FormItem>
            )}
          />

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="hasClosingCosts"
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                onChange={(e) => {
                  if (!e.target.checked) {
                    setValue('closingCostsValue', undefined);
                  } else {
                    setValue('closingCostsValue', watchedPurchasePrice ? watchedPurchasePrice * 0.03 : 0);
                  }
                }}
                checked={watch('closingCostsValue') !== undefined}
              />
              <label htmlFor="hasClosingCosts" className={`${isMobile ? 'text-sm' : ''} font-medium text-gray-700`}>
                Incluir custos de cartório?
              </label>
            </div>
          </div>
        </>
      )}

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="hasDecoration"
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            onChange={(e) => {
              if (!e.target.checked) {
                setValue('decorationCostType', undefined);
                setValue('decorationCostValue', undefined);
              } else {
                setValue('decorationCostType', 'percentage');
                setValue('decorationCostValue', 15);
              }
            }}
            checked={decorationEnabled}
          />
          <label htmlFor="hasDecoration" className={`${isMobile ? 'text-sm' : ''} font-medium text-gray-700`}>
            Incluir custos de decoração?
          </label>
        </div>

        {decorationEnabled && (
          <>
            <FormField
              control={control}
              name="decorationCostType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={`${isMobile ? 'text-sm' : ''} font-medium text-gray-700`}>
                    Tipo de custo de decoração
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col sm:flex-row gap-4 mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="percentage" id="percentage" />
                        <FormLabel htmlFor="percentage">Percentual do Valor</FormLabel>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="fixed_amount" id="fixed_amount" />
                        <FormLabel htmlFor="fixed_amount">Valor Fixo</FormLabel>
                      </div>
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="decorationCostValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={`${isMobile ? 'text-sm' : ''} font-medium text-gray-700`}>
                    {decorationType === 'percentage' ? 'Percentual de decoração (%)' : 'Valor da decoração (US$)'}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type={decorationType === 'percentage' ? 'number' : 'text'}
                      min="0"
                      placeholder={decorationType === 'percentage' ? '15' : '25,000'}
                      {...field}
                      value={decorationType === 'percentage' 
                        ? (field.value === undefined ? '' : field.value)
                        : formatNumberWithCommas(field.value || 0)}
                      onChange={(e) => {
                        const value = decorationType === 'percentage'
                          ? (e.target.value ? parseFloat(e.target.value) : 0)
                          : parseFormattedNumber(e.target.value);
                        field.onChange(value);
                      }}
                      className={`${isMobile ? 'h-12' : 'h-14'} mt-1 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500`}
                    />
                  </FormControl>
                  {errors.decorationCostValue && (
                    <FormMessage className="text-sm text-red-500 mt-1">
                      {errors.decorationCostValue.message}
                    </FormMessage>
                  )}
                </FormItem>
              )}
            />
          </>
        )}
      </div>

      <FormField
        control={control}
        name="annualOccupancyRate"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={`${isMobile ? 'text-sm' : ''} font-medium text-gray-700`}>
              Taxa de ocupação anual (%)
            </FormLabel>
            <FormControl>
              <Input
                type="number"
                min="0"
                max="100"
                placeholder="75" 
                {...field}
                value={field.value === undefined ? '' : field.value}
                onChange={(e) => {
                  const value = e.target.value ? parseFloat(e.target.value) : 0;
                  field.onChange(value);
                }}
                className={`${isMobile ? 'h-12' : 'h-14'} mt-1 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500`}
              />
            </FormControl>
            {errors.annualOccupancyRate && (
              <FormMessage className="text-sm text-red-500 mt-1">
                {errors.annualOccupancyRate.message}
              </FormMessage>
            )}
          </FormItem>
        )}
      />
    </div>
  );
};

export default PriceDetailsSection;
