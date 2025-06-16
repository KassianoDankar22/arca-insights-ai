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

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { useNavigate } from 'react-router-dom';
import { useRealDashboard } from '@/hooks/useRealDashboard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { 
  BarChart3, 
  Calculator, 
  PlusCircle, 
  TrendingUp, 
  DollarSign, 
  Clock, 
  Building2, 
  Users, 
  FileText,
  Star,
  Award,
  ArrowUpRight,
  Calendar,
  Target,
  Zap,
  BookOpen,
  Settings,
  Crown,
  Sparkles,
  Home,
  PieChart,
  TrendingDown,
  Activity,
  Bell,
  Search,
  Filter,
  Download,
  Share2,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  Loader2
} from 'lucide-react';

// Importar o componente do gráfico
import MarketOverviewChart from '@/components/MarketOverviewChart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import MetricCard from '@/components/dashboard/MetricCard';
import MarketOverview from '@/components/dashboard/MarketOverview';
import InvestorTips from '@/components/dashboard/InvestorTips';
import SuggestedProperties from '@/components/dashboard/SuggestedProperties';
import { useCurrencyRate } from '@/hooks/useCurrencyRate';

// Interface para dados do usuário
interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  plan_type?: 'starter' | 'professional' | 'premium';
  analyses_count?: number;
  created_at?: string;
}

// Interface para análises ROI
interface ROIAnalysis {
  id: string;
  condominio: string;
  valor_imovel: number;
  roi_estimado?: number;
  created_at: string;
  status: 'completed' | 'pending' | 'error';
}

