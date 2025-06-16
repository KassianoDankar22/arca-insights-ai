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

import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { calcularParcelaMensal } from "../utils/financial-utils";
import {
  TomPropertyAnalysisInput,
  ROIAnalysisResult,
  PropertyData,
  FormValues as TomROIFormValues,
  FormValues
} from "../types/analyzer-types";
import { gerarPromptRoiAnalise } from "../utils/prompt-generator";
import { useAuth } from '@/lib/auth';
import { getHOAByCondominiumAndBedrooms, getDefaultHOAByBedrooms } from '../data/hoa-table';
import { calcularSeguroMensalPorQuartos, calcularAguaMensalPorQuartos } from '../utils/financial-utils';

// Helper para tratar NaN e undefined
const getValueOrDefault = (value: number | undefined | null, defaultValue: number): number => {
  if (value === undefined || value === null || isNaN(value)) {
    return defaultValue;
  }
  return value;
};

// --- NOVAS FUNÇÕES DE CÁLCULO (ESTRUTURA INICIAL) ---

interface FinanciamentoData {
  valorEntrada: number;
  percentualEntrada: number;
  closingCosts: number;
  custoDecoracao: number;
  valorFinanciado: number;
  parcelaMensalFinanciamento: number;
}

const calcularDadosFinanciamento = (
  valorImovel: number,
  entradaValorFornecida: number | undefined | null,
  entradaPercentualFornecida: number | undefined | null,
  taxaJurosAnualFinanciamento: number,
  prazoAnosFinanciamento: number,
  incluirClosingCosts: boolean = false,
  closingCostsPercentual: number = 5,
  incluirDecoracao: boolean = false,
  decoracaoPercentual: number = 15
): FinanciamentoData => {
  let percentualEntradaFinal = 25;
  let valorEntradaFinal = valorImovel > 0 ? valorImovel * (percentualEntradaFinal / 100) : 0;

  if (valorImovel > 0) {
    if (entradaPercentualFornecida !== undefined && entradaPercentualFornecida !== null && !isNaN(entradaPercentualFornecida) && entradaPercentualFornecida >= 25) {
      percentualEntradaFinal = entradaPercentualFornecida;
      valorEntradaFinal = valorImovel * (percentualEntradaFinal / 100);
    } else if (entradaValorFornecida !== undefined && entradaValorFornecida !== null && !isNaN(entradaValorFornecida)) {
      const percentualCalculadoDoValorFornecido = (entradaValorFornecida / valorImovel) * 100;
      if (percentualCalculadoDoValorFornecido >= 25) {
        valorEntradaFinal = entradaValorFornecida;
        percentualEntradaFinal = percentualCalculadoDoValorFornecido;
      }
    }
  } else {
    valorEntradaFinal = 0;
    percentualEntradaFinal = 0;
  }

  // CORREÇÃO: Aplicar closing costs apenas se incluído
  const closingCosts = incluirClosingCosts && valorImovel > 0 ? valorImovel * (closingCostsPercentual / 100) : 0;
  
  // CORREÇÃO: Aplicar decoração apenas se incluída
  const custoDecoracao = incluirDecoracao && valorImovel > 0 ? valorImovel * (decoracaoPercentual / 100) : 0;
  
  const valorFinanciado = Math.max(0, valorImovel - valorEntradaFinal);

  let parcelaMensalFinanciamento = 0;
  
  if (valorFinanciado > 0) {
    if (prazoAnosFinanciamento <= 0 || isNaN(prazoAnosFinanciamento)) {
      parcelaMensalFinanciamento = 0;
    } else if (taxaJurosAnualFinanciamento < 0 || isNaN(taxaJurosAnualFinanciamento)) {
      parcelaMensalFinanciamento = 0;
    } else {
      parcelaMensalFinanciamento = calcularParcelaMensal(valorFinanciado, taxaJurosAnualFinanciamento / 100, prazoAnosFinanciamento);
      if (parcelaMensalFinanciamento < 0) {
        parcelaMensalFinanciamento = 0;
      }
    }
  }

  const financiamentoResult: FinanciamentoData = {
    valorEntrada: valorEntradaFinal,
    percentualEntrada: percentualEntradaFinal,
    closingCosts,
    custoDecoracao,
    valorFinanciado,
    parcelaMensalFinanciamento,
  };
  return financiamentoResult;
};

