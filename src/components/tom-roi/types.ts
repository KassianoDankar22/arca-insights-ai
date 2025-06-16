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

import { z } from 'zod';

export interface TomRoiFormValues {
  projectName: string;
  location: string;
  modelType: string;
  bedrooms: string;
  hasPool: boolean;
  purchasePrice: string;
  investmentType?: 'cash' | 'local_financing' | 'foreign_financing';
  downPaymentInput?: string;
  closingCostsInput?: string;
  decorationCostType?: 'percentage' | 'fixed_amount';
  decorationCostInput?: string;
  annualOccupancyRateInput?: string;
}

export interface TomRoiResultData {
  property: {
    value: number;
    downPayment: number;
    financedAmount: number;
    interestRate: number;
    term: number;
  };
  rental: {
    averageRate: number;
    occupancyRate: number;
    monthlyGross: number;
    yearlyGross: number;
  };
  expenses: {
    management: number;
    pool: number;
    utilities: number;
    hoa: number;
    propertyTax: number;
    insurance: number;
    totalMonthly: number;
  };
  roi: {
    netMonthlyIncome: number;
    afterFinancing: number;
    annualAppreciation: number;
    totalAnnual: number;
  };
  formData: TomPropertyAnalysisInput;
}

export const tomPropertyAnalysisSchema = z.object({
  projectName: z.string().min(1, 'Nome do projeto é obrigatório'),
  location: z.string().min(1, 'Localização é obrigatória'),
  modelType: z.string().min(1, 'Tipo de modelo é obrigatório'),
  bedrooms: z.number().min(1, 'Número de quartos é obrigatório'),
  hasPool: z.boolean(),
  purchasePrice: z.number().min(1, 'Valor de compra é obrigatório'),
  investmentType: z.enum(['cash', 'local_financing', 'foreign_financing']),
  downPaymentPercent: z.number().min(0, 'Percentual de entrada não pode ser negativo').max(100, 'Percentual de entrada não pode ser maior que 100%').optional(),
  downPaymentValue: z.number().min(0, 'Valor da entrada não pode ser negativo').optional(),
  closingCostsValue: z.number().min(0, 'Valor dos custos de cartório não pode ser negativo'),
  decorationCostType: z.enum(['percentage', 'fixed_amount']).optional(),
  decorationCostValue: z.number().min(0, 'Valor da decoração não pode ser negativo').optional(),
  annualOccupancyRate: z.number().min(1, 'Taxa de ocupação é obrigatória').max(100, 'Taxa de ocupação não pode ser maior que 100%'),
  brokerLogoUrl: z.string().nullable().optional(),
});

export type TomPropertyAnalysisInput = z.infer<typeof tomPropertyAnalysisSchema>;
