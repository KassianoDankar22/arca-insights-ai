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
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  BarChart3,
  TrendingUp,
  Calculator,
  Users,
  FileText,
  ArrowRight,
  Zap,
  Target,
  DollarSign,
  Shield
} from 'lucide-react';
import AdminTestControls from '@/components/admin/AdminTestControls';
import { useAdmin } from '@/hooks/useAdmin';

const HomePage: React.FC = () => {
  const { isAdmin } = useAdmin();
  
  const features = [
    {
      icon: Calculator,
      title: 'Calculadora de ROI',
      description: 'Calcule o retorno sobre investimento de seus imóveis',
      link: '/calculadora-roi',
      color: 'bg-blue-500'
    },
    {
      icon: BarChart3,
      title: 'Análise TOM',
      description: 'Análise completa do Time on Market',
      link: '/analise/tom',
      color: 'bg-purple-500'
    },
    {
      icon: FileText,
      title: 'Meus ROIs',
      description: 'Visualize e gerencie suas análises salvas',
      link: '/meus-rois',
      color: 'bg-green-500'
    },
    {
      icon: Users,
      title: 'CRM',
      description: 'Gerencie seus leads e relacionamentos',
      link: '/crm',
      color: 'bg-orange-500'
    }
  ];

  const stats = [
    { label: 'Análises Realizadas', value: '12,847', icon: BarChart3 },
    { label: 'Usuários Ativos', value: '2,847', icon: Users },
    { label: 'ROI Médio', value: '8.5%', icon: TrendingUp },
    { label: 'Economia Gerada', value: 'R$ 2.8M', icon: DollarSign }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center mb-4">
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 px-3 py-1">
              <Zap className="w-4 h-4 mr-1" />
              Powered by AI
            </Badge>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Arca <span className="text-blue-600">Insights</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Plataforma completa de análise de investimentos imobiliários com inteligência artificial.
            Calcule ROI, analise mercado e tome decisões mais inteligentes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/calculadora-roi">
              <Button size="lg" className="bg-arca-main hover:bg-arca-dark text-white px-8">
                <Calculator className="w-5 h-5 mr-2" />
                Começar Agora
              </Button>
            </Link>
            <Link to="/analise/tom">
              <Button size="lg" variant="outline" className="px-8">
                <Target className="w-5 h-5 mr-2" />
                Análise TOM
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center">
              <CardContent className="p-6">
                <stat.icon className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.map((feature, index) => (
            <Link key={index} to={feature.link}>
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
                <CardHeader>
                  <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{feature.description}</p>
                  <div className="flex items-center text-blue-600 group-hover:translate-x-1 transition-transform">
                    <span className="text-sm font-medium">Acessar</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Admin Access Section */}
        {isAdmin && (
          <div className="mb-12">
            <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
              <CardHeader>
                <CardTitle className="text-center flex items-center justify-center">
                  <Shield className="w-6 h-6 mr-2 text-purple-600" />
                  Acesso Administrativo
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-4">
                  Você tem acesso ao painel administrativo
                </p>
                <Link to="/admin">
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    <Shield className="w-4 h-4 mr-2" />
                    Acessar Painel Admin
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Development Admin Controls */}
        <div className="mb-12">
          <AdminTestControls />
        </div>

        {/* About Section */}
        <Card className="bg-white/50 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Por que escolher o Arca Insights?
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Precisão</h3>
                <p className="text-gray-600 text-sm">
                  Algoritmos avançados para análises precisas de ROI e mercado imobiliário
                </p>
              </div>
              <div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Rapidez</h3>
                <p className="text-gray-600 text-sm">
                  Resultados em segundos com interface intuitiva e moderna
                </p>
              </div>
              <div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Insights</h3>
                <p className="text-gray-600 text-sm">
                  Relatórios detalhados e insights acionáveis para seus investimentos
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HomePage;
