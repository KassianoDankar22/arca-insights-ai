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
import { TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface ROISummaryCardProps {
  roiPercentage: number;
  formatPercentage: (value: number) => string;
}

const ROISummaryCard: React.FC<ROISummaryCardProps> = ({
  roiPercentage,
  formatPercentage
}) => {
  const roiColor = roiPercentage >= 0 ? 'text-sky-600' : 'text-red-600';

  return (
    <Card className="bg-sky-500 p-4 text-white">
      <div className="flex items-center mb-1">
        <TrendingUp size={18} className="mr-2" />
        <h3 className="text-xs font-semibold uppercase tracking-wider">ROI sobre Entrada</h3>
      </div>
      <p className={`text-2xl font-bold ${roiColor}`}>{formatPercentage(roiPercentage)}</p>
      <p className="text-xs text-sky-100 mt-1">
        (Aluguel líquido + Valorização) / Valor da entrada
      </p>
    </Card>
  );
};

export default ROISummaryCard; 