// Componente para card de ação rápida modernizado
const QuickActionCard = ({ 
  title, 
  description, 
  icon: Icon, 
  onClick, 
  variant = 'default',
  disabled = false,
  badge,
  isNew = false
}: {
  title: string;
  description: string;
  icon: React.ElementType;
  onClick: () => void;
  variant?: 'default' | 'premium' | 'popular';
  disabled?: boolean;
  badge?: string;
  isNew?: boolean;
}) => {
  const baseClasses = "group relative overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl cursor-pointer border-0 backdrop-blur-sm";
  const variantClasses = {
    default: "bg-gradient-to-br from-white/90 to-blue-50/90 hover:from-white hover:to-blue-100/90 shadow-lg",
    premium: "bg-gradient-to-br from-purple-500/10 to-pink-500/10 hover:from-purple-500/20 hover:to-pink-500/20 border border-purple-200/50 shadow-xl",
    popular: "bg-gradient-to-br from-emerald-500/10 to-teal-500/10 hover:from-emerald-500/20 hover:to-teal-500/20 border border-emerald-200/50 shadow-xl"
  };
  
  return (
    <Card 
      className={`${baseClasses} ${variantClasses[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      onClick={disabled ? undefined : onClick}
    >
      {/* Efeito de brilho */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      
      <CardHeader className="pb-3 relative z-10">
        <div className="flex items-center justify-between">
          <div className={`p-3 rounded-xl shadow-lg ${
            variant === 'premium' ? 'bg-gradient-to-br from-purple-500 to-purple-600' : 
            variant === 'popular' ? 'bg-gradient-to-br from-emerald-500 to-emerald-600' : 
            'bg-gradient-to-br from-blue-500 to-blue-600'
          } text-white group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="h-6 w-6" />
          </div>
          <div className="flex items-center gap-2">
            {isNew && (
              <Badge variant="destructive" className="text-xs animate-pulse">
                Novo
              </Badge>
            )}
            {badge && (
              <Badge variant={variant === 'premium' ? 'secondary' : 'default'} className="text-xs">
                {badge}
              </Badge>
            )}
          </div>
        </div>
        <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-gray-800 transition-colors">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="relative z-10">
        <CardDescription className="text-gray-600 text-sm leading-relaxed mb-4">
          {description}
        </CardDescription>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500 font-medium">Clique para acessar</span>
          <ArrowUpRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
        </div>
      </CardContent>
    </Card>
  );
};

// Componente principal do Dashboard modernizado
const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { stats, loading, error } = useRealDashboard();
  const { currencyData, loading: currencyLoading } = useCurrencyRate();

  // Simulação de dados do usuário por enquanto
  const userProfile = {
    id: user?.id || '',
    email: user?.email || '',
    full_name: user?.user_metadata?.full_name || 'Investidor',
    avatar_url: user?.user_metadata?.avatar_url,
    plan_type: 'starter' as const,
    analyses_count: stats?.totalAnalyses || 0
  };

  // Mostrar erro se houver
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // Navegação para diferentes seções
  const handleNavigation = (path: string) => {
    navigate(path);
  };

  // Ações rápidas do dashboard
  const quickActions = [
    {
      title: 'Nova Análise ROI',
      description: 'Analise o potencial de retorno de um novo investimento imobiliário com IA',
      icon: Calculator,
      onClick: () => handleNavigation('/analise/tom'),
      variant: 'popular' as const,
      badge: 'Popular',
      isNew: false
    },
    {
      title: 'Meus Investimentos',
      description: 'Visualize e gerencie todas as suas análises de ROI e investimentos',
      icon: BarChart3,
      onClick: () => handleNavigation('/meus-rois'),
      variant: 'default' as const
    },
    {
      title: 'Relatórios Avançados',
      description: 'Gere relatórios detalhados e comparativos dos seus investimentos',
      icon: FileText,
      onClick: () => {
        toast.info('Relatórios Avançados chegando em breve!', {
          description: 'Esta funcionalidade está sendo desenvolvida e estará disponível na próxima atualização.'
        });
      },
      variant: 'default' as const,
      badge: 'Em breve'
    },
    {
      title: 'ARCA Academy',
      description: 'Aprenda estratégias avançadas de investimento imobiliário com especialistas',
      icon: BookOpen,
      onClick: () => handleNavigation('/academy'),
      variant: 'premium' as const,
      badge: 'Premium',
      isNew: true
    }
  ];

  // Dicas do investidor
  const investorTips = [
    {
      title: 'Valorização em Lake Nona',
      description: 'Imóveis em Lake Nona valorizaram 12% nos últimos 6 meses, superando a média da região.'
    },
    {
      title: 'ROI em Short Term',
      description: 'O aluguel por temporada em Orlando está rendendo 14% ao ano, considerando ocupação média de 70%.'
    },
    {
      title: 'Crescimento em Winter Garden',
      description: 'Winter Garden está entre os 5 bairros com maior crescimento populacional em 2024.'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-6"></div>
            <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-t-purple-400 animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <p className="text-gray-600 text-lg font-medium">Carregando seu dashboard...</p>
          <p className="text-gray-500 text-sm mt-2">Preparando suas análises e métricas</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-[1200px] mx-auto">
      <div className="flex items-center justify-between mb-8">
                <div>
          <h1 className="text-2xl font-bold text-gray-900">Bom dia, {userProfile?.full_name || 'Investidor'}!</h1>
          <p className="text-gray-600">Bem-vindo(a) à ARCA sua plataforma inteligente de análise imobiliária.</p>
            </div>
            <button 
              onClick={() => handleNavigation('/analise/tom')}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Nova Análise
            </button>
        </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard 
          title="Total de Leads (Prévia)"
          value={loading ? "..." : `${stats?.monthlyLeads || 3}`}
          change={loading ? "" : `+${stats?.monthlyClosedLeads || 2} fechados`}
          icon={
            <svg className="w-6 h-6 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="m22 21-3-3m0 0a2 2 0 0 0-2.83-2.83l-1.25 1.25a2 2 0 0 0 2.83 2.83L19 18Z" />
            </svg>
          }
          iconBgColor="bg-blue-100"
          />
          <MetricCard 
            title="Oportunidades"
          value={loading ? "..." : `${stats?.totalOpportunities || 558}`}
          change={loading ? "" : `+${Math.abs(stats?.opportunityChange || 18500)}`}
          icon={
            <svg className="w-6 h-6 text-cyan-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }
          iconBgColor="bg-cyan-100"
          />
          <MetricCard 
            title="Preço Médio"
          value={loading ? "..." : `R$ ${(stats?.averagePrice || 944193).toLocaleString('pt-BR')}`}
          change={loading ? "" : `${stats?.priceChange >= 0 ? '+ ' : '-'}${Math.abs(stats?.priceChange || 25.8)}%`}
          icon={
            <svg className="w-6 h-6 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9,22 9,12 15,12 15,22" />
            </svg>
          }
          iconBgColor="bg-green-100"
          />
          <MetricCard 
            title="USD/BRL"
          value={currencyLoading ? "..." : `R$ ${currencyData.rate.toFixed(2)}`}
          lastUpdated={currencyLoading ? "" : `Atualizado ${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`}
          icon={
            <svg className="w-6 h-6 text-purple-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          iconBgColor="bg-purple-100"
          />
        </div>

      {/* Detalhes dos Leads */}
      <div className="mb-8">
        <Card className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-xl font-semibold">Performance de Leads</h2>
            <span className="text-sm text-gray-500">Este mês</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Total de Leads */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <span className="text-gray-600">Total de Leads</span>
              </div>
              <p className="text-2xl font-bold">
                {loading ? "..." : stats?.monthlyLeads || 3}
              </p>
              <p className="text-sm text-gray-500">
                Conversão: {stats?.monthlyLeads > 0 ? (((stats?.monthlyClosedLeads || 2) / (stats?.monthlyLeads || 3)) * 100).toFixed(1) : '66.7'}%
              </p>
            </div>

            {/* Leads Fechados */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Users className="h-5 w-5 text-green-600" />
                </div>
                <span className="text-gray-600">Leads Fechados</span>
              </div>
              <p className="text-2xl font-bold">
                {loading ? "..." : stats?.monthlyClosedLeads || 2}
              </p>
              <p className="text-sm text-green-600">
                Meta: 5 leads/mês
              </p>
            </div>

            {/* Receita */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <DollarSign className="h-5 w-5 text-purple-600" />
                </div>
                <span className="text-gray-600">Receita Estimada</span>
              </div>
              <p className="text-2xl font-bold">
                {loading ? "..." : `R$ ${((stats?.monthlyRevenueBRL || 37000)).toLocaleString('pt-BR')}`}
              </p>
              <p className="text-sm text-purple-600">
                Ticket médio: R$ {((stats?.monthlyRevenueBRL || 37000) / (stats?.monthlyClosedLeads || 2)).toLocaleString('pt-BR')}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Visão do Mercado e Imóveis Sugeridos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <MarketOverview />
        </div>
                    <div>
          <InvestorTips tips={investorTips} />
        </div>
      </div>

      {/* Imóveis Sugeridos */}
      <div className="mb-8">
        <SuggestedProperties />
      </div>
    </div>
  );
};

export default Dashboard;
