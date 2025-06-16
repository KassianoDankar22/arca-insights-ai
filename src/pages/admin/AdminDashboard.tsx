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
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  BarChart3, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  CreditCard,
  FileText,
  ArrowUpRight,
  Calendar,
  Eye,
  Download,
  Settings,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { useAdmin } from '@/hooks/useAdmin';
import { useRealAdminData } from '@/hooks/useRealAdminData';

const AdminDashboard = () => {
  const { canAccess } = useAdmin();
  const { data, loading, error, refresh } = useRealAdminData();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value: number) => {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}k`;
    }
    return value.toString();
  };

  if (error) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <Card className="p-8 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Erro ao carregar dados</h2>
          <p className="text-gray-600 mb-4">
            Não foi possível carregar os dados do dashboard: {error}
          </p>
          <Button onClick={refresh} className="mx-auto">
            <RefreshCw className="w-4 h-4 mr-2" />
            Tentar Novamente
          </Button>
        </Card>
      </div>
    );
  }

  if (loading || !data) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-96 bg-gray-200 rounded"></div>
              <div className="h-96 bg-gray-200 rounded"></div>
            </div>
            <div className="space-y-6">
              <div className="h-80 bg-gray-200 rounded"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: 'Usuários Ativos',
      value: formatNumber(data.activeUsers),
      change: `${data.trends.userGrowth >= 0 ? '+' : ''}${data.trends.userGrowth}%`,
      trend: data.trends.userGrowth > 0 ? 'up' : 'down',
      icon: Users,
      color: 'blue',
      permission: 'users'
    },
    {
      title: 'Análises Hoje',
      value: data.todayAnalyses.toString(),
      change: `${data.trends.analysesGrowth >= 0 ? '+' : ''}${data.trends.analysesGrowth}%`,
      trend: data.trends.analysesGrowth > 0 ? 'up' : 'down',
      icon: BarChart3,
      color: 'green',
      permission: 'analytics'
    },
    {
      title: 'Receita (MRR)',
      value: formatCurrency(data.monthlyRevenue),
      change: `${data.trends.revenueGrowth >= 0 ? '+' : ''}${data.trends.revenueGrowth}%`,
      trend: data.trends.revenueGrowth > 0 ? 'up' : 'down',
      icon: DollarSign,
      color: 'purple',
      permission: 'subscriptions'
    },
    {
      title: 'Taxa Conversão',
      value: `${data.conversionRate.toFixed(1)}%`,
      change: `${data.trends.conversionChange >= 0 ? '+' : ''}${data.trends.conversionChange}%`,
      trend: data.trends.conversionChange > 0 ? 'up' : 'down',
      icon: TrendingUp,
      color: 'orange',
      permission: 'analytics'
    }
  ];

  const getIconComponent = (iconName: string) => {
    const icons: { [key: string]: React.ElementType } = {
      Users,
      CreditCard,
      BarChart3,
      AlertTriangle,
      TrendingDown,
      CheckCircle
    };
    return icons[iconName] || Activity;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Administrativo</h1>
          <p className="text-gray-600 mt-1">
            Visão geral completa do sistema Arca AI
          </p>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-500">Dados reais do Supabase</span>
          </div>
        </div>
        <div className="mt-4 lg:mt-0 flex items-center gap-3">
          <Button variant="outline" onClick={refresh}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Atualizar
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exportar Dados
          </Button>
          <Button variant="arca">
            <Settings className="w-4 h-4 mr-2" />
            Configurações
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          if (!canAccess(stat.permission)) return null;
          
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-2">
                        {stat.title}
                      </p>
                      <p className="text-3xl font-bold text-gray-900">
                        {stat.value}
                      </p>
                      <div className="flex items-center mt-2">
                        {stat.trend === 'up' ? (
                          <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                        )}
                        <span className={`text-sm font-medium ${
                          stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {stat.change}
                        </span>
                      </div>
                    </div>
                    <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                      <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Charts Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Growth Chart */}
          {canAccess('analytics') && (
            <Card>
              <CardHeader>
                <CardTitle>Crescimento dos Usuários</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data.growthData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => [formatNumber(value as number), 'Usuários']} />
                      <Line 
                        type="monotone" 
                        dataKey="usuarios" 
                        stroke="#3B82F6" 
                        strokeWidth={3}
                        dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Revenue Chart */}
          {canAccess('subscriptions') && (
            <Card>
              <CardHeader>
                <CardTitle>Receita Mensal (R$)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.growthData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`R$ ${(value as number).toLocaleString()}`, 'Receita']} />
                      <Bar dataKey="receita" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Plans Distribution */}
          {canAccess('subscriptions') && (
            <Card>
              <CardHeader>
                <CardTitle>Distribuição de Planos</CardTitle>
              </CardHeader>
              <CardContent>
                {data.activeUsers > 0 ? (
                  <>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                            data={data.plansDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                            {data.plansDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                          <Tooltip formatter={(value) => [value, 'Usuários']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2 mt-4">
                      {data.plansDistribution.map((plan) => (
                    <div key={plan.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: plan.color }}
                        />
                        <span>{plan.name}</span>
                      </div>
                          <div className="text-right">
                      <span className="font-medium">{plan.value}</span>
                            <span className="text-gray-500 ml-1">({plan.percentage}%)</span>
                          </div>
                    </div>
                  ))}
                </div>
                  </>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Nenhum usuário encontrado</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Support Tickets */}
          {canAccess('support') && (
            <Card>
              <CardHeader>
                <CardTitle>Tickets de Suporte</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.supportTickets.map((ticket) => (
                    <div key={ticket.status} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge className={`${ticket.color} border-0`}>
                          {ticket.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-gray-900">
                        {ticket.count}
                      </span>
                        {ticket.trend > 0 ? (
                          <TrendingUp className="w-4 h-4 text-green-500" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  <Eye className="w-4 h-4 mr-2" />
                  Ver Todos
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Atividade Recente</CardTitle>
        </CardHeader>
        <CardContent>
          {data.recentActivity.length > 0 ? (
          <div className="space-y-4">
              {data.recentActivity.map((activity) => {
                const IconComponent = getIconComponent(activity.icon);
                return (
              <div key={activity.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className={`p-2 rounded-full ${activity.color}`}>
                      <IconComponent className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.message}
                  </p>
                  <p className="text-xs text-gray-500">
                    {activity.user} • {activity.time} atrás
                  </p>
                </div>
                <Button variant="ghost" size="sm">
                  <ArrowUpRight className="w-4 h-4" />
                </Button>
              </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Activity className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Nenhuma atividade recente</p>
          </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard; 