// --- NOVA FUNÇÃO DE CÁLCULO DE RECEITA ---
interface ReceitaData {
  diariaMediaEstimada: number;
  taxaOcupacaoAnual: number;
  receitaBrutaMensal: number;
  percentualVacanciaAnual: number;
}

const calcularReceitaEstimada = (
  numeroQuartos: number | undefined
): ReceitaData => {
  let diariaMediaEstimada = 0;
  
  if (numeroQuartos === undefined || numeroQuartos < 1) {
      diariaMediaEstimada = 0;
  } else {
    const valoresDiaria: { [key: number]: number } = {
      1: 160, 2: 185, 3: 210, 4: 235, 5: 260,
      6: 285, 7: 310, 8: 335, 9: 360, 10: 385,
      11: 410, 12: 435, 13: 460, 14: 485, 15: 510
    };

    if (numeroQuartos <= 15) {
      diariaMediaEstimada = valoresDiaria[numeroQuartos] || 0;
    } else {
      diariaMediaEstimada = (valoresDiaria[15] || 0) + ((numeroQuartos - 15) * 25);
    }
  }
  
  const taxaOcupacaoAnual = 80;
  const diasNoMes = 30;
  const diasOcupadosPorMes = diasNoMes * (taxaOcupacaoAnual / 100);
  const receitaBrutaMensal = diariaMediaEstimada * diasOcupadosPorMes;
  const percentualVacanciaAnual = 100 - taxaOcupacaoAnual;
  
  return { diariaMediaEstimada, taxaOcupacaoAnual, receitaBrutaMensal, percentualVacanciaAnual };
};

// --- NOVA FUNÇÃO DE CÁLCULO DE DESPESAS ---
interface DespesasData {
  adminMensal: number;
  aguaMensal: number;
  energiaMensal: number;
  seguroMensal: number;
  iptuMensal: number;
  hoaMensal: number;
  piscinaMensal: number;
  totalDespesasOperacionaisMensais: number;
}

const calcularDespesasMensaisEstimadas = (
  receitaBrutaMensal: number,
  hoaFornecido: number | undefined | null,
  numeroQuartos: number = 1,
  nomeCondominio?: string,
  temPiscina: boolean = false,
  valorImovel: number = 0,
  seguroAnualFornecido?: number,
  aguaMensalFornecida?: number,
  energiaMensalPorQuartoFornecida?: number,
  percentualAdminFornecido?: number
): DespesasData => {
  const percentualAdmin = percentualAdminFornecido && percentualAdminFornecido > 0 ? percentualAdminFornecido / 100 : 0.20;
  const adminMensal = receitaBrutaMensal * percentualAdmin;
  
  const aguaMensal = aguaMensalFornecida && aguaMensalFornecida > 0 
    ? aguaMensalFornecida 
    : calcularAguaMensalPorQuartos(numeroQuartos, temPiscina);
  
  let seguroMensal: number;
  if (seguroAnualFornecido && seguroAnualFornecido > 0) {
    seguroMensal = seguroAnualFornecido / 12;
  } else {
    seguroMensal = calcularSeguroMensalPorQuartos(numeroQuartos);
  }
  
  const energiaPorQuarto = energiaMensalPorQuartoFornecida && energiaMensalPorQuartoFornecida > 0 ? energiaMensalPorQuartoFornecida : 75;
  const energiaMensal = energiaPorQuarto * numeroQuartos;
  
  const iptuAnual = valorImovel * 0.012;
  const iptuMensal = iptuAnual / 12;
  
  const piscinaMensal = temPiscina ? 120 : 0;
  
  let hoaMensal: number;
  
  if (hoaFornecido && hoaFornecido > 0) {
    hoaMensal = hoaFornecido;
  } else if (nomeCondominio) {
    const hoaFromTable = getHOAByCondominiumAndBedrooms(nomeCondominio, numeroQuartos);
    if (hoaFromTable) {
      hoaMensal = hoaFromTable;
    } else {
      hoaMensal = getDefaultHOAByBedrooms(numeroQuartos);
    }
  } else {
    hoaMensal = getDefaultHOAByBedrooms(numeroQuartos);
  }
  
  const totalDespesasOperacionaisMensais = adminMensal + aguaMensal + energiaMensal + seguroMensal + iptuMensal + hoaMensal + piscinaMensal;
  
  return { adminMensal, aguaMensal, energiaMensal, seguroMensal, iptuMensal, hoaMensal, piscinaMensal, totalDespesasOperacionaisMensais };
};

