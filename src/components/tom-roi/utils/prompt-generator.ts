
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

import { TomPropertyAnalysisInput } from "../types/analyzer-types";

/**
 * Gera o prompt para o Claude Sonnet 3.7 com valores pré-calculados
 * O prompt instrui explicitamente o Claude a não alterar ou recalcular valores
 */
export function gerarPromptRoiAnalise(
  analysisInput: TomPropertyAnalysisInput 
): string {
  if (!analysisInput) {
    console.error("[ERRO] gerarPromptRoiAnalise recebeu analysisInput inválido.");
    return `Analise um investimento imobiliário padrão em Orlando, FL, com valor aproximado de $500,000 e 4 quartos. Forneça uma análise de ROI concisa. (Fallback devido a dados de propriedade ausentes)`;
  }

  try {
    // Extrair dados diretamente de analysisInput (valores brutos)
    const valorImovel = analysisInput.purchasePrice;
    const entradaValor = analysisInput.downPaymentValue;
    const entradaPercent = (analysisInput.downPaymentPercent || 0).toFixed(1);
    const taxaJuros = (analysisInput.annualInterestRate || 7.00).toFixed(2);
    const prazoAnos = analysisInput.loanTermYears || 30;
    const diariaMedia = analysisInput.estimatedDailyRate || 200;
    const ocupacao = (analysisInput.annualOccupancyRate || 80).toFixed(1);
    const valorizacaoPercent = (analysisInput.annualAppreciationRate || 3.0).toFixed(1);
    
    const prompt = `
${analysisInput.projectName || 'Não especificado'}
- Localização: ${analysisInput.location || 'Orlando, FL'}
- Modelo: ${analysisInput.modelType || 'Padrão'}
- Quartos: ${analysisInput.bedrooms || '4'}
- Possui piscina: ${analysisInput.hasPool ? 'Sim' : 'Não'}

💰 **Dados do Investimento**
- Valor do imóvel: ${valorImovel}
- Entrada (valor): ${entradaValor}
- Entrada (percentual): ${entradaPercent}%
- Taxa de juros anual: ${taxaJuros}%
- Prazo do financiamento: ${prazoAnos} anos

🏨 **Dados de Aluguel**
- Diária média estimada: ${diariaMedia}
- Taxa de ocupação: ${ocupacao}%

📈 **Valorização**
- Valorização anual estimada (percentual): ${valorizacaoPercent}%

Forneça uma análise concisa com os principais indicadores financeiros deste investimento.
`;

    if (!prompt || prompt.trim().length < 100) {
      console.error("[ERRO] Prompt gerado está vazio ou muito curto");
      return `Analise o investimento imobiliário: Valor ${valorImovel}, Entrada ${entradaValor}, Diária ${diariaMedia}, Ocupação ${ocupacao}%. (Fallback: prompt curto demais)`;
    }

    console.log(`[INFO] Prompt gerado com sucesso: ${prompt.length} caracteres`);
    return prompt;
  } catch (error: any) {
    console.error("[ERRO] Exceção ao gerar prompt:", error);
    return `Analise um investimento imobiliário com os seguintes dados aproximados: Valor $500,000, Entrada $100,000, Diária Mensal $150, Ocupação 80%. (Fallback: exceção ao gerar prompt - ${error.message})`;
  }
} 
