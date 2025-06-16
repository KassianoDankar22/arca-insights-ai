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

import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './use-auth';

// Interface para análises ROI do Supabase
interface ROIAnalysis {
  id: string;
  condominio: string;
  criado_em: string;
  entrada_percentual: number | null;
  entrada_valor: number | null;
  expira_em: string;
  localizacao: string;
  logo_storage_url: string | null;
  modelo: string;
  piscina: boolean;
  quartos: number;
  resultado_texto: string | null;
  tipo_investimento: string;
  user_id: string;
  valor_imovel: number;
}

// Interface para os stats do dashboard
interface DashboardStats {
  totalAnalyses: number;
  totalProperties: number;
  totalRevenue: number;
  pendingLeads: number;
  recentAnalyses: ROIAnalysis[];
  monthlyRevenue: {
    month: string;
    revenue: number;
  }[];
  topProperties: {
    id: string;
    title: string;
    monthly_rent: number;
    roi_percentage: number;
  }[];
  averageRoi: number;
  roiChange: number;
  totalOpportunities: number;
  opportunityChange: number;
  averagePrice: number;
  priceChange: number;
  usdToBrl: number;
  lastUpdated: string;
  totalLeads: number;
  closedLeads: number;
  monthlyLeads: number;
  monthlyClosedLeads: number;
  monthlyRevenueBRL: number;
}

interface Lead {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  fonte: string;
  status: 'Novo' | 'Contatado' | 'Qualificado' | 'Proposta Enviada' | 'Negociação' | 'Fechado' | 'Perdido';
  data_criacao: string;
  updated_at: string;
  user_id: string;
  // Note: valor_negociado is not part of the database schema
}

