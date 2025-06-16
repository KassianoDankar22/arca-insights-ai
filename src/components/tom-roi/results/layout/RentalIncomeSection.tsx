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
import { DollarSign } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface RentalIncomeSectionProps {
  monthlyRent: number;
  annualRent: number;
  dailyRate: number;
  occupancyRate: number;
  formatCurrency: (value: number) => string;
  formatPercentage: (value: number) => string;
}

const RentalIncomeSection: React.FC<RentalIncomeSectionProps> = ({
  monthlyRent,
  annualRent,
  dailyRate,
  occupancyRate,
  formatCurrency,
  formatPercentage
}) => {
  return (
    <Card className="p-5">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <DollarSign size={20} className="text-green-500" />
        RECEITA DE ALUGUEL
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500">Diária média</p>
          <p className="text-base font-semibold">{formatCurrency(dailyRate)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Ocupação</p>
          <p className="text-base font-semibold">{formatPercentage(occupancyRate)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Aluguel mensal</p>
          <p className="text-base font-semibold text-green-500">
            +{formatCurrency(monthlyRent)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Aluguel anual</p>
          <p className="text-base font-semibold text-green-500">
            +{formatCurrency(annualRent)}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default RentalIncomeSection; 