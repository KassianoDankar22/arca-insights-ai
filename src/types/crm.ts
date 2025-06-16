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

export interface Lead {
  id: string;
  nome: string;
  email?: string;
  telefone?: string;
  status: 'Novo' | 'Contatado' | 'Qualificado' | 'Proposta Enviada' | 'Negociação' | 'Fechado' | 'Perdido';
  fonte?: string;
  dataCriacao: string;
} 

export interface Atividade {
  id: string;
  descricao: string;
  data: string;
  leadId?: string;
  tipo: 'contato' | 'reuniao' | 'proposta' | 'negociacao' | 'fechamento';
}

export interface FunilEtapa {
  id: string;
  nome: string;
  ordem: number;
  cor: string;
}

export interface CrmMetrics {
  novosLeads: number;
  taxaConversao: number;
  negociosEmAndamento: number;
  valorTotalEmNegociacao: number;
} 