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
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, ChevronsUp } from 'lucide-react';

interface PropertyData {
  monthlyRent: number;
  annualRent: number;
  occupancyRate: number;
  grossIncome: number;
  netIncome: number;
  roi: number;
  capRate: number;
  cashOnCash: number;
}

interface MetricsSummaryProps {
  propertyData: {
    roiPercentSobreEntrada: number;
    totalAnnualReturn: number;
  };
  formatCurrency: (value: number) => string;
  resultText: string;
  propertyValue: number;
}

const MetricsSummary: React.FC<MetricsSummaryProps> = ({
  propertyData,
  formatCurrency,
  resultText,
  propertyValue
}) => {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* ROI sobre Investimento */}
      <div className="bg-blue-500 p-4 rounded-lg shadow-md text-white">
        <div className="flex items-center mb-1">
          <TrendingUp size={20} className="mr-2" />
          <h3 className="text-sm font-semibold uppercase tracking-wider">ROI sobre Investimento</h3>
        </div>
        <p className="text-3xl font-bold text-white">
          {propertyData.roiPercentSobreEntrada.toFixed(1)}%
        </p>
        <p className="text-xs text-blue-100">
          Retorno sobre valor investido (entrada)
        </p>
      </div>

      {/* Retorno Anual Total */}
      <div className="bg-green-500 p-4 rounded-lg shadow-md text-white">
        <div className="flex items-center mb-1">
          <ChevronsUp size={20} className="mr-2" />
          <h3 className="text-sm font-semibold uppercase tracking-wider">Retorno Anual Total</h3>
        </div>
        <p className="text-3xl font-bold text-white">
          {formatCurrency(propertyData.totalAnnualReturn)}
        </p>
        <p className="text-xs text-green-100">
          Aluguel + valorização anual
        </p>
      </div>
    </div>
  );
};

export default MetricsSummary; 