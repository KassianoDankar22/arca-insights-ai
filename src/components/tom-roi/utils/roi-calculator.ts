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

import { PropertyData } from "../types/analyzer-types";

// Dados de entrada para o cálculo do ROI
export interface ROIInputData {
  valorImovel: number;
  entrada: { 
    valor: number; 
    percentual: number 
  };
  diariaMedia: number;
  ocupacao: number; // 0 a 1 (decimal)
  taxaJuros: number; // em decimal (ex: 0.07 para 7%)
  prazoAnos: number;
  despesasMensais: Record<string, number>;
  valorizacaoAnual: number; // em decimal (ex: 0.06 para 6%)
  quartos?: number; // Adicionado para as regras de cálculo
  temPiscina?: boolean; // Adicionado para as regras de cálculo
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
  if (quartos >= 9 && quartos <= 10) return 367;
  if (quartos > 10) return 400;
  
  // Default para 3 quartos se não especificado
  return 167;
}

/**
 * Calcula o valor da água mensal baseado no número de quartos e presença de piscina
 * Regras para casas de férias em Orlando e região
 */
export function calcularAguaMensalPorQuartos(quartos: number, temPiscina: boolean = false): number {
  const valoresSemPiscina = {
    2: 70,
    3: 80,
    4: 90,
    5: 100,
    6: 110,
    7: 120,
    8: 130,
    9: 140,
    10: 140,
  };
  
  const valoresComPiscina = {
    2: 110,
    3: 120,
    4: 130,
    5: 140,
    6: 150,
    7: 160,
    8: 170,
    9: 180,
    10: 180,
  };
  
  // Para quartos > 10
  if (quartos > 10) {
    return temPiscina ? 190 : 150;
  }
  
  // Para quartos específicos
  const valores = temPiscina ? valoresComPiscina : valoresSemPiscina;
  const valorQuarto = valores[quartos as keyof typeof valores];
  
  if (valorQuarto) {
    return valorQuarto;
  }
  
  // Default para 3 quartos se não especificado
  return temPiscina ? 120 : 80;
}

/**
 * Função unificada para cálculo de ROI imobiliário
 * Esta é a ÚNICA fonte de verdade para os cálculos de ROI da aplicação
 */