// --- NOVA FUNÇÃO DE CÁLCULO DE FLUXO DE CAIXA E ROI ---
interface FluxoCaixaRoiData {
  fluxoCaixaMensalLiquido: number;
  fluxoCaixaAnualLiquido: number;
  valorizacaoAnualEstimadaValor: number;
  custoTotalInvestimentoInicial: number;
  roiEstimado: number;
  capRateLiquidoSobreValorImovel: number;
}

const calcularFluxoCaixaERoi = (
  receitaBrutaMensal: number,
  totalDespesasOperacionaisMensais: number,
  parcelaMensalFinanciamento: number,
  valorImovel: number,
  valorEntrada: number,
  closingCosts: number,
  custoDecoracao: number,
  valorizacaoAnualFornecida?: number
): FluxoCaixaRoiData => {
  const isParcelaNegativa = parcelaMensalFinanciamento < 0;
  
  if (isParcelaNegativa) {
    console.error('⚠️  ALERTA CRÍTICO: Parcela mensal negativa detectada!');
    console.error('Valor da parcela:', parcelaMensalFinanciamento);
    console.error('Isso indica erro crítico nos parâmetros de financiamento.');
    console.error('FORÇANDO ROI EXTREMAMENTE NEGATIVO...');
  }
  
  const fluxoCaixaMensalLiquido = receitaBrutaMensal - totalDespesasOperacionaisMensais - parcelaMensalFinanciamento;
  const fluxoCaixaAnualLiquido = fluxoCaixaMensalLiquido * 12;
  
  const valorizacaoAnualPercentual = valorizacaoAnualFornecida && valorizacaoAnualFornecida > 0 ? valorizacaoAnualFornecida : 6;
  const valorizacaoAnualEstimadaValor = valorImovel > 0 ? valorImovel * (valorizacaoAnualPercentual / 100) : 0;
  const custoTotalInvestimentoInicial = valorEntrada + closingCosts + custoDecoracao;
  
  let roiEstimado: number;
  
  if (isParcelaNegativa) {
    const impactoNegativo = Math.abs(parcelaMensalFinanciamento) * 12;
    
    if (custoTotalInvestimentoInicial > 0) {
      roiEstimado = -(impactoNegativo / custoTotalInvestimentoInicial) * 100;
      
      if (roiEstimado > -100) {
        roiEstimado = -100;
      }
      
      if (roiEstimado < -500) {
        roiEstimado = -500;
      }
    } else {
      roiEstimado = -100;
    }
    
    console.error('ROI NEGATIVO APLICADO:', roiEstimado.toFixed(2) + '%');
    console.error('Razão: Parcela negativa de', formatarMoeda(parcelaMensalFinanciamento));
    
  } else {
    const retornoAnualTotal = fluxoCaixaAnualLiquido + valorizacaoAnualEstimadaValor;
    roiEstimado = custoTotalInvestimentoInicial > 0
      ? (retornoAnualTotal / custoTotalInvestimentoInicial) * 100
      : 0;
  }
  
  const noiAnual = (receitaBrutaMensal * 12) - (totalDespesasOperacionaisMensais * 12);
  const capRateLiquidoSobreValorImovel = valorImovel > 0 ? (noiAnual / valorImovel) * 100 : 0;
  
  return { 
    fluxoCaixaMensalLiquido, 
    fluxoCaixaAnualLiquido, 
    valorizacaoAnualEstimadaValor, 
    custoTotalInvestimentoInicial, 
    roiEstimado, 
    capRateLiquidoSobreValorImovel 
  };
};

// Função auxiliar para formatar moeda nos logs
const formatarMoeda = (valor: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(valor);
};

// Funções de parsing
const parseCurrencyUSD = (value: string | null | undefined): number => {
  if (!value) return NaN;
  const cleanedValue = String(value).replace(/[^\d.-]/g, '');
  const num = parseFloat(cleanedValue);
  return isNaN(num) ? NaN : num;
};

