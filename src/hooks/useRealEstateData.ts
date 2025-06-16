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

import { useState, useEffect, useCallback } from 'react';
import { useCurrencyData } from './useCurrencyData';

export interface RealEstateStats {
  averageRoi: number;
  roiChange: number;
  opportunities: number;
  opportunitiesChange: number;
  averagePrice: number;
  priceChange: number;
  isLoading: boolean;
}

export const useRealEstateData = () => {
  const { dollarRate, isLoading: isCurrencyLoading } = useCurrencyData();
  const [stats, setStats] = useState<RealEstateStats>({
    averageRoi: 8.6,
    roiChange: 1.2,
    opportunities: 24,
    opportunitiesChange: 4,
    averagePrice: 0, // Será calculado em dólares
    priceChange: 2.5,
    isLoading: true
  });

  const fetchRealEstateData = useCallback(() => {
    // Simulando uma chamada de API com dados reais
    // Em um ambiente de produção, isso seria substituído por uma chamada de API real
    
    // Valor em reais (R$)
    const priceInBRL = 457500;
    
    if (dollarRate) {
      // Converter para dólares
      const priceInUSD = priceInBRL / dollarRate;
      
      setStats(prev => ({
        ...prev,
        averagePrice: priceInUSD,
        isLoading: false
      }));
    }
  }, [dollarRate]);

  useEffect(() => {
    if (dollarRate) {
      fetchRealEstateData();
    }
  }, [dollarRate, fetchRealEstateData]);

  return {
    ...stats,
    isLoading: stats.isLoading || isCurrencyLoading,
    fetchRealEstateData
  };
}; 