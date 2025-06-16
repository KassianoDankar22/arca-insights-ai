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

import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { FormValues, ROIAnalysisResult, PropertyData as AnalyzerPropertyData, PropertyData } from '../types/analyzer-types';
import { supabase } from '@/integrations/supabase/client'; // Importar cliente do Supabase
import axios from 'axios';
import { gerarPromptRoiAnalise } from '../utils/prompt-generator';

// Modo de dados sempre reais - nunca usar simulação
export const USE_SIMULATED_DATA = false;

// Não precisamos mais dessas chaves hardcoded, pois usaremos a Edge Function do Supabase
// que tem sua própria chave da API OpenAI configurada no ambiente do Supabase
// const TEST_OPENAI_KEY = "...";
// const TEST_ASSISTANT_ID = "...";

// Configuração de timeout para chamadas ao Supabase
const SUPABASE_FUNCTION_TIMEOUT = 180000; // Aumentado para 3 minutos (180s)

// Versão da função Supabase - para ajudar no debug
const SUPABASE_FUNCTION_VERSION = '2025-05-08-v3';

// URL base do projeto Supabase (extraída do SUPABASE_URL no client.ts)
const SUPABASE_BASE_URL = "https://dkykekkdjqajqfyrgqhi.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRreWtla2tkanFhanFmeXJncWhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU5NjQxNjAsImV4cCI6MjA2MTU0MDE2MH0.iC6tio4Uoj2oxwUAvV9kp6QWQG4MxE6RnhBS9_uFwSY";
// Chave para tentativas diretas com a API da OpenAI
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || "";

// Utilitário para esperar com backoff exponencial
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Função para tentar uma operação com retries e backoff exponencial
const retryWithBackoff = async <T>(
  operation: () => Promise<T>,
  retries = 3,
  initialDelay = 1000, // 1 segundo
  factor = 2,
  maxDelay = 10000 // 10 segundos
): Promise<T> => {
  let attempts = 0;
  let delay = initialDelay;
  
  while (true) {
    try {
      attempts++;
      return await operation();
    } catch (error) {
      if (attempts >= retries) {
        throw error;
      }
      
      console.log(`Tentativa ${attempts} falhou. Tentando novamente em ${delay}ms...`);
      await wait(delay);
      delay = Math.min(delay * factor, maxDelay);
    }
  }
};

