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

interface PriceRangeProps {
  weeklyHigh: number | null;
  weeklyLow: number | null;
  dollarRate: number | null;
  timePeriod: 'today' | 'week' | 'month';
}

export const PriceRange: React.FC<PriceRangeProps> = ({
  weeklyHigh,
  weeklyLow,
  dollarRate,
  timePeriod
}) => {
  if (weeklyHigh === null || weeklyLow === null) return null;
  
  const rangePercentage = dollarRate && weeklyLow && weeklyHigh
    ? ((dollarRate - weeklyLow) / (weeklyHigh - weeklyLow)) * 100
    : 0;

  // Ensure percentage is between 0 and 100
  const clampedPercentage = Math.min(Math.max(rangePercentage, 0), 100);

  return (
    <div className="mt-3 pt-3 border-t border-gray-100">
      <div className="flex justify-between text-xs">
        <div>
          <div className="text-gray-600">Mínima {timePeriod === 'today' ? 'hoje' : timePeriod === 'week' ? 'da semana' : 'do mês'}</div>
          <div className="font-semibold">R$ {weeklyLow.toFixed(2)}</div>
        </div>
        <div>
          <div className="text-gray-600 text-right">Máxima {timePeriod === 'today' ? 'hoje' : timePeriod === 'week' ? 'da semana' : 'do mês'}</div>
          <div className="font-semibold text-right">R$ {weeklyHigh.toFixed(2)}</div>
        </div>
      </div>
      <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-arca-light-blue via-arca-blue to-arca-dark-blue" 
          style={{ width: `${clampedPercentage}%` }}
        />
      </div>
    </div>
  );
};
