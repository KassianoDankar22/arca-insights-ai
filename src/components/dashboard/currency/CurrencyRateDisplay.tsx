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
import { TrendingUp, TrendingDown, Clock } from 'lucide-react';

interface CurrencyRateDisplayProps {
  dollarRate: number | null;
  isUp: boolean;
  isDown: boolean;
  percentChange: number | null;
  absoluteChange: number | null;
  lastUpdate: string;
}

export const CurrencyRateDisplay: React.FC<CurrencyRateDisplayProps> = ({
  dollarRate,
  isUp,
  isDown,
  percentChange,
  absoluteChange,
  lastUpdate,
}) => {
  const formatPercentChange = () => {
    if (percentChange === null) return '';
    return `${percentChange > 0 ? '+' : ''}${percentChange.toFixed(2)}%`;
  };
  
  const formatAbsoluteChange = () => {
    if (absoluteChange === null) return '';
    return `${absoluteChange > 0 ? '+' : ''}${Math.abs(absoluteChange).toFixed(4)}`;
  };

  return (
    <div className="flex items-start justify-between">
      <div>
        {dollarRate ? (
          <div className="flex items-center">
            <span className="text-2xl font-bold">R$ {dollarRate.toFixed(2)}</span>
            {isUp && <TrendingUp className="ml-2 text-green-500" size={20} />}
            {isDown && <TrendingDown className="ml-2 text-red-500" size={20} />}
          </div>
        ) : (
          <div className="h-8 bg-gray-200 rounded animate-pulse w-24" />
        )}
        
        {percentChange !== null && (
          <div className="text-sm mt-1">
            <span className={isUp ? 'text-green-500' : isDown ? 'text-red-500' : 'text-gray-500'}>
              {formatAbsoluteChange()} ({formatPercentChange()})
            </span>
          </div>
        )}
        
        <div className="flex items-center text-xs text-gray-500 mt-1">
          <Clock size={12} className="mr-1" /> 
          <span>Atualizado {lastUpdate}</span>
        </div>
      </div>
      <div className="text-right">
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
          isUp ? 'bg-green-100 text-green-800' : 
          isDown ? 'bg-red-100 text-red-800' : 
          'bg-blue-100 text-blue-800'
        }`}>
          {isUp ? '↑ Alta' : isDown ? '↓ Queda' : 'Estável'}
        </span>
      </div>
    </div>
  );
};
