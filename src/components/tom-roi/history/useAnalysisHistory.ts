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
 * Component: useAnalysisHistory - ROI Analysis History Hook
 * ========================================
 */

import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { toast } from 'sonner';
import { calcularAguaMensalPorQuartos, calcularSeguroMensalPorQuartos } from '@/components/tom-roi/utils/financial-utils';
import { getHOAByCondominiumAndBedrooms, getDefaultHOAByBedrooms } from '@/components/tom-roi/data/hoa-table';

export interface RoiAnalise {
  id: string;
  condominio: string;
  localizacao: string;
  criado_em: string;
  expira_em: string;
  // Campos adicionais da tabela roi_analises
  valor_imovel: number;
  entrada_valor?: number;
  entrada_percentual?: number;
  modelo: string;
  quartos: number;
  piscina: boolean;
  tipo_investimento: string;
  resultado_texto?: string;
  logo_storage_url?: string;
}

// Interface específica para o histórico de análises ROI
export interface ROIAnalysisHistoryItem {
  id: string;
  title: string;
  summary: string;
  details: {
    propertyValue: number;
    monthlyRent: number;
    roi: number;
    location: string;
    bedrooms: number;
    hasPool: boolean;
    downPayment: number;
    downPaymentPercentage: number;
    propertyType: string;
    model: string;
  };
  createdAt: string;
  propertyData: {
    condominio: string;
    localizacao: string;
    modelo: string;
    quartos: string;
    piscina: boolean;
    valor_imovel: string;
    entrada_valor: string;
    entrada_percentual: string;
  };
}

// Função para calcular ROI usando exatamente a mesma lógica da página de detalhes
const calculateROILikeDetailPage = (analysis: any): number => {
  const propertyValue = analysis.valor_imovel || 0;
  const downPaymentAmount = analysis.entrada_valor || (propertyValue * 0.3);
  
  // Calcular aluguel mensal baseado no valor do imóvel (0.8% do valor)
  const monthlyRent = Math.floor(propertyValue * 0.008);
  
  // Calcular despesas mensais usando as funções corretas
  const adminFee = Math.floor(monthlyRent * 0.20); // 20% do aluguel
  const iptuAnual = propertyValue * 0.012; // 1.2% anual do valor (IPTU correto para FL)
  const iptu = Math.floor(iptuAnual / 12);
  
  // Usar função correta para seguro baseado em quartos
  const insurance = calcularSeguroMensalPorQuartos(analysis.quartos || 3);
  
  // Energia: $75 por quarto (valor mais realista)
  const utilities = 75 * (analysis.quartos || 3);
  
  // Usar função correta para água baseado em quartos e piscina
  const water = calcularAguaMensalPorQuartos(analysis.quartos || 3, analysis.piscina || false);
  
  // Usar função correta para HOA baseado no condomínio e quartos
  let hoa: number;
  if (analysis.condominio) {
    const hoaFromTable = getHOAByCondominiumAndBedrooms(analysis.condominio, analysis.quartos || 3);
    if (hoaFromTable) {
      hoa = hoaFromTable;
    } else {
      hoa = getDefaultHOAByBedrooms(analysis.quartos || 3);
    }
  } else {
    hoa = getDefaultHOAByBedrooms(analysis.quartos || 3);
  }
  
  const poolMaintenance = analysis.piscina ? 120 : 0; // Manutenção piscina
  
  const monthlyExpenses = adminFee + iptu + insurance + utilities + water + hoa + poolMaintenance;
  
  // Calcular financiamento
  const monthlyPayment = propertyValue > downPaymentAmount ? Math.floor((propertyValue - downPaymentAmount) / (30 * 12)) : 0;
  
  // Calcular renda líquida
  const monthlyNetIncome = monthlyRent - monthlyExpenses - monthlyPayment;
  const annualNetIncome = monthlyNetIncome * 12;
  
  // Valorização anual
  const appreciationAmount = propertyValue * 0.06;
  
  // ROI total anual
  const totalAnnualReturn = annualNetIncome + appreciationAmount;
  
  // Extrair dados de decoração e closing costs do resultado_texto
  let decorationAmount = 0;
  let closingCostsAmount = 0;
  
  if (analysis.resultado_texto) {
    try {
      const resultData = JSON.parse(analysis.resultado_texto);
      
      // Verificar se decoração foi incluída
      if (resultData.decoracao_total !== undefined) {
        decorationAmount = resultData.decoracao_total || 0;
      } else if (resultData.incluiu_decoracao === false) {
        decorationAmount = 0;
      }
      
      // Verificar se closing costs foi incluído
      if (resultData.closing_costs_total !== undefined) {
        closingCostsAmount = resultData.closing_costs_total || 0;
      } else if (resultData.incluiu_closing_costs === false) {
        closingCostsAmount = 0;
      }
    } catch (error) {
      console.error('Erro ao parsear resultado_texto:', error);
    }
  }
  
  // Calcular investimento total incluindo decoração e closing costs
  const totalInvestment = downPaymentAmount + closingCostsAmount + decorationAmount;
  const roiPercentage = totalInvestment > 0 ? (totalAnnualReturn / totalInvestment) * 100 : 0;
  
  console.log('[calculateROILikeDetailPage] Despesas calculadas:', {
    adminFee,
    iptu,
    insurance,
    utilities,
    water,
    hoa,
    poolMaintenance,
    total: monthlyExpenses,
    quartos: analysis.quartos,
    piscina: analysis.piscina,
    condominio: analysis.condominio
  });
  
  return roiPercentage;
};

