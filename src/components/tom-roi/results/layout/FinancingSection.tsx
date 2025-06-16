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
import { ArrowDownRight } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface FinancingSectionProps {
  propertyValue: number;
  downPaymentAmount: number;
  downPaymentPercentage: number;
  monthlyPayment: number;
  interestRate: number;
  formatCurrency: (value: number) => string;
  formatPercentage: (value: number) => string;
}

const FinancingSection: React.FC<FinancingSectionProps> = ({
  propertyValue,
  downPaymentAmount,
  downPaymentPercentage,
  monthlyPayment,
  interestRate,
  formatCurrency,
  formatPercentage
}) => {
  return (
    <Card className="p-5">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <ArrowDownRight size={20} className="text-blue-500" />
        FINANCIAMENTO
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500">Valor do imóvel</p>
          <p className="text-base font-semibold">{formatCurrency(propertyValue)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Entrada ({formatPercentage(downPaymentPercentage)})</p>
          <p className="text-base font-semibold">{formatCurrency(downPaymentAmount)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Parcela mensal</p>
          <p className="text-base font-semibold text-red-500">
            -{formatCurrency(monthlyPayment)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Taxa de juros</p>
          <p className="text-base font-semibold">{formatPercentage(interestRate)}</p>
        </div>
      </div>
    </Card>
  );
};

export default FinancingSection; 