const parseFloatSafe = (value: string | null | undefined): number | undefined => {
  if (value === null || value === undefined || String(value).trim() === '') return undefined;
  const cleanedValue = String(value).replace(/[^\d.-]/g, '');
  const num = parseFloat(cleanedValue);
  return isNaN(num) ? undefined : num;
};

const parseIntSafe = (value: string | null | undefined): number | undefined => {
  if (value === null || value === undefined || String(value).trim() === '') return undefined;
  const cleanedValue = String(value).replace(/[^\d-]/g, '');
  const num = parseInt(cleanedValue, 10);
  return isNaN(num) ? undefined : num;
};

// Controle de modo de dados reais vs simulados
export const USE_SIMULATED_DATA = false;

// Configuração de timeout e tentativas
const SUPABASE_FUNCTION_TIMEOUT = 180000; // 3 minutos
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000; // 1 segundo
const MAX_RETRY_DELAY = 15000; // 15 segundos
const RETRY_BACKOFF_FACTOR = 2;

// Versão da função para rastreamento
const SUPABASE_FUNCTION_VERSION = "2025-05-21-v4"; 

// URLs e chaves do Supabase
const SUPABASE_BASE_URL = "https://dkykekkdjqajqfyrgqhi.supabase.co";
const SUPABASE_PUBLISHABLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRreWtla2tkanFhanFmeXJncWhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU5NjQxNjAsImV4cCI6MjA2MTU0MDE2MH0.iC6tio4Uoj2oxwUAvV9kp6QWQG4MxE6RnhBS9_uFwSY";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const retryWithBackoff = async <T>(
  operation: () => Promise<T>,
  retries = MAX_RETRIES,
  initialDelay = INITIAL_RETRY_DELAY,
  factor = RETRY_BACKOFF_FACTOR,
  maxDelay = MAX_RETRY_DELAY,
  onRetry?: (attempt: number, delay: number, error: any) => void
): Promise<T> => {
  let attempts = 0;
  let delay = initialDelay;
  
  while (true) {
    try {
      attempts++;
      return await operation();
    } catch (error) {
      if (attempts >= retries) {
        console.error(`[RETRY] Todas as ${retries} tentativas falharam. Desistindo.`);
        throw error;
      }
      const jitter = Math.random() * 0.3 + 0.85; 
      delay = Math.min(delay * factor * jitter, maxDelay);
      if (onRetry) {
        onRetry(attempts, delay, error);
      }
      await wait(delay);
    }
  }
};

