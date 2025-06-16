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

interface AdminStats {
  activeUsers: number;
  todayAnalyses: number;
  monthlyRevenue: number;
  conversionRate: number;
  growthData: Array<{
    name: string;
    usuarios: number;
    receita: number;
    analises: number;
    date: string;
  }>;
  plansDistribution: Array<{
    name: string;
    value: number;
    color: string;
    percentage: number;
  }>;
  supportTickets: Array<{
    status: string;
    count: number;
    color: string;
    trend: number;
  }>;
  recentActivity: Array<{
    id: string;
    type: string;
    message: string;
    user: string;
    time: string;
    icon: string;
    color: string;
    timestamp: Date;
  }>;
  trends: {
    userGrowth: number;
    revenueGrowth: number;
    analysesGrowth: number;
    conversionChange: number;
  };
}

export const useSimulatedAdminData = () => {
  const [data, setData] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSimulatedData = async (): Promise<AdminStats> => {
    try {
      // Verificar autenticação
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      // Simular dados realistas baseados no tempo atual
      const now = new Date();
      const baseUsers = 127;
      const dailyGrowth = Math.floor(Math.random() * 3) + 1;
      const activeUsers = baseUsers + Math.floor((now.getTime() / (1000 * 60 * 60 * 24)) % 30) * dailyGrowth;
      
      const todayAnalyses = Math.floor(Math.random() * 12) + 8;
      
      // Distribuição realista de planos
      const planCounts = {
        free: Math.floor(activeUsers * 0.75),
        pro: Math.floor(activeUsers * 0.20),
        enterprise: Math.floor(activeUsers * 0.05)
      };

      const plansDistribution = [
        {
          name: 'Gratuito',
          value: planCounts.free,
          color: '#6B7280',
          percentage: Math.round((planCounts.free / activeUsers) * 100)
        },
        {
          name: 'Pro',
          value: planCounts.pro,
          color: '#3B82F6',
          percentage: Math.round((planCounts.pro / activeUsers) * 100)
        },
        {
          name: 'Enterprise',
          value: planCounts.enterprise,
          color: '#8B5CF6',
          percentage: Math.round((planCounts.enterprise / activeUsers) * 100)
        }
      ];

      const monthlyRevenue = (planCounts.pro * 49.90) + (planCounts.enterprise * 199.90);
      const paidUsers = planCounts.pro + planCounts.enterprise;
      const conversionRate = (paidUsers / activeUsers) * 100;

      const supportTickets = [
        {
          status: 'Aberto',
          count: Math.floor(Math.random() * 6) + 2,
          color: 'bg-red-100 text-red-800',
          trend: 1
        },
        {
          status: 'Em Andamento',
          count: Math.floor(Math.random() * 4) + 1,
          color: 'bg-yellow-100 text-yellow-800',
          trend: 1
        },
        {
          status: 'Resolvido',
          count: Math.floor(Math.random() * 15) + 20,
          color: 'bg-green-100 text-green-800',
          trend: 1
        }
      ];

      // Dados históricos
      const growthData = [];
      const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul'];
      
      for (let i = 6; i >= 0; i--) {
        const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const baseForMonth = baseUsers - (i * 12);
        const usuarios = Math.max(15, baseForMonth + Math.floor(Math.random() * 15));
        const analises = Math.floor(usuarios * 0.4) + Math.floor(Math.random() * 8);
        const receita = Math.floor(usuarios * 0.25 * 70);

        growthData.push({
          name: months[6 - i],
          usuarios,
          receita,
          analises,
          date: monthDate.toISOString().split('T')[0]
        });
      }

      // Tendências
      const lastMonth = growthData[growthData.length - 2];
      const currentMonth = growthData[growthData.length - 1];

      const userGrowth = ((currentMonth.usuarios - lastMonth.usuarios) / lastMonth.usuarios) * 100;
      const revenueGrowth = ((currentMonth.receita - lastMonth.receita) / lastMonth.receita) * 100;
      const analysesGrowth = ((currentMonth.analises - lastMonth.analises) / lastMonth.analises) * 100;

      // Atividades recentes
      const recentActivity = [
        {
          id: '1',
          type: 'user_signup',
          message: 'Novo usuário cadastrado',
          user: `Usuário ${Math.random().toString(36).substr(2, 8)}`,
          time: '3 min',
          icon: 'Users',
          color: 'bg-green-100 text-green-600',
          timestamp: new Date(Date.now() - 3 * 60000)
        },
        {
          id: '2',
          type: 'analysis',
          message: 'Análise ROI concluída',
          user: `Usuário ${Math.random().toString(36).substr(2, 8)}`,
          time: '7 min',
          icon: 'BarChart3',
          color: 'bg-purple-100 text-purple-600',
          timestamp: new Date(Date.now() - 7 * 60000)
        },
        {
          id: '3',
          type: 'subscription',
          message: 'Upgrade para plano Pro',
          user: `Usuário ${Math.random().toString(36).substr(2, 8)}`,
          time: '15 min',
          icon: 'CreditCard',
          color: 'bg-blue-100 text-blue-600',
          timestamp: new Date(Date.now() - 15 * 60000)
        },
        {
          id: '4',
          type: 'analysis',
          message: 'Análise ROI concluída',
          user: `Usuário ${Math.random().toString(36).substr(2, 8)}`,
          time: '22 min',
          icon: 'BarChart3',
          color: 'bg-purple-100 text-purple-600',
          timestamp: new Date(Date.now() - 22 * 60000)
        }
      ];

      return {
        activeUsers,
        todayAnalyses,
        monthlyRevenue,
        conversionRate,
        growthData,
        plansDistribution,
        supportTickets,
        recentActivity,
        trends: {
          userGrowth: Math.round(userGrowth * 10) / 10,
          revenueGrowth: Math.round(revenueGrowth * 10) / 10,
          analysesGrowth: Math.round(analysesGrowth * 10) / 10,
          conversionChange: Math.round((conversionRate - 5.0) * 10) / 10
        }
      };

    } catch (err) {
      console.error('Erro ao buscar dados simulados:', err);
      throw err;
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const simulatedData = await fetchSimulatedData();
      setData(simulatedData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    // Atualizar dados a cada 2 minutos
    const interval = setInterval(loadData, 120000);

    return () => clearInterval(interval);
  }, []);

  return { 
    data, 
    loading, 
    error,
    refresh: loadData 
  };
}; 