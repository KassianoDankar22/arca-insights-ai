
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

import { z } from 'zod';

/**
 * Valores de entrada do formulário de análise ROI
 */
export interface FormValues {
  condominio: string;
  localizacao: string;
  modelo: string;
  quartos: string;
  piscina: boolean;
  valor_imovel: string;
  entrada_valor: string;
  entrada_percentual: string;
  logoUrl: string | null;
  incluir_decoracao?: boolean;
  decoracao_valor?: string;
  decoracao_percentual?: string;
  incluir_closing_costs?: boolean;
  closing_costs_percentual?: string;
  taxa_juros_anual_financiamento?: string;
  prazo_financiamento_anos?: string;
  tipo_investimento?: 'cash' | 'financing';
}

/**
 * Dados da propriedade para análise
 */
export interface PropertyData {
  // Dados básicos da propriedade
  nome_condominio: string;
  localizacao_imovel: string;
  modelo_imovel: string;
  quartos_imovel: string;
  piscina_imovel: boolean;
  tipo_investimento: 'financing' | 'cash';

  // Detalhes do Financiamento
  valor_imovel: number;
  valor_entrada: number;
  percentual_entrada: number;
  valor_financiado: number;
  taxa_juros_anual_financiamento: number;
  prazo_financiamento_anos: number;
  parcela_mensal: number;

  // Detalhes da Receita
  receita_aluguel_mensal: number;
  occupancyRate: number;
  percentual_vacancia_anual: number;

  // Detalhes das Despesas Mensais
  valor_condominio_mensal: number;
  valor_iptu_mensal: number;
  valor_seguro_mensal: number;
  valor_energia_mensal: number;
  valor_agua_mensal: number;
  percentual_taxa_administracao_mensal: number;
  valor_taxa_administracao_mensal: number;
  valor_piscina_mensal: number;
  despesas_totais_mensais: number;
  custo_transacao_diluido_mensal: number;
  percentual_reserva_manutencao_mensal: number;
  valor_reserva_manutencao_mensal: number;
  custo_decoracao_diluido_mensal: number;
  percentual_decoracao: number;
  percentual_closing_costs: number;
  fluxo_caixa_mensal_antes_ir: number;
  custo_total_aquisicao: number;
  cap_rate_liquido_sobre_custo_total_aquisicao: number;
  cash_on_cash_return_liquido_antes_ir: number;
  valorizacao_percentual_anual_estimada: number;
  valorizacao_valor_anual_estimado: number;

  // Propriedades compatíveis com interfaces antigas
  monthlyRent: number;
  annualRent: number;
  grossIncome: number;
  netIncome: {
    monthly: number;
    annual: number;
  };
  roi: number;
  capRate: number;
  cashOnCash: number;

  // Propriedades para compatibilidade com TomROIResults
  rentalIncome: {
    monthly: number;
    annual: number;
  };
  expenses: {
    monthly: {
      total: number;
    };
    annual: number;
  };
  appreciation: {
    amount: number;
  };
  roiPercentOnDownPayment: number;

  // Propriedades adicionais necessárias
  decoracao_total?: number;
  closing_costs_total?: number;

  // Metadados opcionais
  texto_analise_ia?: string | null;
  prompt_utilizado_ia?: string | null;
  logo_broker_url?: string | null;
}

/**
 * Resultado da análise ROI
 */
export interface ROIAnalysisResult {
  projectName: string;
  location: string;
  modelType: string;
  modelo?: string;
  bedrooms: number;
  hasPool: boolean;
  purchasePrice: number;
  investmentType: 'cash' | 'financing';
  downPaymentValue: number;
  downPaymentPercent: number;
  annualOccupancyRate: number;
  brokerLogoUrl: string | null | undefined;
  resultado_texto: string;
  propertyData: PropertyData;
  analysisDate?: string;
}

/**
 * Estado do progresso da análise
 */
export interface ProgressState {
  stage: string;
  percentage: number;
}

/**
 * Resposta da API de análise
 */
export interface AnalysisResponse {
  result: ROIAnalysisResult;
  propertyData: PropertyData;
}

/**
 * Schema de validação para os dados de entrada da análise
 */
export const tomPropertyAnalysisSchema = z.object({
  projectName: z.string().min(1, 'Nome do projeto é obrigatório'),
  location: z.string().min(1, 'Localização é obrigatória'),
  modelType: z.string().min(1, 'Tipo do modelo é obrigatório'),
  modelo: z.string().min(1, 'Modelo é obrigatório'),
  bedrooms: z.number().min(1, 'Número de quartos deve ser pelo menos 1').max(20, 'Número de quartos não pode exceder 20'),
  hasPool: z.boolean(),
  purchasePrice: z.number()
    .min(100000, 'Valor mínimo do imóvel deve ser $100,000')
    .max(10000000, 'Valor máximo do imóvel deve ser $10,000,000'),
  investmentType: z.enum(['cash', 'financing']),
  downPaymentPercent: z.number()
    .min(0, 'Percentual deve ser positivo')
    .max(100, 'Percentual não pode exceder 100%')
    .optional(),
  downPaymentValue: z.number()
    .min(0, 'Valor da entrada deve ser positivo')
    .optional(),
  closingCostsValue: z.number()
    .min(0, 'Custos de fechamento devem ser positivos')
    .optional(),
  decorationCostType: z.enum(['percentage', 'fixed_amount']).optional(),
  decorationCostValue: z.number()
    .min(0, 'Valor da decoração deve ser positivo')
    .optional(),
  annualOccupancyRate: z.number()
    .min(50, 'Taxa de ocupação deve ser no mínimo 50%')
    .max(100, 'Taxa de ocupação não pode exceder 100%'),
  brokerLogoUrl: z.string().url("URL do logo inválida").nullable().optional(),
  annualInterestRate: z.number().optional(),
  loanTermYears: z.number().optional(),
  estimatedDailyRate: z.number().optional(),
  condoFeeMonthly: z.number().optional(),
  propertyManagementFeePercent: z.number().optional(),
  annualAppreciationRate: z.number().optional(),
});

export type TomPropertyAnalysisInput = z.infer<typeof tomPropertyAnalysisSchema>;

export interface AnalysisLoadingProps {
  stage?: string;
  percentage?: number;
  onRetry?: () => void;
}

export interface TomROIResultsProps {
  result: ROIAnalysisResult;
  propertyData: PropertyData;
  onBack: () => void;
  onSave: () => void;
  isSaving: boolean;
  analysisSaved: boolean;
  logoUrl: string | null;
  onNewAnalysis?: () => void;
  onSaveAsPDF?: () => void;
  onSaveAsImage?: () => void;
  showBackButton?: boolean;
  backPath?: string;
  backText?: string;
}