const callSupabaseFunctionWithFetch = async (
  action: string,
  data: any = {},
  customRetries = MAX_RETRIES
) => {
  const baseUrl = `${SUPABASE_BASE_URL}/functions/v1/tom-assistant`;
  try {
    const operation = async () => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
        console.warn(`[FETCH TIMEOUT] Abortando chamada para '${action}' após ${SUPABASE_FUNCTION_TIMEOUT / 1000}s`);
  }, SUPABASE_FUNCTION_TIMEOUT);
  try {
      const response = await fetch(baseUrl, {
          method: "POST",
        headers: {
            "Content-Type": "application/json",
            "apikey": SUPABASE_PUBLISHABLE_KEY,
        },
          body: JSON.stringify({
            action,
          version: SUPABASE_FUNCTION_VERSION,
            data,
        }),
          signal: controller.signal,
      });
        clearTimeout(timeoutId); 
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[FETCH ERROR] Erro ${response.status} ao chamar '${action}':`, errorText);
          throw new Error(`Erro HTTP ${response.status}: ${errorText || response.statusText}`);
      }
      return await response.json();
      } catch (fetchError) {
        clearTimeout(timeoutId);
        if ((fetchError as Error).name === 'AbortError') {
          console.error(`[FETCH ABORT] A operação para '${action}' foi abortada (provavelmente timeout).`);
        }
        throw fetchError; 
      }
    };
    return await retryWithBackoff(
      operation, customRetries, INITIAL_RETRY_DELAY, RETRY_BACKOFF_FACTOR, MAX_RETRY_DELAY, 
      (attempt, delay, error) => {
        toast.warning(`Tentativa ${attempt} falhou para ${action}. Tentando novamente em ${Math.round(delay/1000)}s...`, {
          id: `api-retry-${action}`,
          duration: Math.min(delay, 5000),
        });
      }
    );
  } catch (error: any) {
    if (error.name === "AbortError") {
      console.error(`[FETCH TIMEOUT FINAL] A chamada para '${action}' excedeu o tempo limite de ${SUPABASE_FUNCTION_TIMEOUT / 1000}s após retentativas.`);
      throw new Error(`Timeout ao chamar a função ${action}. A API demorou muito para responder.`);
    }
    console.error(`[FETCH ERROR FINAL] Erro final ao chamar '${action}':`, error);
    throw error;
  }
};

// --- FUNÇÃO PRINCIPAL DE TRANSFORMAÇÃO E CÁLCULO REATORADA ---
const transformAndCalculatePropertyData = (
  analysisInput: TomPropertyAnalysisInput,
  logoUrl?: string | null
): { propertyData: PropertyData; financialMetrics: any } => {
  const valorImovel = getValueOrDefault(analysisInput.purchasePrice, 500000);

  const cleanProjectName = (name: string): string => {
    if (!name) return name;
    return name.replace(/\d+$/, '').trim();
  };

  const cleanedProjectName = cleanProjectName(analysisInput.projectName || '');

  const financiamentoData = calcularDadosFinanciamento(
    valorImovel,
    analysisInput.downPaymentValue,
    analysisInput.downPaymentPercent,
    getValueOrDefault(analysisInput.annualInterestRate, 7),
    getValueOrDefault(analysisInput.loanTermYears, 30),
    (analysisInput as any).incluirClosingCosts || false,
    (analysisInput as any).closingCostsPercentual || 5,
    (analysisInput as any).incluirDecoracao || false,
    (analysisInput as any).decoracaoPercentual || 15
  );

  const receita = calcularReceitaEstimada(
    analysisInput.bedrooms
  );

  const despesas = calcularDespesasMensaisEstimadas(
    receita.receitaBrutaMensal,
    analysisInput.condoFeeMonthly,
    analysisInput.bedrooms,
    analysisInput.projectName,
    analysisInput.hasPool || false,
    valorImovel,
    undefined,
    undefined,
    undefined,
    analysisInput.propertyManagementFeePercent
  );
  
  const despesasTotaisComFinanciamento = despesas.totalDespesasOperacionaisMensais + financiamentoData.parcelaMensalFinanciamento;

  const fluxoCaixaEroi = calcularFluxoCaixaERoi(
    receita.receitaBrutaMensal,
    despesas.totalDespesasOperacionaisMensais,
    financiamentoData.parcelaMensalFinanciamento,
    valorImovel,
    financiamentoData.valorEntrada,
    financiamentoData.closingCosts,
    financiamentoData.custoDecoracao,
    analysisInput.annualAppreciationRate
  );
  
  const financialMetrics = {
    monthlyExpenses: despesas.totalDespesasOperacionaisMensais,
    monthlyNetCashFlow: fluxoCaixaEroi.fluxoCaixaMensalLiquido,
    annualNetCashFlow: fluxoCaixaEroi.fluxoCaixaAnualLiquido,
    estimatedAnnualAppreciation: fluxoCaixaEroi.valorizacaoAnualEstimadaValor,
    totalInitialInvestment: fluxoCaixaEroi.custoTotalInvestimentoInicial,
    estimatedROI: fluxoCaixaEroi.roiEstimado,
    netCapRate: fluxoCaixaEroi.capRateLiquidoSobreValorImovel,
  };

  const calculatedPropertyDataResult: PropertyData = { 
    nome_condominio: cleanedProjectName,
    localizacao_imovel: analysisInput.location || '',
    modelo_imovel: analysisInput.modelType || '',
    quartos_imovel: String(analysisInput.bedrooms || '0'),
    piscina_imovel: analysisInput.hasPool || false,
    tipo_investimento: financiamentoData.valorFinanciado > 0 ? 'financing' : 'cash',

    valor_imovel: valorImovel,
    valor_entrada: financiamentoData.valorEntrada,
    percentual_entrada: financiamentoData.percentualEntrada,
    valor_financiado: financiamentoData.valorFinanciado,
    taxa_juros_anual_financiamento: getValueOrDefault(analysisInput.annualInterestRate, 7),
    prazo_financiamento_anos: getValueOrDefault(analysisInput.loanTermYears, 30),
    parcela_mensal: financiamentoData.parcelaMensalFinanciamento,
    closing_costs_total: financiamentoData.closingCosts,
    decoracao_total: financiamentoData.custoDecoracao,
    percentual_closing_costs_aplicado: (analysisInput as any).incluirClosingCosts ? 
      ((analysisInput as any).closingCostsPercentual || 5) : 0, 
    percentual_decoracao_aplicado: (analysisInput as any).incluirDecoracao ? 
      ((analysisInput as any).decoracaoPercentual || 15) : 0,

    diaria_media_estimada: receita.diariaMediaEstimada,      
    receita_aluguel_mensal: receita.receitaBrutaMensal,
    occupancyRate: receita.taxaOcupacaoAnual,
    percentual_vacancia_anual: receita.percentualVacanciaAnual,

    valor_condominio_mensal: despesas.hoaMensal,
    valor_iptu_mensal: despesas.iptuMensal,
    valor_seguro_mensal: despesas.seguroMensal,
    valor_energia_mensal: despesas.energiaMensal,
    valor_agua_mensal: despesas.aguaMensal,
    percentual_taxa_administracao_mensal: 20, 
    valor_taxa_administracao_mensal: despesas.adminMensal,
    valor_piscina_mensal: despesas.piscinaMensal,
    valor_manutencao_mensal: undefined, 
    valor_reserva_manutencao_mensal: undefined, 
    valor_taxa_marketing_mensal: undefined, 
  };
  return { propertyData: calculatedPropertyDataResult, financialMetrics };
};

const convertFormValuesToAnalysisInput = (formValues: TomROIFormValues) => {
  const valorImovelParsed = parseCurrencyUSD(formValues.valor_imovel);

  const cleanProjectName = (name: string): string => {
    if (!name) return name;
    return name.replace(/\d+$/, '').trim();
  };

  const cleanedCondominioName = cleanProjectName(formValues.condominio || '');

  // Extrair dados de decoração e closing costs
  const incluirDecoracao = formValues.incluir_decoracao || false;
  const decoracaoPercentual = incluirDecoracao ? 
    (parseFloatSafe(formValues.decoracao_percentual?.replace('%', '')) || 15) : 0;

  const incluirClosingCosts = formValues.incluir_closing_costs || false;
  const closingCostsPercentual = incluirClosingCosts ? 
    (parseFloatSafe(formValues.closing_costs_percentual?.replace('%', '')) || 5) : 0;

  return {
    projectName: cleanedCondominioName,
    location: formValues.localizacao || '',
    modelType: formValues.modelo || '',
    bedrooms: parseIntSafe(formValues.quartos) || 0,
    hasPool: formValues.piscina || false,
    purchasePrice: valorImovelParsed,
    downPaymentValue: parseCurrencyUSD(formValues.entrada_valor) || 0,
    downPaymentPercent: parseFloatSafe(formValues.entrada_percentual?.replace('%', '')) || 0,
    brokerLogoUrl: formValues.logoUrl || null,
    annualInterestRate: parseFloatSafe(formValues.taxa_juros_anual_financiamento) || 7,
    loanTermYears: parseIntSafe(formValues.prazo_financiamento_anos) || 30,
    annualOccupancyRate: 80, // Valor padrão
    // Campos adicionais para decoração e closing costs
    incluirClosingCosts,
    closingCostsPercentual,
    incluirDecoracao,
    decoracaoPercentual,
  };
};

export const gerarTextoAnalise = (result: ROIAnalysisResult): string => {
  const data = result.propertyData;
  const metrics = result.financialMetrics;

  const formatarMoeda = (valor: number | undefined | null, casasDecimais = 2) => {
    if (valor === undefined || valor === null || isNaN(valor)) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency', currency: 'USD', minimumFractionDigits: casasDecimais, maximumFractionDigits: casasDecimais
    }).format(valor);
  };
  
  const texto = `
${data.nome_condominio || 'N/A'}

Valor do Imóvel: ${formatarMoeda(data.valor_imovel)}
Entrada: ${formatarMoeda(data.valor_entrada)} (${(data.percentual_entrada || 0).toFixed(0)}%)
Financiamento: ${formatarMoeda(data.valor_financiado)}
Parcela Mensal: ${formatarMoeda(data.parcela_mensal)}

Fluxo de Caixa:
- Mensal: ${formatarMoeda(metrics.monthlyNetCashFlow)}
- Anual: ${formatarMoeda(metrics.annualNetCashFlow)}

Valorização:
- Percentual: ${(metrics.appreciationRate || 0).toFixed(2)}% a.a.
- Valor Anual: ${formatarMoeda(metrics.estimatedAnnualAppreciation)}

ROI: ${(metrics.netCapRate || 0).toFixed(2)}% a.a.
`;
  return texto; 
};

const extractCalculatedValuesFromResult = (result: ROIAnalysisResult): Partial<FormValues> => {
  const propertyData = result.propertyData;
  
  const formatMoneyForForm = (value: number | undefined | null): string => {
    if (!value || isNaN(value)) return '';
    return Math.round(value).toLocaleString('en-US');
  };
  
  const formatPercentForForm = (value: number | undefined | null): string => {
    if (!value || isNaN(value)) return '';
    return value.toString();
  };
  
  const extractedValues: Partial<FormValues> = {
    taxa_juros_anual_financiamento: formatPercentForForm(propertyData.taxa_juros_anual_financiamento),
    prazo_financiamento_anos: propertyData.prazo_financiamento_anos?.toString() || '',
  };
  
  const filteredValues = Object.fromEntries(
    Object.entries(extractedValues).filter(([_, value]) => value !== '')
  ) as Partial<FormValues>;
  
  return filteredValues;
};

type AnalysisStage = 'creating-thread' | 'sending-message' | 'running-assistant' | 'checking-status' | 'getting-results' | 'complete' | null;

interface AnalysisProgress {
  stage: AnalysisStage;
  percentage: number;
}

interface AnalysisResponse {
  result: ROIAnalysisResult;
  propertyData: PropertyData;
}

interface UseTomAssistantReturn {
  isLoading: boolean;
  progress: AnalysisProgress;
  apiStatus: string; 
  checkApiStatus: () => Promise<void>;
  analyzeROI: (formData: TomROIFormValues, logoUrl?: string | null, onFormUpdate?: (values: Partial<FormValues>) => void) => Promise<AnalysisResponse>;
  currentError: Error | null; 
  isApiAvailable: boolean; 
}

export function useTomAssistant(): UseTomAssistantReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState<AnalysisProgress>({ stage: null, percentage: 0 });
  const [apiStatus, setApiStatus] = useState<string>('');
  const [currentError, setCurrentError] = useState<Error | null>(null);
  const [isApiAvailable, setIsApiAvailable] = useState<boolean>(false);

  const checkApiStatus = useCallback(async () => {
    try {
      setApiStatus('Verificando disponibilidade da API...');
      await callSupabaseFunctionWithFetch('ping');
      setIsApiAvailable(true);
      setApiStatus('API disponível');
    } catch (error: any) {
      console.error('[API_CHECK] Erro ao verificar API:', error);
      setIsApiAvailable(false);
      setApiStatus('API indisponível ou erro na verificação.');
    }
  }, []);

  useEffect(() => {
    checkApiStatus();
  }, [checkApiStatus]);

  const analyzeROI = useCallback(async (
      formValues: TomROIFormValues, 
      logoUrl?: string | null,
      onFormUpdate?: (values: Partial<FormValues>) => void
    ): Promise<AnalysisResponse> => {
    try {
      setIsLoading(true);
      setCurrentError(null);
      setProgress({ stage: null, percentage: 0 });
      
      const analysisInput = convertFormValuesToAnalysisInput(formValues);
      
      const { propertyData: calculatedPropertyData, financialMetrics } = transformAndCalculatePropertyData(analysisInput, logoUrl);

      const systemPrompt = "Você é um especialista em análise de investimentos imobiliários internacionais, focado no mercado americano (Florida). Sua análise deve ser detalhada, precisa, e considerar nuances do mercado local. Forneça insights valiosos sobre o potencial de ROI, riscos, e recomendações. Use dólares americanos (USD) para todos os valores monetários.";
      const userPrompt = gerarPromptRoiAnalise(calculatedPropertyData);

      setProgress({ stage: 'creating-thread', percentage: 10 });
      const threadResponse = await callSupabaseFunctionWithFetch('createThread');
      const threadId = threadResponse.threadId;

      setProgress({ stage: 'sending-message', percentage: 20 });
      await callSupabaseFunctionWithFetch('sendMessage', { threadId, content: systemPrompt });

      setProgress({ stage: 'sending-message', percentage: 30 });
      await callSupabaseFunctionWithFetch('sendMessage', { threadId, content: userPrompt });

      setProgress({ stage: 'running-assistant', percentage: 40 });
      const runResponse = await callSupabaseFunctionWithFetch('runAssistant', { threadId, instructions: "Analise os dados fornecidos e gere uma análise detalhada do ROI, focando em explicar os resultados financeiros e o potencial do investimento." });
      const runId = runResponse.runId;

      let runStatus = 'in_progress';
      let attempts = 0;
      const maxPollingAttempts = 30; 
      
      while (runStatus === 'in_progress' && attempts < maxPollingAttempts) {
        setProgress({ stage: 'checking-status', percentage: 40 + Math.min(50, Math.round((attempts / maxPollingAttempts) * 50) ) });
        await wait(2000); 
        const statusResponse = await callSupabaseFunctionWithFetch('checkRunStatus', { threadId, runId });
        runStatus = statusResponse.status;
        if (runStatus === 'completed') break;
        if (runStatus === 'failed' || runStatus === 'cancelled' || runStatus === 'requires_action' || runStatus === 'expired') {
          throw new Error(`A análise da IA falhou ou foi interrompida (status: ${runStatus})`);
        }
        attempts++;
      }

      if (runStatus !== 'completed') {
        throw new Error(`A análise da IA não completou a tempo (status final: ${runStatus}). Tente novamente mais tarde.`);
      }

      setProgress({ stage: 'getting-results', percentage: 95 });
      const messagesResponse = await callSupabaseFunctionWithFetch('getMessages', { threadId });
      const assistantMessages = messagesResponse.messages.filter((msg: any) => msg.role === 'assistant' && msg.content && msg.content[0] && msg.content[0].type === 'text');
      
      if (!assistantMessages || assistantMessages.length === 0 || !assistantMessages[0].content[0].text.value) {
        throw new Error('Não foi possível obter a análise do assistente ou formato de mensagem inesperado.');
      }
      const analysisTextFromIA = assistantMessages.map((msg:any) => msg.content[0].text.value).join('\n\n');

      const finalPropertyDataWithIA = {
        ...calculatedPropertyData,
        texto_analise_ia: analysisTextFromIA,
        prompt_utilizado_ia: userPrompt 
      };

      const result: ROIAnalysisResult = {
        projectName: finalPropertyDataWithIA.nome_condominio,
        analysisDate: new Date().toISOString(),
        location: finalPropertyDataWithIA.localizacao_imovel,
        modelType: finalPropertyDataWithIA.modelo_imovel,
        bedrooms: parseIntSafe(finalPropertyDataWithIA.quartos_imovel) ?? 0,
        hasPool: finalPropertyDataWithIA.piscina_imovel,
        purchasePrice: finalPropertyDataWithIA.valor_imovel,
        downPaymentValue: finalPropertyDataWithIA.valor_entrada,
        downPaymentPercent: finalPropertyDataWithIA.percentual_entrada || 0, 
        annualOccupancyRate: finalPropertyDataWithIA.occupancyRate, 
        brokerLogoUrl: logoUrl,
        resultado_texto: analysisTextFromIA, 
        propertyData: finalPropertyDataWithIA, 
        financialMetrics,
        recommendations: [],
        warnings: [],
        threadId,
        runId,
        statusApi: 'success'
      };
      
      setProgress({ stage: 'complete', percentage: 100 });
      toast.success("Análise de ROI Concluída!", { description: "Os resultados estão prontos para visualização."});

      if (onFormUpdate) {
        onFormUpdate(extractCalculatedValuesFromResult(result));
      }

      return { result, propertyData: finalPropertyDataWithIA }; 
      } catch (error: any) {
      console.error('[ANALYZE_ROI] Erro durante análise:', error);
      setCurrentError(error); 
      toast.error("Erro na Análise de ROI", { 
        description: error.message || "Ocorreu um erro desconhecido durante a análise." 
      });
      throw error;
    } finally {
      setIsLoading(false);
      setProgress({ stage: null, percentage: 0 });
      }
  }, []);

  return {
    isLoading,
    progress,
    apiStatus,
    checkApiStatus,
    analyzeROI,
    currentError,
    isApiAvailable
  };
}

export default useTomAssistant;
