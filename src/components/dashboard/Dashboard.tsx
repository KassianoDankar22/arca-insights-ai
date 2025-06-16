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

import React from 'react';
import { useMetrics } from '@/hooks/useMetrics';
import MetricCard from './MetricCard';
import { Users, BarChart2, DollarSign, TrendingUp, BookOpen, Tag } from 'lucide-react';

const iconMap = {
  usuarios_ativos: <Users className="w-6 h-6 text-blue-600" />,
  analises_hoje: <BarChart2 className="w-6 h-6 text-green-600" />,
  receita_mensal: <DollarSign className="w-6 h-6 text-purple-600" />,
  taxa_conversao: <TrendingUp className="w-6 h-6 text-orange-600" />,
  total_cursos: <BookOpen className="w-6 h-6 text-indigo-600" />,
  preco_medio_curso: <Tag className="w-6 h-6 text-pink-600" />
};

const bgColorMap = {
  usuarios_ativos: 'bg-blue-100',
  analises_hoje: 'bg-green-100',
  receita_mensal: 'bg-purple-100',
  taxa_conversao: 'bg-orange-100',
  total_cursos: 'bg-indigo-100',
  preco_medio_curso: 'bg-pink-100'
};

const formatValue = (id: string, value: number): string => {
  switch (id) {
    case 'receita_mensal':
    case 'preco_medio_curso':
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(value);
    case 'taxa_conversao':
      return `${value}%`;
    default:
      return value.toLocaleString('en-US');
  }
};

const getChangeColor = (change: string): string => {
  const value = parseFloat(change);
  if (value > 0) return 'text-green-500';
  if (value < 0) return 'text-red-500';
  return 'text-gray-500';
};

export default function Dashboard() {
  const { metrics, loading, error } = useMetrics();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-6">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-500 flex items-center justify-center">
        <span className="bg-red-50 p-4 rounded-lg">
          Erro ao carregar métricas. Por favor, tente novamente.
        </span>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard Administrativo</h1>
        <p className="text-sm text-gray-500">
          Última atualização: {new Date().toLocaleTimeString('pt-BR')}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((metric) => (
          <MetricCard
            key={metric.id}
            title={metric.title}
            value={formatValue(metric.id, metric.value)}
            change={metric.change}
            icon={iconMap[metric.id as keyof typeof iconMap]}
            iconBgColor={bgColorMap[metric.id as keyof typeof bgColorMap]}
            lastUpdated={metric.lastUpdated}
            changeColor={getChangeColor(metric.change)}
          />
        ))}
      </div>
    </div>
  );
} 