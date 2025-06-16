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

/**
 * Formata um valor numérico para o formato de moeda em dólar
 * @param value O valor a ser formatado
 * @param options Opções adicionais de formatação
 * @returns String formatada com o valor em dólar
 */
export const formatCurrency = (
  value: number | string | undefined,
  options: { 
    showCents?: boolean,
    abbreviate?: boolean 
  } = {}
): string => {
  // Valores padrão das opções
  const { showCents = true, abbreviate = false } = options;
  
  // Se o valor for undefined ou não for um número válido
  if (value === undefined || value === null || isNaN(Number(value))) {
    return '$0';
  }
  
  // Converter para número
  const numValue = typeof value === 'string' ? parseFloat(value.replace(/[^\d.-]/g, '')) : value;
  
  // Verificar se é um número válido após a conversão
  if (isNaN(numValue)) {
    return '$0';
  }

  // Se valor for muito grande e abbreviate for true, formatar em K/M/B
  if (abbreviate) {
    if (Math.abs(numValue) >= 1_000_000_000) {
      return `$${(numValue / 1_000_000_000).toFixed(1)}B`;
    }
    if (Math.abs(numValue) >= 1_000_000) {
      return `$${(numValue / 1_000_000).toFixed(1)}M`;
    }
    if (Math.abs(numValue) >= 1_000) {
      return `$${(numValue / 1_000).toFixed(1)}K`;
    }
  }
  
  // Formatação padrão em dólar
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: showCents ? 2 : 0,
    maximumFractionDigits: showCents ? 2 : 0,
  });
  
  return formatter.format(numValue);
};

/**
 * Formata uma porcentagem
 * @param value Valor da porcentagem (0-100 ou 0-1)
 * @param options Opções de formatação
 * @returns String formatada com a porcentagem
 */
export const formatPercentage = (
  value: number | string | undefined,
  options: { 
    decimals?: number,
    includeSymbol?: boolean,
    autoScale?: boolean
  } = {}
): string => {
  // Valores padrão das opções
  const { decimals = 1, includeSymbol = true, autoScale = true } = options;
  
  // Se o valor for undefined ou não for um número válido
  if (value === undefined || value === null || isNaN(Number(value))) {
    return includeSymbol ? '0%' : '0';
  }
  
  // Converter para número
  let numValue = typeof value === 'string' ? parseFloat(value.replace(/[^\d.-]/g, '')) : value;
  
  // Verificar se é um número válido após a conversão
  if (isNaN(numValue)) {
    return includeSymbol ? '0%' : '0';
  }
  
  // Se autoScale for true e o valor for menor que 1, assumimos que é decimal (0.05 = 5%)
  if (autoScale && Math.abs(numValue) <= 1) {
    numValue *= 100;
  }
  
  // Formatação
  const formattedValue = numValue.toFixed(decimals);
  
  // Remover zeros desnecessários e ponto decimal se for um número inteiro
  const cleanValue = formattedValue.replace(/\.0+$/, '');
  
  return includeSymbol ? `${cleanValue}%` : cleanValue;
};

/**
 * Extrai valores numéricos de um texto
 * Útil para extrair valores monetários ou percentuais de textos de análise
 * @param text Texto contendo valores numéricos
 * @param type Tipo de valor a extrair (moeda ou percentual)
 * @returns Array de números encontrados no texto
 */
export const extractNumbersFromText = (
  text?: string, 
  type: 'currency' | 'percentage' = 'currency'
): number[] => {
  if (!text) return [];
  
  let pattern;
  if (type === 'currency') {
    // Encontra valores monetários como $1,234.56 ou 1,234.56 ou 1234.56
    pattern = /\$?([\d,]+\.?\d*)/g;
  } else {
    // Encontra valores percentuais como 12.3% ou 12.3
    pattern = /([\d,]+\.?\d*)%?/g;
  }
  
  const matches = text.match(pattern) || [];
  
  return matches
    .map(match => {
      // Remover $ e , para converter para número
      const cleanMatch = match.replace(/[$,%]/g, '');
      return parseFloat(cleanMatch);
    })
    .filter(num => !isNaN(num)); // Filtrar apenas números válidos
};

/**
 * Converte uma string de moeda em número
 */
export const parseCurrency = (value: string): number => {
  const numericValue = parseFloat(value.replace(/[^0-9.-]/g, ''));
  return isNaN(numericValue) ? 0 : numericValue;
}; 