export const useAnalysisHistory = () => {
  const [analyses, setAnalyses] = useState<ROIAnalysisHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAnalysisId, setSelectedAnalysisId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Função para buscar análises do banco de dados
  const fetchAnalyses = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('roi_analises')
        .select('*')
        .eq('user_id', user.id)
        .order('criado_em', { ascending: false });

      if (error) {
        console.error('Error fetching analyses:', error);
        toast.error('Erro ao carregar análises');
        setAnalyses([]);
        return;
      }

      // Converter dados do banco para formato do componente
      const formattedAnalyses: ROIAnalysisHistoryItem[] = (data || []).map(analysis => {
        // Calcular valores baseados nos dados reais
        const propertyValue = analysis.valor_imovel || 0;
        const downPaymentPercentage = analysis.entrada_percentual || 30;
        const downPayment = analysis.entrada_valor || (propertyValue * (downPaymentPercentage / 100));
        
        // USAR A MESMA LÓGICA DA PÁGINA DE DETALHES
        const roiPercentage = calculateROILikeDetailPage(analysis);
        
        // Calcular valores para exibição usando a mesma lógica
        const monthlyRent = Math.floor(propertyValue * 0.008);
        const monthlyExpenses = Math.floor(monthlyRent * 0.35);
        const netAnnualIncome = (monthlyRent - monthlyExpenses) * 12;
        const appreciationAmount = propertyValue * 0.06;
        const totalAnnualReturn = netAnnualIncome + appreciationAmount;
        
        return {
        id: analysis.id,
        title: analysis.condominio || 'Análise sem título',
          summary: `${analysis.tipo_investimento} • ${analysis.localizacao}`,
        details: {
            propertyValue: propertyValue,
            monthlyRent: monthlyRent,
            roi: roiPercentage,
          location: analysis.localizacao || '',
          bedrooms: analysis.quartos || 0,
            hasPool: analysis.piscina || false,
            downPayment: downPayment,
            downPaymentPercentage: downPaymentPercentage,
            propertyType: analysis.tipo_investimento || '',
            model: analysis.modelo || ''
        },
        createdAt: analysis.criado_em,
        // Campos adicionais para compatibilidade
        propertyData: {
          condominio: analysis.condominio || '',
          localizacao: analysis.localizacao || '',
          modelo: analysis.modelo || '',
          quartos: analysis.quartos?.toString() || '',
          piscina: analysis.piscina || false,
          valor_imovel: analysis.valor_imovel?.toString() || '',
          entrada_valor: analysis.entrada_valor?.toString() || '',
          entrada_percentual: analysis.entrada_percentual?.toString() || ''
        }
        };
      });

      setAnalyses(formattedAnalyses);
    } catch (error) {
      console.error('Error in fetchAnalyses:', error);
      toast.error('Erro inesperado ao carregar análises');
      setAnalyses([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Carregar análises quando o usuário estiver disponível
  useEffect(() => {
    fetchAnalyses();
  }, [fetchAnalyses]);

  const handleDelete = useCallback((analysisId: string) => {
    setSelectedAnalysisId(analysisId);
    setDeleteDialogOpen(true);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!selectedAnalysisId) return;

    try {
      const { error } = await supabase
        .from('roi_analises')
        .delete()
        .eq('id', selectedAnalysisId)
        .eq('user_id', user?.id); // Garantir que só delete análises do próprio usuário

      if (error) throw error;

      setAnalyses(prev => prev.filter(analysis => analysis.id !== selectedAnalysisId));
      toast.success('Análise excluída com sucesso!');
    } catch (error) {
      console.error('Error deleting analysis:', error);
      toast.error('Erro ao excluir análise');
    } finally {
      setDeleteDialogOpen(false);
      setSelectedAnalysisId(null);
    }
  }, [selectedAnalysisId, user?.id]);

  const handleView = useCallback((analysisId: string) => {
    navigate(`/analise/tom/${analysisId}`);
  }, [navigate]);

  const handleBack = useCallback(() => {
    navigate('/analise/tom');
  }, [navigate]);

  // Função auxiliar para criar análise de exemplo
  const createSampleAnalysis = async () => {
    if (!user) return;

    try {
      const sampleAnalysis = {
        user_id: user.id,
        condominio: 'Residencial Exemplo',
        localizacao: 'Orlando, FL',
        valor_imovel: 350000,
        entrada_valor: 105000,
        entrada_percentual: 30,
        piscina: true,
        modelo: 'Casa de Férias',
        quartos: 4,
        tipo_investimento: 'Aluguel por Temporada'
      };

      const { error } = await supabase
        .from('roi_analises')
        .insert([sampleAnalysis]);

      if (error) throw error;

      fetchAnalyses(); // Recarregar lista
      toast.success('Análise de exemplo criada!');
    } catch (error) {
      console.error('Error creating sample analysis:', error);
      toast.error('Erro ao criar exemplo');
    }
  };

  return {
    analyses,
    loading,
    deleteDialogOpen,
    setDeleteDialogOpen,
    handleDelete,
    confirmDelete,
    handleView,
    handleBack,
    createSampleAnalysis,
    fetchAnalyses // Expor para permitir atualização manual
  };
};