export const useRealDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const generateLeads = () => {
    const leadNames = [
      'João Silva', 'Maria Santos', 'Carlos Oliveira', 'Ana Costa', 'Pedro Almeida',
      'Lucia Ferreira', 'Roberto Lima', 'Fernanda Rocha', 'Eduardo Souza', 'Patricia Dias'
    ];
    
    const sources = ['Website', 'Facebook', 'Google Ads', 'Indicação', 'WhatsApp'];
    const statuses: Lead['status'][] = ['Novo', 'Contatado', 'Qualificado', 'Proposta Enviada', 'Negociação', 'Fechado', 'Perdido'];
    
    return Array.from({ length: 10 }, (_, i) => ({
      id: `lead-${i + 1}`,
      nome: leadNames[i],
      email: `${leadNames[i].toLowerCase().replace(' ', '.')}@email.com`,
      telefone: `(11) 9${Math.floor(Math.random() * 10000)}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
      fonte: sources[Math.floor(Math.random() * sources.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      data_criacao: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date().toISOString(),
      user_id: 'demo-user'
      // Removed valor_negociado as it's not in the database schema
    }));
  };

  const calculateMetrics = (leads: Lead[]) => {
    const totalLeads = leads.length;
    const convertedLeads = leads.filter(lead => lead.status === 'Fechado').length;
    const conversionRate = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0;
    
    // Calculate total value without valor_negociado field
    const totalValue = convertedLeads * 15000; // Average commission value
    
    return {
      totalLeads,
      convertedLeads,
      conversionRate,
      totalValue
    };
  };

  const fetchDashboardStats = async () => {
    if (!user) {
      setStats({
        totalAnalyses: 0,
        totalProperties: 0,
        totalRevenue: 0,
        pendingLeads: 0,
        recentAnalyses: [],
        monthlyRevenue: [],
        topProperties: [],
        averageRoi: 0,
        roiChange: 0,
        totalOpportunities: 0,
        opportunityChange: 0,
        averagePrice: 0,
        priceChange: 0,
        usdToBrl: 5.68,
        lastUpdated: new Date().toLocaleTimeString(),
        totalLeads: 0,
        closedLeads: 0,
        monthlyLeads: 0,
        monthlyClosedLeads: 0,
        monthlyRevenueBRL: 0
      });
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Buscar contagem total de análises
      const { count: totalAnalyses, error: countAnalysesError } = await supabase
        .from('roi_analises')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id);

      // Buscar análises do usuário
      const { data: analyses, error: analysesDataError } = await supabase
        .from('roi_analises')
        .select('*')
        .eq('user_id', user.id)
        .order('criado_em', { ascending: false });

      // Buscar dados de leads
      const { data: leadsData, error: leadsError } = await supabase
        .from('leads')
        .select('*')
        .eq('user_id', user.id);

      // Se não há tabela de leads ou dados, vamos simular alguns dados para demo
      let processedLeadsData = leadsData || [];
      
      if (!leadsData || leadsData.length === 0) {
        // Dados simulados para demonstração
        processedLeadsData = [
          {
            id: '1',
            user_id: user.id,
            nome: 'João Silva',
            email: 'joao@email.com',
            telefone: '(11) 99999-9999',
            fonte: 'Website',
            status: 'Fechado',
            data_criacao: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            valor_negociado: 15000
          },
          {
            id: '2',
            user_id: user.id,
            nome: 'Maria Santos',
            email: 'maria@email.com',
            telefone: '(11) 88888-8888',
            fonte: 'Facebook',
            status: 'Novo',
            data_criacao: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            valor_negociado: 0
          },
          {
            id: '3',
            user_id: user.id,
            nome: 'Pedro Costa',
            email: 'pedro@email.com',
            telefone: '(11) 77777-7777',
            fonte: 'Instagram',
            status: 'Fechado',
            data_criacao: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            valor_negociado: 22000
          }
        ];
      }

      if (countAnalysesError || analysesDataError) {
        throw new Error('Erro ao buscar dados do dashboard');
      }

      // Calcular métricas reais
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
      const sixtyDaysAgo = new Date(now.getTime() - (60 * 24 * 60 * 60 * 1000));

      // Análises recentes (últimos 30 dias)
      const recentAnalyses = (analyses || []).filter(analysis => 
        new Date(analysis.criado_em) > thirtyDaysAgo
      );

      // Análises do período anterior (30-60 dias atrás)
      const previousPeriodAnalyses = (analyses || []).filter(analysis =>
        new Date(analysis.criado_em) > sixtyDaysAgo && 
        new Date(analysis.criado_em) <= thirtyDaysAgo
      );

      // Calcular ROI médio e mudança
      const currentRois = recentAnalyses.map(a => {
        const monthlyRent = a.valor_imovel * 0.008; // Estimativa de 0.8% do valor do imóvel
        const annualRent = monthlyRent * 12;
        return (annualRent / a.valor_imovel) * 100;
      });

      const previousRois = previousPeriodAnalyses.map(a => {
        const monthlyRent = a.valor_imovel * 0.008;
        const annualRent = monthlyRent * 12;
        return (annualRent / a.valor_imovel) * 100;
      });
      
      const averageRoi = currentRois.length > 0 
        ? currentRois.reduce((a, b) => a + b, 0) / currentRois.length 
        : 0;
      
      const previousAverageRoi = previousRois.length > 0
        ? previousRois.reduce((a, b) => a + b, 0) / previousRois.length
        : 0;

      const roiChange = previousAverageRoi !== 0 
        ? ((averageRoi - previousAverageRoi) / previousAverageRoi) * 100 
        : 0;

      // Calcular preço médio e mudança
      const currentPrices = recentAnalyses
        .map(a => a.valor_imovel);
      const previousPrices = previousPeriodAnalyses
        .map(a => a.valor_imovel);

      const averagePrice = currentPrices.length > 0
        ? currentPrices.reduce((a, b) => a + b, 0) / currentPrices.length
        : 0;

      const previousAveragePrice = previousPrices.length > 0
        ? previousPrices.reduce((a, b) => a + b, 0) / previousPrices.length
        : 0;

      const priceChange = previousAveragePrice !== 0
        ? ((averagePrice - previousAveragePrice) / previousAveragePrice) * 100
        : 0;

      // Calcular receita total (baseado nas análises)
      const totalRevenue = (analyses || [])
        .reduce((total, analysis) => {
          const monthlyRent = analysis.valor_imovel * 0.008; // Estimativa de 0.8% do valor do imóvel
          return total + monthlyRent;
        }, 0);

      // Calcular receita mensal dos últimos 6 meses
      const monthlyRevenue = Array.from({ length: 6 }, (_, i) => {
        const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthAnalyses = (analyses || []).filter(a => 
          new Date(a.criado_em).getMonth() === month.getMonth() &&
          new Date(a.criado_em).getFullYear() === month.getFullYear()
        );
        
        return {
          month: month.toLocaleString('default', { month: 'short' }),
          revenue: monthAnalyses.reduce((total, analysis) => {
            const monthlyRent = analysis.valor_imovel * 0.008; // Estimativa de 0.8% do valor do imóvel
            return total + monthlyRent;
          }, 0)
        };
      }).reverse();

      // Calcular oportunidades totais e mudança
      const totalOpportunities = recentAnalyses.length;
      const opportunityChange = previousPeriodAnalyses.length !== 0
        ? ((totalOpportunities - previousPeriodAnalyses.length) / previousPeriodAnalyses.length) * 100
        : 0;

      // Calcular leads pendentes (análises não concluídas)
      const pendingLeads = (analyses || []).filter(a => !a.resultado_texto).length;

      // Processar top properties
      const topProperties = (analyses || [])
        .map(analysis => {
          const monthlyRent = analysis.valor_imovel * 0.008; // Estimativa de 0.8% do valor do imóvel
          const annualRent = monthlyRent * 12;
          const roi = (annualRent / analysis.valor_imovel) * 100;
          
          return {
            id: analysis.id,
            title: analysis.condominio || 'Propriedade Desconhecida',
            monthly_rent: monthlyRent,
            roi_percentage: roi
          };
        })
        .sort((a, b) => b.roi_percentage - a.roi_percentage)
        .slice(0, 3);

      // Calcular métricas de leads
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      const monthlyLeads = (processedLeadsData || []).filter(lead => 
        new Date(lead.data_criacao) >= startOfMonth
      );

      const monthlyClosedLeads = monthlyLeads.filter(lead => 
        lead.status === "Fechado"
      );

      // Calcular receita mensal em BRL
      const monthlyRevenueBRL = monthlyClosedLeads.reduce((total, lead) => 
        total + (lead.valor_negociado || 5000), 0  // valor padrão de 5000 se não houver valor_negociado
      );

      // Atualizar stats com todos os dados calculados
      setStats({
        totalAnalyses: totalAnalyses || 0,
        totalProperties: analyses?.length || 0, // Usando o total de análises como total de propriedades
        totalRevenue,
        pendingLeads,
        recentAnalyses: recentAnalyses || [],
        monthlyRevenue,
        topProperties,
        averageRoi,
        roiChange,
        totalOpportunities,
        opportunityChange,
        averagePrice,
        priceChange,
        usdToBrl: 5.68, // Mantido fixo por enquanto, poderia ser buscado de uma API de câmbio
        lastUpdated: new Date().toLocaleTimeString(),
        totalLeads: processedLeadsData?.length || 0,
        closedLeads: processedLeadsData?.filter(lead => lead.status === "Fechado").length || 0,
        monthlyLeads: monthlyLeads.length,
        monthlyClosedLeads: monthlyClosedLeads.length,
        monthlyRevenueBRL
      });

    } catch (err: any) {
      console.error('Erro ao buscar dados do dashboard:', err);
      setError(err.message || 'Erro ao carregar dados do dashboard');
      setStats({
        totalAnalyses: 0,
        totalProperties: 0,
        totalRevenue: 0,
        pendingLeads: 0,
        recentAnalyses: [],
        monthlyRevenue: [],
        topProperties: [],
        averageRoi: 0,
        roiChange: 0,
        totalOpportunities: 0,
        opportunityChange: 0,
        averagePrice: 0,
        priceChange: 0,
        usdToBrl: 5.68,
        lastUpdated: new Date().toLocaleTimeString(),
        totalLeads: 0,
        closedLeads: 0,
        monthlyLeads: 0,
        monthlyClosedLeads: 0,
        monthlyRevenueBRL: 0
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, [user]);

  return {
    stats,
    loading,
    error,
    refetch: fetchDashboardStats
  };
};
