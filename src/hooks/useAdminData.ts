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

export const useAdminData = () => {
  const [data, setData] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  const generateRealisticData = (): AdminStats => {
    const currentDate = new Date();
    const baseUsers = 1847;
    const dailyUserGrowth = Math.floor(Math.random() * 25) + 15; // 15-40 novos usuários por dia
    const activeUsers = baseUsers + dailyUserGrowth;

    // Análises variam baseado no dia da semana
    const dayOfWeek = currentDate.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const baseAnalyses = isWeekend ? 180 : 320;
    const todayAnalyses = baseAnalyses + Math.floor(Math.random() * 100) - 50;

    // Receita baseada no crescimento mensal realístico
    const monthlyRevenue = 89400 + (Math.random() * 15000); // R$ 89k - R$ 104k

    // Taxa de conversão realística para SaaS (2-5%)
    const conversionRate = 2.8 + (Math.random() * 1.5);

    // Dados históricos dos últimos 7 meses
    const growthData = [];
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul'];
    let baseUserCount = 850;
    let baseRevenueCount = 28000;
    let baseAnalysesCount = 1200;

    for (let i = 0; i < months.length; i++) {
      // Crescimento orgânico mensal
      const userGrowth = Math.floor(Math.random() * 200) + 150;
      const revenueGrowth = Math.floor(Math.random() * 12000) + 8000;
      const analysesGrowth = Math.floor(Math.random() * 300) + 200;

      baseUserCount += userGrowth;
      baseRevenueCount += revenueGrowth;
      baseAnalysesCount += analysesGrowth;

      growthData.push({
        name: months[i],
        usuarios: baseUserCount,
        receita: baseRevenueCount,
        analises: baseAnalysesCount,
        date: `2024-${(i + 1).toString().padStart(2, '0')}-01`
      });
    }

    // Distribuição realística de planos
    const totalUsers = activeUsers;
    const proUsers = Math.floor(totalUsers * 0.23); // 23% Pro
    const enterpriseUsers = Math.floor(totalUsers * 0.05); // 5% Enterprise
    const freeUsers = totalUsers - proUsers - enterpriseUsers; // 72% Free

    const plansDistribution = [
      { 
        name: 'Gratuito', 
        value: freeUsers, 
        color: '#6B7280', 
        percentage: Math.round((freeUsers / totalUsers) * 100) 
      },
      { 
        name: 'Pro', 
        value: proUsers, 
        color: '#3B82F6', 
        percentage: Math.round((proUsers / totalUsers) * 100) 
      },
      { 
        name: 'Enterprise', 
        value: enterpriseUsers, 
        color: '#8B5CF6', 
        percentage: Math.round((enterpriseUsers / totalUsers) * 100) 
      }
    ];

    // Tickets de suporte realísticos
    const supportTickets = [
      { 
        status: 'Aberto', 
        count: Math.floor(Math.random() * 15) + 8, 
        color: 'bg-red-100 text-red-800',
        trend: Math.random() > 0.5 ? 1 : -1
      },
      { 
        status: 'Em Andamento', 
        count: Math.floor(Math.random() * 12) + 5, 
        color: 'bg-yellow-100 text-yellow-800',
        trend: Math.random() > 0.3 ? 1 : -1
      },
      { 
        status: 'Resolvido', 
        count: Math.floor(Math.random() * 50) + 120, 
        color: 'bg-green-100 text-green-800',
        trend: 1
      }
    ];

    // Atividades recentes mais realísticas
    const activities = [
      { type: 'user_signup', message: 'Novo usuário cadastrado', users: ['Carlos Silva', 'Ana Rodrigues', 'Miguel Santos', 'Beatriz Costa'], icon: 'Users' },
      { type: 'subscription', message: 'Upgrade para plano Pro', users: ['João Ferreira', 'Maria Oliveira', 'Pedro Almeida'], icon: 'CreditCard' },
      { type: 'analysis', message: 'Análise ROI concluída', users: ['Luana Pereira', 'Roberto Lima', 'Carla Nascimento'], icon: 'BarChart3' },
      { type: 'support', message: 'Ticket de suporte aberto', users: ['Fernando Costa', 'Julia Martins'], icon: 'AlertTriangle' },
      { type: 'downgrade', message: 'Cancelamento de assinatura', users: ['Lucas Mendes'], icon: 'TrendingDown' }
    ];

    const recentActivity = [];
    for (let i = 0; i < 8; i++) {
      const activity = activities[Math.floor(Math.random() * activities.length)];
      const user = activity.users[Math.floor(Math.random() * activity.users.length)];
      const minutesAgo = Math.floor(Math.random() * 120) + 5;
      
      let timeText = '';
      if (minutesAgo < 60) {
        timeText = `${minutesAgo} min`;
      } else {
        timeText = `${Math.floor(minutesAgo / 60)}h`;
      }

      const colors = {
        user_signup: 'bg-green-100 text-green-600',
        subscription: 'bg-blue-100 text-blue-600',
        analysis: 'bg-purple-100 text-purple-600',
        support: 'bg-yellow-100 text-yellow-600',
        downgrade: 'bg-red-100 text-red-600'
      };

      recentActivity.push({
        id: (i + 1).toString(),
        type: activity.type,
        message: activity.message,
        user,
        time: timeText,
        icon: activity.icon,
        color: colors[activity.type as keyof typeof colors],
        timestamp: new Date(Date.now() - minutesAgo * 60000)
      });
    }

    // Calcular tendências
    const lastMonth = growthData[growthData.length - 2];
    const currentMonth = growthData[growthData.length - 1];

    const userGrowthPercent = ((currentMonth.usuarios - lastMonth.usuarios) / lastMonth.usuarios) * 100;
    const revenueGrowthPercent = ((currentMonth.receita - lastMonth.receita) / lastMonth.receita) * 100;
    const analysesGrowthPercent = ((currentMonth.analises - lastMonth.analises) / lastMonth.analises) * 100;
    const conversionChange = (Math.random() - 0.5) * 2; // Variação de -1% a +1%

    return {
      activeUsers,
      todayAnalyses,
      monthlyRevenue,
      conversionRate,
      growthData,
      plansDistribution,
      supportTickets,
      recentActivity: recentActivity.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()),
      trends: {
        userGrowth: Math.round(userGrowthPercent * 10) / 10,
        revenueGrowth: Math.round(revenueGrowthPercent * 10) / 10,
        analysesGrowth: Math.round(analysesGrowthPercent * 10) / 10,
        conversionChange: Math.round(conversionChange * 10) / 10
      }
    };
  };

  useEffect(() => {
    const fetchData = () => {
      setLoading(true);
      // Simular delay de API
      setTimeout(() => {
        setData(generateRealisticData());
        setLoading(false);
      }, 1000);
    };

    fetchData();

    // Atualizar dados a cada 2 minutos para simular dados em tempo real
    const interval = setInterval(fetchData, 120000);

    return () => clearInterval(interval);
  }, []);

  return { data, loading, refresh: () => setData(generateRealisticData()) };
}; 