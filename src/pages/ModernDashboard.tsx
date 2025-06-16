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
import { supabase } from '@/integrations/supabase/client';
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
  FileText,
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
  TrendingDown,
  Activity,
  Bell,
  Search,
  Filter,
  Eye,
  Edit,
  Share2,
  MoreHorizontal,
  Hand
} from 'lucide-react';
import { useIsMobile } from '@/hooks/useIsMobile';

// Interfaces
interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  plan_type?: 'starter' | 'professional' | 'premium';
  analyses_count?: number;
  created_at?: string;
}

interface ROIAnalysis {
  id: string;
  condominio: string;
  valor_imovel: number;
  roi_estimado?: number;
  created_at: string;
  status: 'completed' | 'pending' | 'error';
}

// Componente para card de ação rápida
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

// Componente para métricas
const MetricCard = ({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  color = 'blue',
  trend = 'up'
}: {
  title: string;
  value: string | number;
  change?: string;
  icon: React.ElementType;
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
  trend?: 'up' | 'down' | 'neutral';
}) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600 text-blue-50',
    green: 'from-emerald-500 to-emerald-600 text-emerald-50',
    purple: 'from-purple-500 to-purple-600 text-purple-50',
    orange: 'from-orange-500 to-orange-600 text-orange-50',
    red: 'from-red-500 to-red-600 text-red-50'
  };

  const trendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Activity;
  const trendColor = trend === 'up' ? 'text-emerald-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600';

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-gray-600 text-sm font-medium mb-1">{title}</p>
            <p className="text-3xl font-bold text-gray-900 mb-2 group-hover:scale-105 transition-transform duration-300">{value}</p>
            {change && (
              <div className="flex items-center gap-1">
                {React.createElement(trendIcon, { className: `h-4 w-4 ${trendColor}` })}
                <p className={`text-sm font-medium ${trendColor}`}>{change}</p>
              </div>
            )}
          </div>
          <div className={`p-4 rounded-2xl bg-gradient-to-br ${colorClasses[color]} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="h-7 w-7" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Componente principal
const ModernDashboard: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  
  // Limpar nome do condomínio removendo números no final (bug fix)
  const cleanProjectName = (name: string): string => {
    if (!name) return name;
    // Remove números que apareceram no final por engano (ex: "Solara Resort6" -> "Solara Resort")
    return name.replace(/\d+$/, '').trim();
  };

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [recentAnalyses, setRecentAnalyses] = useState<ROIAnalysis[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [analysesCount, setAnalysesCount] = useState(0);

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user) return;

      setIsLoading(true);
      try {
        setUserProfile({
          id: user.id,
          email: user.email || '',
          full_name: user.user_metadata?.full_name || 'Investidor',
          plan_type: 'starter',
          analyses_count: 0
        });

        const { data: analyses, error: analysesError } = await supabase
          .from('roi_analises')
          .select('id, condominio, valor_imovel, data_criacao')
          .eq('usuario_id', user.id)
          .order('data_criacao', { ascending: false })
          .limit(5);

        if (analysesError) {
          console.error('Erro ao carregar análises:', analysesError);
        } else {
          const formattedAnalyses = (analyses || []).map(analysis => ({
            id: analysis.id,
            condominio: analysis.condominio,
            valor_imovel: analysis.valor_imovel,
            roi_estimado: 12.5,
            created_at: analysis.data_criacao,
            status: 'completed' as const
          }));
          setRecentAnalyses(formattedAnalyses);
          setAnalysesCount(formattedAnalyses.length);
        }

      } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error);
        toast.error('Erro ao carregar dados do dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [user]);

  const handleNavigation = (path: string) => {
    navigate(path);
  };

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

  if (isLoading) {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                  <Building2 className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    ARCA Insights
                  </h1>
                  <p className="text-xs text-gray-500 font-medium">Inteligência em Investimentos</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full animate-pulse"></span>
              </Button>
              
              <Badge variant="secondary" className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border-0 px-3 py-1">
                {userProfile?.plan_type === 'starter' ? 'Plano Starter' : 
                 userProfile?.plan_type === 'professional' ? 'Plano Professional' : 
                 userProfile?.plan_type === 'premium' ? 'Plano Premium' : 'Starter'}
              </Badge>
              
              <Avatar className="h-10 w-10 ring-2 ring-blue-200 ring-offset-2">
                <AvatarImage src={userProfile?.avatar_url} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-semibold">
                  {userProfile?.full_name?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => handleNavigation('/settings')}
                className="hover:bg-gray-100"
              >
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Saudação */}
        <div className="mb-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-3">
                Olá, {userProfile?.full_name || 'Investidor'}! 
                <span className="inline-block ml-2 animate-bounce"><Hand className="inline w-4 h-4" /></span>
              </h2>
              <p className="text-gray-600 text-xl">
                Bem-vindo ao seu painel de controle de investimentos imobiliários
              </p>
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="h-4 w-4" />
                  {new Date().toLocaleDateString('pt-BR', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
                <div className="flex items-center gap-2 text-sm text-emerald-600">
                  <Activity className="h-4 w-4" />
                  Sistema operacional
                </div>
              </div>
            </div>
            <button 
              onClick={() => handleNavigation('/tom-roi')}
              className="shadow-[0_4px_14px_0_rgb(0,118,255,39%)] hover:shadow-[0_6px_20px_rgba(0,118,255,23%)] hover:bg-[rgba(0,118,255,0.9)] px-8 py-3 bg-[#0070f3] rounded-md text-white font-light transition duration-200 ease-linear flex items-center"
            >
              <PlusCircle className="h-5 w-5 mr-2" />
              Nova Análise
            </button>
          </div>
        </div>

        {/* Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <MetricCard 
            title="Análises Realizadas"
            value={analysesCount}
            change="+3 esta semana"
            icon={BarChart3}
            color="blue"
            trend="up"
          />
          <MetricCard 
            title="ROI Médio"
            value="12.4%"
            change="+2.1% este mês"
            icon={TrendingUp}
            color="green"
            trend="up"
          />
          <MetricCard 
            title="Valor Analisado"
            value="$2.1M"
            change="+15% este mês"
            icon={DollarSign}
            color="purple"
            trend="up"
          />
          <MetricCard 
            title="Tempo Economizado"
            value="48h"
            change="vs análise manual"
            icon={Clock}
            color="orange"
            trend="neutral"
          />
        </div>

        {/* Ações Rápidas */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900 flex items-center">
              <Zap className="h-6 w-6 mr-3 text-blue-600" />
              Ações Rápidas
            </h3>
            <Button variant="outline" size="sm" className="text-gray-600">
              <Eye className="h-4 w-4 mr-2" />
              Ver todas
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <QuickActionCard 
                key={index}
                {...action}
              />
            ))}
          </div>
        </div>

        {/* Análises Recentes e Dicas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-0">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center text-xl">
                    <Clock className="h-6 w-6 mr-3 text-blue-600" />
                    Análises Recentes
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Search className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Filter className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {recentAnalyses.length > 0 ? (
                  <div className="space-y-4">
                    {recentAnalyses.map((analysis) => (
                      <div 
                        key={analysis.id} 
                        className="group flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-blue-50/50 rounded-xl hover:from-blue-50 hover:to-purple-50 transition-all duration-300 cursor-pointer border border-gray-100 hover:border-blue-200 hover:shadow-md"
                        onClick={() => handleNavigation('/meus-rois')}
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg text-white shadow-lg">
                            <Home className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                              {cleanProjectName(analysis.condominio)}
                            </p>
                            <p className="text-sm text-gray-600">
                              {new Date(analysis.created_at).toLocaleDateString('pt-BR')} • 
                              <span className="ml-1 text-emerald-600 font-medium">
                                ROI: {analysis.roi_estimado}%
                              </span>
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <p className="font-bold text-lg text-gray-900">
                              ${analysis.valor_imovel?.toLocaleString()}
                            </p>
                            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                              Concluída
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Share2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl inline-block mb-6">
                      <Calculator className="h-16 w-16 text-blue-400 mx-auto" />
                    </div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">Nenhuma análise realizada ainda</h4>
                    <p className="text-gray-600 mb-6">Comece sua jornada de investimentos criando sua primeira análise ROI</p>
                    <button 
                      onClick={() => handleNavigation('/tom-roi')}
                      className="shadow-[0_4px_14px_0_rgb(0,118,255,39%)] hover:shadow-[0_6px_20px_rgba(0,118,255,23%)] hover:bg-[rgba(0,118,255,0.9)] px-6 py-3 bg-[#0070f3] rounded-md text-white font-light transition duration-200 ease-linear flex items-center"
                    >
                      <PlusCircle className="h-5 w-5 mr-2" />
                      Fazer primeira análise
                    </button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center text-gray-900">
                  <Sparkles className="h-6 w-6 mr-3 text-blue-600" />
                  Dicas de Investimento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-3 h-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full mt-2 shadow-sm"></div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800 mb-1">ROI Excelente</p>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        ROIs acima de 12% são considerados excelentes no mercado atual da Flórida
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-3 h-3 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full mt-2 shadow-sm"></div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800 mb-1">Diversificação</p>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        Diversifique seus investimentos entre diferentes localidades e tipos de propriedade
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-3 h-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full mt-2 shadow-sm"></div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800 mb-1">Sazonalidade</p>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        Considere a sazonalidade ao calcular ocupação em propriedades de temporada
                      </p>
                    </div>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full mt-6 bg-white/70 hover:bg-white border-white/50 hover:border-white shadow-sm"
                  onClick={() => handleNavigation('/academy')}
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Ver mais na Academy
                </Button>
              </CardContent>
            </Card>

            <Card className="mt-6 bg-white/90 backdrop-blur-sm shadow-lg border-0">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Target className="h-5 w-5 mr-2 text-blue-600" />
                  Progresso do Plano
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Análises utilizadas</span>
                      <span className="font-medium">{analysesCount}/10</span>
                    </div>
                    <Progress value={(analysesCount / 10) * 100} className="h-2" />
                  </div>
                  <p className="text-xs text-gray-500">
                    Você tem {10 - analysesCount} análises restantes no seu plano Starter
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Call to Action para Upgrade */}
        {userProfile?.plan_type === 'starter' && (
          <Card className="mt-10 bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 text-white border-0 shadow-2xl overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-500/20 backdrop-blur-3xl"></div>
            <CardContent className="p-8 relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <Crown className="h-8 w-8 text-yellow-300" />
                    <h3 className="text-2xl font-bold">
                      Desbloqueie todo o potencial da ARCA Insights
                    </h3>
                  </div>
                  <p className="text-purple-100 mb-6 text-lg leading-relaxed">
                    Faça upgrade para Premium e tenha acesso a análises ilimitadas, relatórios avançados, 
                    consultoria especializada e muito mais.
                  </p>
                  <div className="flex items-center gap-4">
                    <Button 
                      variant="secondary" 
                      className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                      onClick={() => handleNavigation('/pricing')}
                    >
                      <Crown className="h-5 w-5 mr-2" />
                      Fazer Upgrade
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="text-white hover:bg-white/10 px-6 py-3 rounded-xl"
                      onClick={() => handleNavigation('/pricing')}
                    >
                      Ver Planos
                    </Button>
                  </div>
                </div>
                <div className="hidden lg:block">
                  <Award className="h-24 w-24 text-purple-200/50" />
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ModernDashboard; 