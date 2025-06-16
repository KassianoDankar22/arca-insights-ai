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

import { z } from 'zod';
// import { Property } from "@/app/core/types"; // REMOVED

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
}

/**
 * Dados da propriedade para análise
 */
export interface PropertyData {
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
  closing_costs_total: number;
  decoracao_total: number;
  percentual_closing_costs_aplicado: number;
  percentual_decoracao_aplicado: number;

  // Detalhes da Receita
  diaria_media_estimada: number;
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
  valor_manutencao_mensal?: number; // Opcional, se não for sempre calculado
  valor_reserva_manutencao_mensal?: number; // Opcional
  valor_taxa_marketing_mensal?: number; // Opcional
}

/**
 * Resultado da análise ROI
 */
export interface ROIAnalysisResult {
  projectName: string;
  analysisDate: string;
  location: string;
  modelType: string;
  bedrooms: number;
  hasPool: boolean;
  purchasePrice: number;
  downPaymentValue: number;
  downPaymentPercent: number;
  annualOccupancyRate: number;
  brokerLogoUrl: string | null | undefined;
  resultado_texto: string;
  propertyData: PropertyData;
  financialMetrics: any;
  recommendations: string[];
  warnings: string[];
  threadId: string;
  runId: string;
  statusApi: string;
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
  decorationCostType: z.enum(['percentage', 'fixed_amount'], {
    errorMap: () => ({ message: 'Tipo de custo de decoração inválido' })
  }).optional(),
  decorationCostValue: z.number()
    .min(0, 'Valor da decoração deve ser positivo')
    .optional(),
  estimatedDailyRate: z.number({
    invalid_type_error: "Diária estimada deve ser um número.",
  }).min(0, "Diária estimada não pode ser negativa.").optional(),
  annualOccupancyRate: z.number()
    .min(50, 'Taxa de ocupação deve ser no mínimo 50%')
    .max(100, 'Taxa de ocupação não pode exceder 100%'),
  brokerLogoUrl: z.string().url("URL do logo inválida").nullable().optional(),
  annualInterestRate: z.number({
    invalid_type_error: "Taxa de juros anual deve ser um número.",
  }).min(0, "Taxa de juros não pode ser negativa.").max(30, "Taxa de juros não pode exceder 30%").optional(),
  loanTermYears: z.number({
    invalid_type_error: "Prazo do financiamento deve ser um número.",
  }).min(1, "Prazo do financiamento deve ser ao menos 1 ano.").max(30, "Prazo máximo de 30 anos.").int("Prazo do financiamento deve ser um número inteiro de anos.").optional(),
  propertyTaxAnnual: z.number({
    invalid_type_error: "IPTU anual deve ser um número.",
  }).min(0, "IPTU anual não pode ser negativo.").optional(),
  condoFeeMonthly: z.number({
    invalid_type_error: "Taxa de condomínio mensal deve ser um número.",
  }).min(0, "Taxa de condomínio não pode ser negativa.").max(5000, "Taxa de condomínio não pode exceder $5,000").optional(),
  insuranceAnnual: z.number({
    invalid_type_error: "Seguro anual deve ser um número.",
  }).min(0, "Seguro anual não pode ser negativo.").max(10000, "Seguro anual não pode exceder $10,000").optional(),
  estimatedMonthlyRentForCalc: z.number({
    invalid_type_error: "Aluguel mensal estimado deve ser um número.",
  }).min(0, "Aluguel mensal estimado não pode ser negativo.").optional(),
  propertyManagementFeePercent: z.number({
    invalid_type_error: "Percentual da taxa de administração deve ser um número.",
  }).min(15, "Percentual da taxa de administração deve ser no mínimo 15%").max(25, "Percentual da taxa de administração não pode ser maior que 25%").optional(),
  maintenanceReservePercent: z.number({
    invalid_type_error: "Percentual da reserva de manutenção deve ser um número.",
  }).min(0, "Percentual da reserva de manutenção não pode ser negativo.").max(100, "Percentual da reserva de manutenção não pode ser maior que 100.").optional(),
  annualAppreciationRate: z.number({
    invalid_type_error: "Taxa de valorização anual deve ser um número.",
  }).min(0, "Taxa de valorização não pode ser negativa.").max(15, "Taxa de valorização não pode exceder 15% ao ano.").optional(),
}).refine((data) => {
  if (data.downPaymentValue && data.purchasePrice) {
    return data.downPaymentValue <= data.purchasePrice;
  }
  return true;
}, {
  message: "Valor da entrada não pode exceder o valor do imóvel",
  path: ["downPaymentValue"]
});

export type TomPropertyAnalysisInput = z.infer<typeof tomPropertyAnalysisSchema>;

export interface AnalysisLoadingProps {
  stage?: string;
  percentage?: number;
  onRetry?: () => void;
}

export interface TomROIResultsProps {
  result: ROIAnalysisResult;
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
