
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

import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface HistoryEntry {
  time: string;
  rate: number;
  change: number;
}

interface CurrencyHistoryProps {
  history: HistoryEntry[];
}

export const CurrencyHistory: React.FC<CurrencyHistoryProps> = ({ history }) => {
  if (history.length === 0) {
    return (
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Histórico do Dia</h4>
        <p className="text-xs text-gray-500">Nenhum histórico disponível</p>
      </div>
    );
  }

  return (
    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
      <h4 className="text-sm font-medium text-gray-700 mb-2">Histórico do Dia</h4>
      <div className="space-y-2 max-h-32 overflow-y-auto">
        {history.slice(0, 5).map((entry, index) => {
          const isPositive = entry.change > 0;
          const isNegative = entry.change < 0;
          const isNeutral = entry.change === 0;
          
          return (
            <div key={index} className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <span className="text-gray-600">{entry.time}</span>
                <span className="font-medium">R$ {entry.rate.toFixed(4)}</span>
              </div>
              <div className={`flex items-center space-x-1 ${
                isPositive ? 'text-green-600' : 
                isNegative ? 'text-red-600' : 
                'text-gray-500'
              }`}>
                {isPositive && <TrendingUp size={12} />}
                {isNegative && <TrendingDown size={12} />}
                {isNeutral && <Minus size={12} />}
                <span className="font-medium">
                  {entry.change > 0 ? '+' : ''}{entry.change.toFixed(2)}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
