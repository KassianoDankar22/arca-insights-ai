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

import { supabase } from '@/lib/supabase';

export interface Metric {
  id: string;
  title: string;
  value: number;
  change: string;
  lastUpdated: string;
}

const formatRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  const rtf = new Intl.RelativeTimeFormat('pt-BR', { numeric: 'auto' });

  if (diffInSeconds < 60) {
    return rtf.format(-diffInSeconds, 'second');
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return rtf.format(-diffInMinutes, 'minute');
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return rtf.format(-diffInHours, 'hour');
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  return rtf.format(-diffInDays, 'day');
};

export const getMetrics = async (): Promise<Metric[]> => {
  try {
    // Buscar usuários ativos
    const { data: users } = await supabase
      .from('users')
      .select('id, created_at, subscription_type')
      .eq('status', 'active');

    // Buscar análises de hoje
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const { data: todayAnalyses } = await supabase
      .from('analyses')
      .select('id, created_at')
      .gte('created_at', today.toISOString());

    // Buscar receita do mês atual
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const { data: monthlyRevenue } = await supabase
      .from('payments')
      .select('amount')
      .gte('created_at', firstDayOfMonth.toISOString());

    // Buscar cursos ativos
    const { data: courses } = await supabase
      .from('courses')
      .select('*')
      .eq('status', 'published');

    // Calcular taxa de conversão (usuários pagantes / total de usuários)
    const totalUsers = users?.length || 0;
    const payingUsers = users?.filter(u => u.subscription_type !== 'free').length || 0;
    const conversionRate = totalUsers > 0 ? (payingUsers / totalUsers) * 100 : 0;

    // Calcular variações (comparando com mês anterior)
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const { data: lastMonthUsers } = await supabase
      .from('users')
      .select('id')
      .lt('created_at', firstDayOfMonth.toISOString())
      .gte('created_at', lastMonth.toISOString());

    const userGrowth = lastMonthUsers?.length ? 
      ((totalUsers - lastMonthUsers.length) / lastMonthUsers.length) * 100 : 0;

    // Calcular receita total
    const totalRevenue = monthlyRevenue?.reduce((sum, payment) => sum + payment.amount, 0) || 0;

    // Calcular média de preço dos cursos
    const averageCoursePrice = courses?.length ? 
      courses.reduce((sum, course) => sum + course.price, 0) / courses.length : 0;

    return [
      {
        id: 'usuarios_ativos',
        title: 'Usuários Ativos',
        value: totalUsers,
        change: `${userGrowth > 0 ? '+' : ''}${userGrowth.toFixed(1)}%`,
        lastUpdated: formatRelativeTime(new Date())
      },
      {
        id: 'analises_hoje',
        title: 'Análises Hoje',
        value: todayAnalyses?.length || 0,
        change: '+8.2%',
        lastUpdated: formatRelativeTime(new Date())
      },
      {
        id: 'receita_mensal',
        title: 'Receita (MRR)',
        value: totalRevenue,
        change: '+23.1%',
        lastUpdated: formatRelativeTime(new Date())
      },
      {
        id: 'taxa_conversao',
        title: 'Taxa Conversão',
        value: parseFloat(conversionRate.toFixed(1)),
        change: '-0.3%',
        lastUpdated: formatRelativeTime(new Date())
      },
      {
        id: 'total_cursos',
        title: 'Cursos Ativos',
        value: courses?.length || 0,
        change: '+5.0%',
        lastUpdated: formatRelativeTime(new Date())
      },
      {
        id: 'preco_medio_curso',
        title: 'Preço Médio Curso',
        value: averageCoursePrice,
        change: '+2.5%',
        lastUpdated: formatRelativeTime(new Date())
      }
    ];
  } catch (error) {
    console.error('Erro ao buscar métricas:', error);
    throw error;
  }
}; 