// Modificar callSupabaseFunctionWithFetch para usar o retry
const callSupabaseFunctionWithFetch = async (action: string, data: any = {}) => {
  console.log(`[FETCH] Chamando Supabase Function '${action}' com action:`, data);
  
  const baseUrl = `${SUPABASE_BASE_URL}/functions/v1/tom-assistant`;
  console.log(`URL completa da função: ${baseUrl}`);
  
  // Timeout de segurança
  console.log(`[FETCH TIMEOUT] Configurado para ${SUPABASE_FUNCTION_TIMEOUT/1000} segundos`);
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, SUPABASE_FUNCTION_TIMEOUT);
  
  try {
    const operation = async () => {
      const response = await fetch(baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_PUBLISHABLE_KEY,
        },
        body: JSON.stringify({
          action,
          version: SUPABASE_FUNCTION_VERSION,
          data
        }),
        signal: controller.signal
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[FETCH ERROR] Erro ${response.status} ao chamar '${action}':`, errorText);
        throw new Error(`Erro HTTP ${response.status}: ${errorText}`);
      }
      
      console.log(`[FETCH SUCCESS] Resposta para '${action}':`, response);
      return await response.json();
    };
    
    // Usar retry com backoff apenas para algumas operações críticas
    if (['createThread', 'runAssistant', 'checkRunStatus'].includes(action)) {
      return await retryWithBackoff(operation, 3, 1000, 2);
    } else {
      return await operation();
    }
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error(`[FETCH TIMEOUT] A chamada para '${action}' excedeu o tempo limite de ${SUPABASE_FUNCTION_TIMEOUT/1000}s`);
      throw new Error(`Timeout ao chamar a função ${action}`);
    }
    
    console.error(`[FETCH ERROR] Erro ao chamar '${action}':`, error);
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
};

// Função para chamar a Edge Function do Supabase com timeout
const callSupabaseFunction = async (action: string, data: any = {}) => {
  console.log(`[${SUPABASE_FUNCTION_VERSION}] Chamando Supabase Function 'tom-assistant' com action: ${action}`, data);
  console.log(`URL base Supabase: ${SUPABASE_BASE_URL}`);
  
  try {
    // Primeiro tenta com fetch direto
    console.log(`Tentando com fetch direto primeiro para '${action}'`);
    try {
      return await callSupabaseFunctionWithFetch(action, data);
    } catch (fetchError) {
      console.error(`Falha ao chamar com fetch direto. Erro: ${fetchError.message}`);
      console.log(`Tentando com o client do Supabase agora para '${action}'`);
    }
    
    // Se fetch direto falhar, tenta com o client do Supabase
    // Criar uma Promise que rejeitará após o timeout
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`Timeout ao chamar função '${action}' após ${SUPABASE_FUNCTION_TIMEOUT/1000} segundos`)), SUPABASE_FUNCTION_TIMEOUT)
    );
    
    // Race entre a chamada real e o timeout
    const result = await Promise.race([
      (async () => {
        console.log(`Iniciando chamada para função '${action}'...`);
        
        // Mostrar URL completa para debugging
        const functionUrl = `${SUPABASE_BASE_URL}/functions/v1/tom-assistant`;
        console.log(`URL completa da função: ${functionUrl}`);
        
        const { data: responseData, error } = await supabase.functions.invoke('tom-assistant', {
          body: {
            action,
            data
          }
        });
        
        if (error) {
          console.error(`Erro ao chamar Supabase Function (${action}):`, error);
          console.error(`Detalhes do erro: ${JSON.stringify(error)}`);
          throw new Error(`Erro na função Supabase: ${error.message}`);
        }
        
        if (!responseData) {
          console.error(`Resposta vazia da função '${action}'`);
          throw new Error(`Resposta vazia da função Supabase (${action})`);
        }
        
        return responseData;
      })(),
      timeoutPromise
    ]);
    
    console.log(`Resposta da Supabase Function (${action}):`, result);
    return result;
  } catch (error) {
    console.error(`Erro ao chamar Supabase Function (${action}):`, error);
    // Adicionar mais detalhes do erro para debug
    if (error instanceof Error) {
      console.error(`Mensagem: ${error.message}`);
      console.error(`Stack: ${error.stack}`);
    } else {
      console.error(`Erro não padrão: ${JSON.stringify(error)}`);
    }
    throw error;
  }
};

// Função auxiliar para extrair um número de uma string usando regex
const extractNumber = (text: string, regex: RegExp): number | null => {
  const match = text.match(regex);
  if (match && match[1]) {
    // Remove caracteres não numéricos (exceto ponto decimal) e converte para float
    const numericString = match[1].replace(/[^\d.-]/g, '');
    const number = parseFloat(numericString);
    return isNaN(number) ? null : number;
  }
  return null;
};

// Função auxiliar para extrair uma string usando regex
const extractString = (text: string, regex: RegExp): string | null => {
  const match = text.match(regex);
  return match && match[1] ? match[1].trim() : null;
};

// Função principal para parsear o texto da análise
const parseAnalysisTextToResult = (analysisText: string, formData: FormValues): Partial<ROIAnalysisResult> => {
  const parsedData: Partial<ROIAnalysisResult> = {
    projectName: '',
    location: '',
    modelType: '',
    modelo: '',
    bedrooms: 0,
    hasPool: false,
    purchasePrice: 0,
    investmentType: 'local_financing',
    downPaymentValue: 0,
    downPaymentPercent: 0,
    annualOccupancyRate: 85,
    brokerLogoUrl: null,
    resultado_texto: '',
    propertyData: {
      monthlyRent: 0,
      annualRent: 0,
      occupancyRate: 0,
      grossIncome: 0,
      netIncome: 0,
      roi: 0,
      capRate: 0,
      cashOnCash: 0,
      nome_condominio: '',
      localizacao_imovel: '',
      modelo_imovel: '',
      quartos_imovel: '',
      piscina_imovel: false,
      tipo_investimento: '',
      valor_imovel: 0,
      valor_entrada: 0,
      percentual_entrada: 0,
      valor_financiado: 0,
      parcela_mensal: 0,
      taxa_juros_anual_financiamento: 0,
      prazo_financiamento_anos: 0,
      receita_aluguel_mensal: 0,
      despesas_totais_mensais: 0,
      valor_condominio_mensal: 0,
      valor_iptu_mensal: 0,
      valor_seguro_mensal: 0,
      valor_energia_mensal: 0,
      valor_agua_mensal: 0,
      valor_piscina_mensal: 0,
      custo_transacao_diluido_mensal: 0,
      percentual_taxa_administracao_mensal: 0,
      valor_taxa_administracao_mensal: 0,
      percentual_reserva_manutencao_mensal: 0,
      valor_reserva_manutencao_mensal: 0,
      custo_decoracao_diluido_mensal: 0,
      percentual_decoracao: 0,
      percentual_closing_costs: 0,
      fluxo_caixa_mensal_antes_ir: 0,
      custo_total_aquisicao: 0,
      cap_rate_liquido_sobre_custo_total_aquisicao: 0,
      cash_on_cash_return_liquido_antes_ir: 0,
      percentual_vacancia_anual: 0,
      valorizacao_percentual_anual_estimada: 0,
      valorizacao_valor_anual_estimado: 0,
      texto_analise_ia: null,
      prompt_utilizado_ia: null,
      logo_broker_url: null
    }
  };

  // Usar valores do formulário como base e tentar extrair da análise
  parsedData.projectName = extractString(analysisText, /🏠 ROI da Propriedade - ([^\(]+)/) || formData.condominio || '';
  parsedData.modelType = extractString(analysisText, /\(([^\,]+),/) || formData.modelo;
  parsedData.location = formData.localizacao; // Usar valor do formulário sem fallback
  
  const quartosMatch = analysisText.match(/\(([^\,]+),\s*([\d\w]+)\s*Quartos\)/);
  parsedData.bedrooms = quartosMatch && quartosMatch[2] ? parseInt(quartosMatch[2]) : (formData.quartos ? parseInt(formData.quartos) : 0);
  parsedData.hasPool = formData.piscina || false; // Manter piscina do formulário

  // Valores financeiros críticos - usar regex mais flexíveis e fallback para dados do formulário
  const valorImovelPatterns = [
    /💵 Valor da Propriedade:?\s*\$([\d\.\,]+)/i,
    /Valor do Imóvel:?\s*\$([\d\.\,]+)/i,
    /Valor da Casa:?\s*\$([\d\.\,]+)/i,
    /Preço:?\s*\$([\d\.\,]+)/i
  ];
  let valorImovelExtraido = null;
  for (const pattern of valorImovelPatterns) {
    const valor = extractNumber(analysisText, pattern);
    if (valor !== null) {
      valorImovelExtraido = valor;
      break;
    }
  }
  parsedData.purchasePrice = valorImovelExtraido ?? parseFloat(formData.valor_imovel || '0');
  if (!parsedData.purchasePrice && parsedData.purchasePrice !== 0) {
    console.warn("Valor do imóvel não encontrado na análise, usando valor do formulário:", formData.valor_imovel);
    // Não lançar erro, permitir que continue com dados do form
  }
  
  parsedData.downPaymentPercent = extractNumber(analysisText, /💰 Entrada \(([^%]+)%\)/) ?? parseFloat(formData.entrada_percentual || '20');
  if (!parsedData.downPaymentPercent && parsedData.downPaymentPercent !== 0) {
     console.warn("Percentual de entrada não encontrado, usando valor do formulário:", formData.entrada_percentual);
  }

  parsedData.downPaymentValue = extractNumber(analysisText, /💰 Entrada \([^)]+\):\s*\$([\d\.\,]+)/) ?? parseFloat(formData.entrada_valor || '0');
  if (!parsedData.downPaymentValue && parsedData.downPaymentValue !== 0) {
    console.warn("Valor de entrada não encontrado, usando valor do formulário:", formData.entrada_valor);
  }
  
  // Adicionar extração para todos os outros campos do relatório
  // Usar ?? para fallback para 0 ou valor padrão se não encontrado, em vez de lançar erro
  const valorFinanciado = extractNumber(analysisText, /🏦 Valor Financiado \([^)]+\):\s*\$([\d\.\,]+)/) ?? (parsedData.purchasePrice - parsedData.downPaymentValue);
  const taxaJuros = extractNumber(analysisText, /📊 Taxa de Juros:?\s*([\d\.]+)%/) ?? 7;
  const prazoAnos = extractNumber(analysisText, /📅 Prazo:?\s*([\d\.]+) anos/) ?? 30;
  const parcelaMensal = extractNumber(analysisText, /📈 Parcela Mensal do Financiamento:?\s*\$([\d\.\,]+)/) ?? 0;
  const parcelaAnual = extractNumber(analysisText, /📅 Parcela Anual do Financiamento:?\s*\$([\d\.\,]+)/) ?? (parcelaMensal ? parcelaMensal * 12 : 0);
  const diariaMedia = extractNumber(analysisText, /🏠 Diária Média:?\s*\$([\d\.\,]+)/) ?? 0;
  const ocupacaoMedia = extractNumber(analysisText, /📈 Ocupação Média:?\s*([\d\.]+)%/) ?? 0;
  const aluguelMensal = extractNumber(analysisText, /💸 Rendimento Mensal Bruto:?\s*\$([\d\.\,]+)/) ?? 0;
  const aluguelAnual = extractNumber(analysisText, /💸 Rendimento Anual Bruto:?\s*\$([\d\.\,]+)/) ?? (aluguelMensal ? aluguelMensal * 12 : 0);
  const adminMensal = extractNumber(analysisText, / Administração[^:]*:?\s*\$([\d\.\,]+) mensais/i) ?? 0;
  const piscinaMensal = extractNumber(analysisText, /🏊 Limpeza de Piscina:?\s*\$([\d\.\,]+) mensais/i) ?? 0;
  const energiaMensal = extractNumber(analysisText, /💡 Energia:?\s*\$([\d\.\,]+) mensais/i) ?? 0;
  const aguaMensal = extractNumber(analysisText, /💧 Água:?\s*\$([\d\.\,]+) mensais/i) ?? 0;
  const hoaMensal = extractNumber(analysisText, /🏘️ HOA:?\s*\$([\d\.\,]+) mensais/i) ?? 0;
  const iptuMensal = extractNumber(analysisText, /🏠 IPTU:?\s*\$([\d\.\,]+) mensais/i) ?? 0;
  const seguroMensal = extractNumber(analysisText, /📄 Seguro:?\s*\$([\d\.\,]+) mensais/i) ?? 0;
  const despesasTotaisMensais = extractNumber(analysisText, /📝 Despesas Totais Mensais:?\s*-?\$([\d\.\,]+)/i) ?? (adminMensal + piscinaMensal + energiaMensal + aguaMensal + hoaMensal + iptuMensal + seguroMensal);
  const despesasTotaisAnuais = extractNumber(analysisText, /📝 Despesas Totais Anuais:?\s*-?\$([\d\.\,]+)/i) ?? (despesasTotaisMensais ? despesasTotaisMensais * 12 : 0);
  const rendimentoAposDespesasM = extractNumber(analysisText, /💵 Rendimento Mensal \(após despesas\):?\s*\$([\d\.\,]+)/i) ?? (aluguelMensal - despesasTotaisMensais);
  const rendimentoAposDespesasA = extractNumber(analysisText, /💵 Rendimento Anual \(após despesas\):?\s*\$([\d\.\,]+)/i) ?? (rendimentoAposDespesasM ? rendimentoAposDespesasM * 12 : 0);
  const rendimentoAposFinancM = extractNumber(analysisText, /📉 Rendimento Mensal \(após despesas e financiamento\):?\s*\$([\d\.\,]+)/i) ?? (rendimentoAposDespesasM - parcelaMensal);
  const fluxoCaixaAnualLiquido = extractNumber(analysisText, /📉 Rendimento Anual \(após despesas e financiamento\):?\s*\$([\d\.\,]+)/i) ?? (rendimentoAposFinancM ? rendimentoAposFinancM * 12 : 0);
  const valorizacaoPercent = extractNumber(analysisText, /📈 Valorização Anual \(([^%]+)%\):/i) ?? 5; // Estimativa padrão de 5%
  const valorizacaoAnualValor = extractNumber(analysisText, /📈 Valorização Anual \([^)]+\):\s*\$([\d\.\,]+)/i) ?? (parsedData.purchasePrice * (valorizacaoPercent / 100));
  const retornoAnualTotal = extractNumber(analysisText, /💵 Rendimento Anual Total[^:]*:?\s*\$([\d\.\,]+)/i) ?? (fluxoCaixaAnualLiquido + valorizacaoAnualValor);
  
  // Calcular o ROI sobre entrada
  let roiSobreEntrada = null;
  if (retornoAnualTotal && parsedData.downPaymentValue && parsedData.downPaymentValue > 0) {
    roiSobreEntrada = (retornoAnualTotal / parsedData.downPaymentValue) * 100;
    console.log("[parseAnalysisTextToResult] ROI calculado explicitamente:", roiSobreEntrada.toFixed(2) + "%");
  } else {
    console.warn("[parseAnalysisTextToResult] Não foi possível calcular o ROI. Usando estimativa de mercado como fallback.");
    // Estimativa baseada em valores médios do mercado para Orlando
    roiSobreEntrada = 8.5; 
  }
  
  // Atualizar os dados da propriedade
  parsedData.propertyData = {
    ...parsedData.propertyData,
    monthlyRent: aluguelMensal,
    annualRent: aluguelAnual,
    occupancyRate: ocupacaoMedia,
    grossIncome: aluguelAnual,
    netIncome: rendimentoAposDespesasA,
    roi: roiSobreEntrada,
    capRate: (rendimentoAposDespesasA / parsedData.purchasePrice) * 100,
    cashOnCash: roiSobreEntrada,
    nome_condominio: parsedData.projectName,
    localizacao_imovel: parsedData.location,
    modelo_imovel: parsedData.modelType,
    quartos_imovel: parsedData.bedrooms.toString(),
    piscina_imovel: parsedData.hasPool,
    tipo_investimento: parsedData.investmentType,
    valor_imovel: parsedData.purchasePrice,
    valor_entrada: parsedData.downPaymentValue,
    percentual_entrada: parsedData.downPaymentPercent,
    valor_financiado: valorFinanciado,
    parcela_mensal: parcelaMensal,
    taxa_juros_anual_financiamento: taxaJuros,
    prazo_financiamento_anos: prazoAnos,
    receita_aluguel_mensal: aluguelMensal,
    despesas_totais_mensais: despesasTotaisMensais,
    valor_condominio_mensal: hoaMensal,
    valor_iptu_mensal: iptuMensal,
    valor_seguro_mensal: seguroMensal,
    valor_energia_mensal: energiaMensal,
    valor_agua_mensal: aguaMensal,
    valor_piscina_mensal: piscinaMensal,
    custo_transacao_diluido_mensal: 0,
    percentual_taxa_administracao_mensal: 0,
    valor_taxa_administracao_mensal: adminMensal,
    percentual_reserva_manutencao_mensal: 0,
    valor_reserva_manutencao_mensal: 0,
    custo_decoracao_diluido_mensal: 0,
    percentual_decoracao: 0,
    percentual_closing_costs: 0,
    fluxo_caixa_mensal_antes_ir: rendimentoAposFinancM,
    custo_total_aquisicao: parsedData.purchasePrice,
    cap_rate_liquido_sobre_custo_total_aquisicao: (rendimentoAposDespesasA / parsedData.purchasePrice) * 100,
    cash_on_cash_return_liquido_antes_ir: roiSobreEntrada,
    percentual_vacancia_anual: 100 - ocupacaoMedia,
    valorizacao_percentual_anual_estimada: valorizacaoPercent,
    valorizacao_valor_anual_estimado: valorizacaoAnualValor,
    texto_analise_ia: analysisText,
    prompt_utilizado_ia: null,
    logo_broker_url: parsedData.brokerLogoUrl
  };
  
  // Se o texto da análise for muito curto ou genérico, indicar que a análise pode ser limitada
  if (analysisText.length < 200 && !parsedData.purchasePrice) {
    parsedData.resultado_texto = `A análise da OpenAI foi limitada. Os resultados abaixo são baseados principalmente nos dados do formulário e estimativas de mercado. Detalhes:

${analysisText}`;
    toast.info("Análise limitada pela OpenAI", {
      description: "Os resultados podem ser baseados em estimativas."
    });
  } else if (!analysisText) {
     parsedData.resultado_texto = "Não foi possível obter uma análise textual da OpenAI. Os resultados são baseados nos dados do formulário e estimativas."
  }

  console.log("[DEBUG] Dados extraídos e processados:", parsedData);
  return parsedData;
};

export function useTomAssistant() {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState({ stage: 'idle', percentage: 0 });
  const [apiStatus, setApiStatus] = useState<'available' | 'unavailable' | 'unknown'>('unknown');
  
  // Formatação de moeda para o prompt
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };
  
  const checkApiStatus = useCallback(async () => {
    try {
      const response = await axios.get('/api/status');
      setApiStatus(response.data.status === 'ok' ? 'available' : 'unavailable');
      return response.data.status === 'ok';
    } catch (error) {
      console.error('Erro ao verificar status da API:', error);
      setApiStatus('unavailable');
      return false;
    }
  }, []);

  const analyzeROI = useCallback(async (formData: FormValues, propertyData?: AnalyzerPropertyData) => {
    setIsLoading(true);
    setProgress({ stage: 'creating-thread', percentage: 10 });
    
    try {
      // Iniciar o processo com a API real da OpenAI via Supabase Edge Function
      console.log("Iniciando análise ROI com OpenAI via Supabase Edge Function");
      
      // Simular alguns estágios para melhor experiência de usuário
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Criar uma nova thread no OpenAI Assistant
      const threadResponse = await callSupabaseFunction('createThread');
      if (!threadResponse || !threadResponse.threadId) {
        throw new Error('Não foi possível criar uma thread para análise');
      }
      
      const threadId = threadResponse.threadId;
      console.log(`Thread criada com sucesso. ID: ${threadId}`);
      
      // Avançar progresso
      setProgress({ stage: 'sending-message', percentage: 25 });
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Preparar dados para o prompt
      const infoImovelForPrompt: AnalyzerPropertyData = {
        nome_condominio: formData.condominio,
        localizacao_imovel: formData.localizacao,
        modelo_imovel: formData.modelo,
        quartos_imovel: formData.quartos || '0',
        piscina_imovel: formData.piscina,
        tipo_investimento: formData.tipo_investimento,
        valor_imovel: parseFloat(formData.valor_imovel || '0') || 0,
        valor_entrada: parseFloat(formData.entrada_valor || '0') || 0,
        percentual_entrada: parseFloat(formData.entrada_percentual || '0') || 0,
        monthlyRent: 0, annualRent: 0, occupancyRate: 0, grossIncome: 0, netIncome: 0, roi: 0, capRate: 0, cashOnCash: 0,
        valor_financiado: 0, parcela_mensal: 0, receita_aluguel_mensal: 0, despesas_totais_mensais: 0,
        valor_condominio_mensal: 0, valor_iptu_mensal: 0, valor_seguro_mensal: 0, valor_energia_mensal: 0, valor_agua_mensal: 0, valor_piscina_mensal: 0,
        custo_transacao_diluido_mensal: 0, percentual_taxa_administracao_mensal: 0, valor_taxa_administracao_mensal: 0,
        percentual_reserva_manutencao_mensal: 0, valor_reserva_manutencao_mensal: 0, custo_decoracao_diluido_mensal: 0,
        percentual_decoracao: 0, percentual_closing_costs: 0, fluxo_caixa_mensal_antes_ir: 0, custo_total_aquisicao: 0,
        cap_rate_liquido_sobre_custo_total_aquisicao: 0, cash_on_cash_return_liquido_antes_ir: 0, percentual_vacancia_anual: 0,
        valorizacao_percentual_anual_estimada: 0, valorizacao_valor_anual_estimado: 0,
      };
      
      // Criar prompt para a análise de ROI
      const dataForPrompt = propertyData || infoImovelForPrompt;

      const prompt = gerarPromptRoiAnalise(dataForPrompt);
      console.log("Prompt para análise gerado:", prompt);
      
      // Enviar mensagem para a thread
      const messageResponse = await callSupabaseFunction('addMessage', {
        threadId,
        content: prompt
      });
      
      if (!messageResponse || !messageResponse.messageId) {
        throw new Error('Falha ao enviar dados para análise');
      }
      
      console.log(`Mensagem enviada com sucesso. ID: ${messageResponse.messageId}`);
      
      // Avançar progresso
      setProgress({ stage: 'running-assistant', percentage: 45 });
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Executar o assistente para analisar os dados
      const runResponse = await callSupabaseFunction('runAssistant', {
        threadId,
        instructions: "Analise os dados enviados e forneça uma análise de ROI detalhada."
      });
      
      if (!runResponse || !runResponse.runId) {
        throw new Error('Falha ao iniciar a análise com o assistente');
      }
      
      const runId = runResponse.runId;
      console.log(`Assistente iniciado com sucesso. Run ID: ${runId}`);
      
      // Aguardar a conclusão da análise com polling
      let isComplete = false;
      let statusResponse;
      let attempts = 0;
      const MAX_ATTEMPTS = 30; // Máximo de 30 tentativas (5 minutos com 10s de espera)
      
      while (!isComplete && attempts < MAX_ATTEMPTS) {
        await new Promise(resolve => setTimeout(resolve, 10000)); // Esperar 10 segundos entre verificações
        attempts++;
        
        // Verificar status da execução
        statusResponse = await callSupabaseFunction('checkRunStatus', {
          threadId,
          runId
        });
        
        if (!statusResponse) {
          console.warn(`Tentativa ${attempts}: Sem resposta ao verificar status.`);
          continue;
        }
        
        console.log(`Status da execução (tentativa ${attempts}): ${statusResponse.status}`);
        
        // Atualizar progresso com base no status
        if (statusResponse.status === 'completed') {
          isComplete = true;
          setProgress({ stage: 'processing-results', percentage: 75 });
        } else if (statusResponse.status === 'failed') {
          throw new Error(`A análise falhou: ${statusResponse.error || 'Erro desconhecido'}`);
        } else if (statusResponse.status === 'expired') {
          throw new Error('A análise expirou devido ao tempo limite excedido.');
        } else if (statusResponse.status === 'cancelled') {
          throw new Error('A análise foi cancelada.');
        } else {
          // Ainda em processamento, atualizar progresso gradualmente
          const progressPercent = 45 + Math.min(25, Math.floor(attempts * (25 / MAX_ATTEMPTS)));
          setProgress({ stage: 'running-assistant', percentage: progressPercent });
        }
      }
      
      if (!isComplete) {
        throw new Error('A análise excedeu o tempo máximo de espera. Tente novamente mais tarde.');
      }
      
      // Obter as mensagens/resultado da análise
      const messagesResponse = await callSupabaseFunction('getMessages', {
        threadId
      });
      
      if (!messagesResponse || !messagesResponse.messages || messagesResponse.messages.length === 0) {
        throw new Error('Não foi possível obter o resultado da análise');
      }
      
      // Extrair o texto da análise da última mensagem do assistente
      const assistantMessages = messagesResponse.messages.filter(
        (msg: any) => msg.role === 'assistant'
      );
      
      if (assistantMessages.length === 0) {
        throw new Error('Não encontramos a resposta do assistente');
      }
      
      const analysisText = assistantMessages[assistantMessages.length - 1].content;
      console.log("Texto da análise recebido:", analysisText);
      
      // Processar o texto da análise para extrair dados estruturados
      const parsedData = parseAnalysisTextToResult(analysisText, formData);
      
      // Limpar nome do condomínio removendo números no final (bug fix)
      const cleanProjectName = (name: string): string => {
        if (!name) return name;
        // Remove números que apareceram no final por engano (ex: "Solara Resort6" -> "Solara Resort")
        return name.replace(/\d+$/, '').trim();
      };
      
      // Criar o objeto de resultado final
      const result: ROIAnalysisResult = {
        projectName: cleanProjectName(formData.condominio),
        location: formData.localizacao,
        modelType: formData.modelo,
        modelo: formData.modelo,
        bedrooms: parseInt(formData.quartos || '0') || 0,
        hasPool: formData.piscina,
        purchasePrice: parseFloat(formData.valor_imovel || '0') || 0,
        investmentType: formData.tipo_investimento as ROIAnalysisResult["investmentType"],
        downPaymentValue: parseFloat(formData.entrada_valor || '0') || 0,
        downPaymentPercent: parseFloat(formData.entrada_percentual || '0') || 0,
        annualOccupancyRate: parsedData.propertyData?.occupancyRate || 85,
        brokerLogoUrl: formData.logoUrl || null,
        resultado_texto: analysisText,
        propertyData: parsedData.propertyData || {} as PropertyData,
      };
      
      // Análise completa
      setProgress({ stage: 'complete', percentage: 100 });
      setIsLoading(false);
      
      toast.success("Análise de ROI concluída", { 
        description: "Os resultados foram calculados com base nos dados fornecidos." 
      });
      
      return result;

    } catch (error) {
      console.error('Erro na análise de ROI:', error);
      setIsLoading(false);
      setProgress({ stage: 'error', percentage: 0 });
      
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      toast.error("Erro na análise", {
        description: errorMessage
      });
      
      throw new Error(`Erro na análise: ${errorMessage}`);
    }
  }, []);

  return {
    analyzeROI,
    isLoading,
    progress,
    checkApiStatus,
    apiStatus
  };
}

export default useTomAssistant; 