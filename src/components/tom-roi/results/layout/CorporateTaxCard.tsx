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
import { Calculator } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface CorporateTaxCardProps {
  grossIncome: number;
  totalExpenses: number;
  netIncome: number;
  formatCurrency: (value: number) => string;
}

const CorporateTaxCard: React.FC<CorporateTaxCardProps> = ({
  grossIncome,
  totalExpenses,
  netIncome,
  formatCurrency
}) => {
  // Cálculo simplificado de imposto (exemplo)
  const taxRate = 0.15; // 15% de imposto
  const estimatedTax = netIncome * taxRate;
  const netAfterTax = netIncome - estimatedTax;

  return (
    <Card className="p-4">
      <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
        <Calculator size={18} className="text-purple-500" />
        RESUMO FISCAL ANUAL
      </h3>
      <div className="space-y-3">
        <div>
          <p className="text-sm text-gray-500">Receita Bruta</p>
          <p className="text-base font-semibold text-green-500">+{formatCurrency(grossIncome)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Despesas Totais</p>
          <p className="text-base font-semibold text-red-500">-{formatCurrency(totalExpenses)}</p>
        </div>
        <div className="border-t pt-3">
          <p className="text-sm text-gray-500">Lucro Tributável</p>
          <p className="text-base font-semibold">{formatCurrency(netIncome)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Imposto Estimado (15%)</p>
          <p className="text-base font-semibold text-red-500">-{formatCurrency(estimatedTax)}</p>
        </div>
        <div className="border-t pt-3">
          <p className="text-sm text-gray-500">Lucro Líquido após Impostos</p>
          <p className="text-xl font-bold text-blue-500">{formatCurrency(netAfterTax)}</p>
        </div>
      </div>
    </Card>
  );
};

export default CorporateTaxCard; 