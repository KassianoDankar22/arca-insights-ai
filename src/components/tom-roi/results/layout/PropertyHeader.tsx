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

interface PropertyHeaderProps {
  logoUrl?: string | null;
  projectName?: string;
  location?: string;
  modelType?: string; // Ex: "Family", "Townhouse"
  bedrooms?: number | string;
  hasPool?: boolean;
  purchasePrice?: number;
  formatCurrency: (value: number) => string;
}

const PropertyHeader: React.FC<PropertyHeaderProps> = ({
  logoUrl,
  projectName,
  location,
  modelType,
  bedrooms,
  hasPool,
  purchasePrice,
  formatCurrency
}) => {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          {logoUrl && (
            <img 
              src={logoUrl} 
              alt={projectName || 'Logo do Projeto'} 
              className="h-12 w-auto mr-4 object-contain" 
            />
          )}
          <div>
            <h1 className="text-2xl font-bold text-gray-800 leading-tight">
              {projectName || 'Nome do Projeto'}
            </h1>
            <p className="text-sm text-gray-500">
              {location || 'Localização não disponível'}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">Valor do Imóvel</p>
          <p className="text-2xl font-bold text-gray-800">
            {purchasePrice ? formatCurrency(purchasePrice) : formatCurrency(0)}
          </p>
        </div>
      </div>
      <div className="text-sm text-gray-600 flex items-center space-x-2">
        {modelType && <span>{modelType}</span>}
        {bedrooms && <span>• {bedrooms} quartos</span>}
        {typeof hasPool === 'boolean' && <span>• {hasPool ? 'Com piscina' : 'Sem piscina'}</span>}
      </div>
    </div>
  );
};

export default PropertyHeader; 