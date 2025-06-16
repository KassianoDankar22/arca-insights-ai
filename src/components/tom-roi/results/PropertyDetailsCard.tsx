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
import { Bed, Bath, Waves, Home } from 'lucide-react';

interface PropertyDetailsCardProps {
  model: string;
  bedrooms: number;
  hasPiscina: boolean;
  propertyValue: number;
  resultText?: string;
  cardRef?: React.RefObject<HTMLDivElement>;
  formatCurrency?: (value: number | string | undefined, options?: { showCents?: boolean, abbreviate?: boolean }) => string;
}

const PropertyDetailsCard: React.FC<PropertyDetailsCardProps> = ({ 
  model, 
  bedrooms, 
  hasPiscina, 
  propertyValue,
  resultText,
  cardRef,
  formatCurrency
}) => {
  // Formatar o valor da propriedade
  const formattedValue = formatCurrency ? 
    formatCurrency(propertyValue, { showCents: false }) : 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(propertyValue);

  return (
    <div ref={cardRef}>
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Detalhes da Propriedade</h2>
        <div className="flex items-center flex-wrap gap-3">
          <div className="flex items-center bg-gray-100 px-3 py-1 rounded-full text-gray-700">
            <Home size={16} className="mr-1" />
            <span className="text-sm">{model}</span>
          </div>
          <div className="flex items-center bg-gray-100 px-3 py-1 rounded-full text-gray-700">
            <Bed size={16} className="mr-1" />
            <span className="text-sm">{bedrooms} quartos</span>
          </div>
          <div className="flex items-center bg-gray-100 px-3 py-1 rounded-full text-gray-700">
            <Bath size={16} className="mr-1" />
            <span className="text-sm">{bedrooms} suítes</span>
          </div>
          {hasPiscina && (
            <div className="flex items-center bg-gray-100 px-3 py-1 rounded-full text-gray-700">
              <Waves size={16} className="mr-1" />
              <span className="text-sm">Piscina</span>
            </div>
          )}
          <div className="flex items-center bg-gray-100 px-3 py-1 rounded-full text-indigo-700 font-semibold">
            <span className="text-sm">{formattedValue}</span>
          </div>
        </div>
      </div>
      
      {resultText && (
        <Card className="bg-white/80 border border-gray-200 shadow-sm">
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">
              {resultText.length > 300
                ? resultText.substring(0, 300) + '...'
                : resultText}
            </p>
            {resultText.length > 300 && (
              <button className="text-xs text-blue-600 mt-2 hover:underline">
                Ler análise completa
              </button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PropertyDetailsCard;
