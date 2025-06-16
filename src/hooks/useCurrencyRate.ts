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

import { useState, useEffect } from 'react';

interface CurrencyRate {
  rate: number;
  lastUpdate: string;
}

export const useCurrencyRate = () => {
  const [currencyData, setCurrencyData] = useState<CurrencyRate>({
    rate: 0,
    lastUpdate: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCurrencyRate = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      const data = await response.json();
      
      setCurrencyData({
        rate: data.rates.BRL,
        lastUpdate: new Date().toLocaleString('pt-BR')
      });
      setError(null);
    } catch (err) {
      setError('Erro ao buscar cotação');
      console.error('Erro ao buscar cotação:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrencyRate();
    // Atualiza a cada 5 minutos
    const interval = setInterval(fetchCurrencyRate, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return {
    currencyData,
    loading,
    error,
    refetch: fetchCurrencyRate
  };
}; 