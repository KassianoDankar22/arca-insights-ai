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

interface AnnualReturnCardProps {
  totalAnnualReturn: number;
  formatCurrency: (value: number) => string;
}

const AnnualReturnCard: React.FC<AnnualReturnCardProps> = ({
  totalAnnualReturn,
  formatCurrency
}) => {
  return (
    <Card className="bg-green-500 p-4 text-white">
      <div className="flex items-center mb-1">
        <DollarSign size={18} className="mr-2" />
        <h3 className="text-xs font-semibold uppercase tracking-wider">Retorno Anual Total</h3>
      </div>
      <p className="text-2xl font-bold text-white">{formatCurrency(totalAnnualReturn)}</p>
      <p className="text-xs text-green-100 mt-1">
        Aluguel líquido + Valorização anual
      </p>
    </Card>
  );
};

export default AnnualReturnCard; 