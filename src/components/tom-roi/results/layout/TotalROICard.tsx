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
import { DollarSign, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface TotalROICardProps {
  monthlyNetIncome: number;
  annualNetIncome: number;
  appreciationAmount: number;
  appreciationPercentage: number;
  formatCurrency: (value: number) => string;
  formatPercentage: (value: number) => string;
}

const TotalROICard: React.FC<TotalROICardProps> = ({
  monthlyNetIncome,
  annualNetIncome,
  appreciationAmount,
  appreciationPercentage,
  formatCurrency,
  formatPercentage
}) => {
  return (
    <Card className="p-4">
      <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
        <DollarSign size={18} className="text-blue-500" />
        FLUXO DE CAIXA LÍQUIDO
      </h3>
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-600">Mensal</p>
          <p className="text-xl font-bold text-blue-500">{formatCurrency(monthlyNetIncome)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Anual</p>
          <p className="text-xl font-bold text-purple-500">{formatCurrency(annualNetIncome)}</p>
        </div>
      </div>

      <div className="border-t mt-4 pt-4">
        <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
          <TrendingUp size={18} className="text-orange-500" />
          VALORIZAÇÃO ANUAL
        </h3>
        <div>
          <p className="text-sm text-gray-600">Valor estimado</p>
          <p className="text-xl font-bold text-orange-500">{formatCurrency(appreciationAmount)}</p>
          <p className="text-sm text-gray-500">
            {formatPercentage(appreciationPercentage)} ao ano
          </p>
        </div>
      </div>
    </Card>
  );
};

export default TotalROICard; 