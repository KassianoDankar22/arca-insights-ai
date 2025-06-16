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
 * Calcula a parcela mensal de um financiamento usando o sistema de amortização francês (Price)
 * @param valorFinanciado - Valor total a ser financiado
 * @param taxaJurosAnual - Taxa de juros anual (em decimal, ex: 0.12 para 12%)
 * @param prazoAnos - Prazo do financiamento em anos
 * @returns Valor da parcela mensal
 */
export function calcularParcelaMensal(
    valorFinanciado: number,
    taxaJurosAnual: number,
    prazoAnos: number
): number {
    // Validar parâmetros de entrada
    if (valorFinanciado <= 0) {
        return 0;
    }
    
    if (isNaN(taxaJurosAnual) || taxaJurosAnual < 0) {
        return 0;
    }
    
    if (isNaN(prazoAnos) || prazoAnos <= 0) {
        return 0;
    }
    
    // Converter taxa anual para mensal
    const taxaMensal = taxaJurosAnual / 12;
    
    // Converter prazo de anos para meses
    const prazoMeses = prazoAnos * 12;
    
    // Se a taxa de juros é zero, calcular sem juros
    if (taxaMensal === 0) {
        const parcelaSemJuros = valorFinanciado / prazoMeses;
        return Math.round(parcelaSemJuros * 100) / 100;
    }
    
    // Fórmula Price: PMT = PV * (r * (1 + r)^n) / ((1 + r)^n - 1)
    const fatorUmMaisTaxa = 1 + taxaMensal;
    const fatorPotencia = Math.pow(fatorUmMaisTaxa, prazoMeses);
    const numerador = taxaMensal * fatorPotencia;
    const denominador = fatorPotencia - 1;
    
    // Verificar se o denominador é válido
    if (denominador === 0 || isNaN(denominador) || !isFinite(denominador)) {
        console.error('[CALC_PARCELA] Denominador inválido:', denominador);
        return 0;
    }
    
    const parcela = valorFinanciado * (numerador / denominador);
    
    // Verificar se a parcela resultante é válida
    if (isNaN(parcela) || !isFinite(parcela) || parcela < 0) {
        console.error('[CALC_PARCELA] Parcela calculada é inválida:', parcela);
        return 0;
    }
    
    const parcelaFinal = Math.round(parcela * 100) / 100;
    
    return parcelaFinal;
} 

/**
 * Calcula o valor do seguro residencial mensal baseado no número de quartos
 * Regras para casas de férias em Orlando e região
 */
export function calcularSeguroMensalPorQuartos(quartos: number): number {
  if (quartos <= 2) return 150;
  if (quartos === 3) return 167;
  if (quartos === 4) return 200;
  if (quartos === 5) return 233;
  if (quartos === 6) return 267;
  if (quartos === 7) return 300;
  if (quartos === 8) return 333;
  if (quartos === 9) return 367;
  if (quartos === 10) return 400;
  if (quartos === 11) return 433;
  if (quartos === 12) return 467;
  if (quartos === 13) return 500;
  if (quartos === 14) return 533;
  if (quartos === 15) return 567;
  if (quartos > 15) return 600;
  
  // Default para 3 quartos se não especificado
  return 167;
}

/**
 * Calcula o valor da água mensal baseado no número de quartos e presença de piscina
 * Regras para casas de férias em Orlando e região
 */
export function calcularAguaMensalPorQuartos(quartos: number, temPiscina: boolean = false): number {
  const valoresSemPiscina: { [key: number]: number } = {
    2: 70,
    3: 80,
    4: 90,
    5: 100,
    6: 110,
    7: 120,
    8: 130,
    9: 140,
    10: 150,
    11: 160,
    12: 170,
    13: 180,
    14: 190,
    15: 200
  };
  
  const valoresComPiscina: { [key: number]: number } = {
    2: 110,
    3: 120,
    4: 130,
    5: 140,
    6: 150,
    7: 160,
    8: 170,
    9: 180,
    10: 190,
    11: 200,
    12: 210,
    13: 220,
    14: 230,
    15: 240
  };
  
  // Para quartos > 15
  if (quartos > 15) {
    return temPiscina ? 250 : 210;
  }
  
  // Para quartos específicos
  const valores = temPiscina ? valoresComPiscina : valoresSemPiscina;
  const valorQuarto = valores[quartos];
  
  if (valorQuarto) {
    return valorQuarto;
  }
  
  // Default para 3 quartos se não especificado
  return temPiscina ? 120 : 80;
} 