export function calcularROIUnificado(dadosBase: ROIInputData): PropertyData {
  // Validação de dados de entrada
  if (!dadosBase.valorImovel || dadosBase.valorImovel <= 0) {
    console.warn("[calcularROIUnificado] Valor do imóvel inválido, usando valor padrão");
    dadosBase.valorImovel = 897000; // Valor médio para estimativas
  }

  // Aplicar regras automáticas de cálculo para seguro e água
  if (dadosBase.quartos && dadosBase.quartos > 0) {
    // Calcular seguro automaticamente baseado no número de quartos
    dadosBase.despesasMensais.seguro = calcularSeguroMensalPorQuartos(dadosBase.quartos);
    
    // Calcular água automaticamente baseado no número de quartos e piscina
    dadosBase.despesasMensais.agua = calcularAguaMensalPorQuartos(dadosBase.quartos, dadosBase.temPiscina || false);
    
    console.log(`[calcularROIUnificado] Aplicando regras automáticas para ${dadosBase.quartos} quartos:`);
    console.log(`- Seguro: $${dadosBase.despesasMensais.seguro}`);
    console.log(`- Água: $${dadosBase.despesasMensais.agua} ${dadosBase.temPiscina ? '(com piscina)' : '(sem piscina)'}`);
  }
  
  // Entrada
  const valorImovel = dadosBase.valorImovel;
  const entradaPercentual = dadosBase.entrada.percentual;
  const entradaValor = dadosBase.entrada.valor > 0 
    ? dadosBase.entrada.valor 
    : valorImovel * (entradaPercentual / 100);
  
  // Valor financiado e parcela
  const valorFinanciado = valorImovel - entradaValor;
  const taxaJurosMensal = dadosBase.taxaJuros / 12; // Taxa mensal
  const prazoMeses = dadosBase.prazoAnos * 12;
  
  // Cálculo da parcela mensal usando a fórmula de financiamento
  let parcelaMensal = 0;
  if (valorFinanciado > 0) {
    if (taxaJurosMensal > 0) {
      parcelaMensal = valorFinanciado * 
        (taxaJurosMensal * Math.pow(1 + taxaJurosMensal, prazoMeses)) / 
        (Math.pow(1 + taxaJurosMensal, prazoMeses) - 1);
    } else {
      // Financiamento sem juros (improvável, mas possível)
      parcelaMensal = valorFinanciado / prazoMeses;
    }
  }
  const parcelaAnual = parcelaMensal * 12;
  
  // Aluguel (receita)
  const diariaMedia = dadosBase.diariaMedia;
  const ocupacao = dadosBase.ocupacao; // já em decimal (0.8 = 80%)
  const aluguelMensal = diariaMedia * 30 * ocupacao;
  const aluguelAnual = aluguelMensal * 12;
  
  // Despesas operacionais
  const despesasMensaisTotal = Object.values(dadosBase.despesasMensais).reduce((a, b) => a + b, 0);
  const despesasAnuaisTotal = despesasMensaisTotal * 12;
  
  // Array de breakdown para despesas
  const despesasBreakdown = Object.entries(dadosBase.despesasMensais).map(([name, value]) => {
    // Mapear nomes padronizados para os nomes esperados no frontend
    const nameMap: Record<string, string> = {
      admin: "ADMIN",
      piscina: "PISCINA",
      energia: "ENERGIA",
      agua: "ÁGUA", 
      hoa: "HOA",
      iptu: "IMPOSTO",
      seguro: "SEGURO"
    };
    
    return { 
      name: nameMap[name] || name.toUpperCase(), 
      value 
    };
  });
  
  // Fluxo de caixa
  const liquidoPreFinanciamento = aluguelMensal - despesasMensaisTotal;
  const fluxoCaixaMensal = liquidoPreFinanciamento - parcelaMensal;
  const fluxoCaixaAnual = fluxoCaixaMensal * 12;
  
  // Valorização anual
  const valorizacaoPercent = dadosBase.valorizacaoAnual * 100; // Converte para percentual
  const valorizacaoAnualValor = valorImovel * dadosBase.valorizacaoAnual;
  
  // Retorno total e ROI
  const retornoAnualTotal = fluxoCaixaAnual + valorizacaoAnualValor;
  const roiSobreEntrada = entradaValor > 0 ? (retornoAnualTotal / entradaValor) * 100 : 0;
  
  console.log("[calcularROIUnificado] Resultado do cálculo:", {
    ROI: roiSobreEntrada.toFixed(1) + "%",
    retornoAnualTotal: retornoAnualTotal,
    fluxoLiquido: fluxoCaixaAnual,
    valorizacao: valorizacaoAnualValor,
    valorImovel: valorImovel,
    aluguelMensal: aluguelMensal,
    ocupacao: ocupacao * 100 + "%",
    despesasMensais: despesasMensaisTotal
  });
  
  // Retornar o objeto completo no formato PropertyData
  return {
    // --- Identificação do Imóvel ---
    nome_condominio: '',
    localizacao_imovel: '',
    modelo_imovel: '',
    quartos_imovel: String(dadosBase.quartos || 0),
    piscina_imovel: dadosBase.temPiscina || false,
    tipo_investimento: valorFinanciado > 0 ? 'financing' : 'cash',

    // --- Detalhes do Financiamento ---
    valor_imovel: valorImovel,
    valor_entrada: entradaValor,
    percentual_entrada: entradaPercentual,
    valor_financiado: valorFinanciado,
    taxa_juros_anual_financiamento: dadosBase.taxaJuros * 100,
    prazo_financiamento_anos: dadosBase.prazoAnos,
    parcela_mensal: parcelaMensal,
    closing_costs_total: valorImovel * 0.05,
    decoracao_total: valorImovel * 0.15,
    percentual_closing_costs_aplicado: 5,
    percentual_decoracao_aplicado: 15,

    // --- Detalhes da Receita ---
    diaria_media_estimada: diariaMedia,
    receita_aluguel_mensal: aluguelMensal,
    occupancyRate: ocupacao * 100,
    percentual_vacancia_anual: (1 - ocupacao) * 100,

    // --- Detalhes das Despesas Mensais ---
    valor_condominio_mensal: dadosBase.despesasMensais.hoa || 0,
    valor_iptu_mensal: dadosBase.despesasMensais.iptu || 0,
    valor_seguro_mensal: dadosBase.despesasMensais.seguro || 0,
    valor_energia_mensal: dadosBase.despesasMensais.energia || 0,
    valor_agua_mensal: dadosBase.despesasMensais.agua || 0,
    percentual_taxa_administracao_mensal: 20,
    valor_taxa_administracao_mensal: dadosBase.despesasMensais.admin || 0,
    valor_piscina_mensal: dadosBase.despesasMensais.piscina || 0,
    despesas_operacionais_mensais: despesasMensaisTotal,

    // --- Totais e Fluxo de Caixa ---
    despesas_totais_mensais: despesasMensaisTotal + parcelaMensal,
    fluxo_caixa_mensal_antes_ir: fluxoCaixaMensal,
    fluxo_caixa_anual_antes_ir: fluxoCaixaAnual,

    // --- Custos Iniciais e Retorno sobre Investimento ---
    custo_total_investimento_inicial: entradaValor + (valorImovel * 0.05) + (valorImovel * 0.15),
    custo_total_aquisicao: valorImovel + (valorImovel * 0.05) + (valorImovel * 0.15),
    cap_rate_liquido_sobre_valor_imovel: valorImovel > 0 ? ((aluguelAnual - despesasAnuaisTotal) / valorImovel) * 100 : 0,
    cash_on_cash_return_liquido_antes_ir: roiSobreEntrada,

    // --- Valorização ---
    valorizacao_percentual_anual_estimada: dadosBase.valorizacaoAnual * 100,
    valorizacao_valor_anual_estimado: valorizacaoAnualValor,

    // --- Campos para compatibilidade com IA e estrutura antiga ---
    monthlyRent: aluguelMensal,
    annualRent: aluguelAnual,
    grossIncome: aluguelAnual,
    netIncome: fluxoCaixaAnual,
    roi: roiSobreEntrada,
    capRate: valorImovel > 0 ? ((aluguelAnual - despesasAnuaisTotal) / valorImovel) * 100 : 0,
    cashOnCash: roiSobreEntrada,

    // --- IA e Logo ---
    texto_analise_ia: null,
    prompt_utilizado_ia: null,
    logo_broker_url: undefined,

    // --- Detalhamento de despesas para exibição/prompt ---
    despesas_detalhadas_mensais: {
      condominio: dadosBase.despesasMensais.hoa || 0,
      iptu: dadosBase.despesasMensais.iptu || 0,
      seguro: dadosBase.despesasMensais.seguro || 0,
      taxa_administracao: dadosBase.despesasMensais.admin || 0,
      agua: dadosBase.despesasMensais.agua || 0,
      energia: dadosBase.despesasMensais.energia || 0,
      piscina: dadosBase.despesasMensais.piscina || 0,
      parcela_financiamento: parcelaMensal,
    },
  };
} 