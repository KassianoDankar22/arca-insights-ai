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
import { useAnalysisLimits } from '@/hooks/useAnalysisLimits';
import { useUserPlan } from '@/hooks/useUserPlan';
import { useAdmin } from '@/hooks/useAdmin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Crown, 
  Zap, 
  BarChart3, 
  Calendar,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  ArrowUpRight,
  Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const UsagePage = () => {
  const navigate = useNavigate();
  const { plan } = useUserPlan();
  const { isAdmin } = useAdmin();
  const {
    totalLimit,
    used,
    remaining,
    percentage,
    isUnlimited,
    canCreateAnalysis,
    isLoading,
    resetDate,
    planType
  } = useAnalysisLimits();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Carregando informações de uso...</p>
        </div>
      </div>
    );
  }

  const getPlanIcon = () => {
    if (planType === 'admin') return <Crown className="w-8 h-8 text-yellow-500" />;
    if (planType === 'pro') return <Zap className="w-8 h-8 text-blue-500" />;
    return <BarChart3 className="w-8 h-8 text-gray-500" />;
  };

  const getPlanName = () => {
    if (planType === 'admin') return 'Administrador';
    if (planType === 'pro') return 'Professional';
    return 'Gratuito';
  };

  const getStatusColor = () => {
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 70) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getProgressColor = () => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 70) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  return (
    <div className="p-6 max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Uso e Limites
          </h1>
          <p className="text-gray-600">
            Acompanhe seu uso de análises ROI e informações do seu plano
          </p>
        </div>
        <Button 
          onClick={() => navigate('/analise/tom')}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          disabled={!canCreateAnalysis}
        >
          Nova Análise
        </Button>
      </div>

      {/* Métricas do Plano */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              {getPlanIcon()}
              <div>
                <CardTitle className="text-lg">Plano {getPlanName()}</CardTitle>
                {planType === 'pro' && (
                  <Badge className="mt-1 bg-blue-600 text-white">Ativo</Badge>
                )}
                {planType === 'free' && (
                  <Badge variant="outline" className="mt-1">Gratuito</Badge>
                )}
                {planType === 'admin' && (
                  <Badge className="mt-1 bg-yellow-600 text-white">Admin</Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">
                {isUnlimited ? '∞' : totalLimit}
              </div>
              <div className="text-sm text-gray-600">
                {planType === 'pro' ? 'Análises/mês' : planType === 'free' ? 'Análises totais' : 'Análises'}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Análises Utilizadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{used}</div>
              <div className="text-sm text-gray-600">Utilizadas</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Análises Restantes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className={`text-2xl font-bold ${getStatusColor()}`}>
                {isUnlimited ? '∞' : remaining}
              </div>
              <div className="text-sm text-gray-600">Restantes</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Bar */}
      {!isUnlimited && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Uso Atual</span>
              <span className={`text-sm font-medium ${getStatusColor()}`}>
                {Math.round(percentage)}%
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Progress 
                value={percentage} 
                className="h-3" 
                style={{
                  '--progress-foreground': getProgressColor()
                } as React.CSSProperties}
              />
              
              <div className="flex justify-between text-sm text-gray-600">
                <span>{used} de {totalLimit} análises</span>
                <span className={canCreateAnalysis ? 'text-green-600' : 'text-red-600'}>
                  {canCreateAnalysis ? (
                    <div className="flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      Pode criar análises
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4" />
                      Limite atingido
                    </div>
                  )}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Renovação do Plano */}
      {resetDate && planType === 'pro' && (
        <Card className="mb-8">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-blue-800 text-sm">
              <Calendar className="w-4 h-4" />
              <span>Seu limite renova automaticamente em <strong>{resetDate}</strong></span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Alertas e Ações */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Status Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Status da Conta</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {canCreateAnalysis ? (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <span>Você pode criar novas análises</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="w-5 h-5" />
                <span>Limite de análises atingido</span>
              </div>
            )}

            {percentage >= 80 && percentage < 100 && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-2 text-yellow-800 text-sm">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Você está próximo do limite. Considere fazer upgrade.</span>
                </div>
              </div>
            )}

            {!canCreateAnalysis && planType === 'free' && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="text-red-800 text-sm">
                  <p className="font-medium mb-1">Limite atingido!</p>
                  <p>Faça upgrade para o plano Professional e tenha 20 análises por mês.</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Ações */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              onClick={() => navigate('/meus-rois')}
              variant="outline"
              className="w-full justify-between"
            >
              Ver Minhas Análises
              <ArrowUpRight className="w-4 h-4" />
            </Button>

            {canCreateAnalysis && (
              <Button 
                onClick={() => navigate('/analise/tom')}
                className="w-full justify-between bg-blue-600 hover:bg-blue-700"
              >
                Nova Análise ROI
                <TrendingUp className="w-4 h-4" />
              </Button>
            )}

            {planType === 'free' && (
              <Button 
                onClick={() => navigate('/plans')}
                className="w-full justify-between bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Fazer Upgrade
                <Crown className="w-4 h-4" />
              </Button>
            )}

            <Button 
              onClick={() => navigate('/plans')}
              variant="outline"
              className="w-full justify-between"
            >
              Ver Todos os Planos
              <ArrowUpRight className="w-4 h-4" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Resumo do Plano */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Resumo do Plano</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-gray-600">
            {planType === 'free' && (
              <div>
                <p><strong>Plano Gratuito:</strong> Ideal para começar no mercado imobiliário</p>
                <p>• 5 análises ROI no total (vitalício)</p>
                <p>• Ferramentas básicas de análise</p>
                <p>• Suporte por email</p>
              </div>
            )}

            {planType === 'pro' && (
              <div>
                <p><strong>Plano Professional:</strong> Para corretores e investidores sérios</p>
                <p>• 20 análises ROI por mês</p>
                <p>• Ferramentas avançadas</p>
                <p>• CRM completo</p>
                <p>• Suporte prioritário</p>
                {resetDate && <p>• Próxima renovação: {resetDate}</p>}
              </div>
            )}

            {planType === 'admin' && (
              <div>
                <p><strong>Administrador:</strong> Acesso completo ao sistema</p>
                <p>• Análises ROI ilimitadas</p>
                <p>• Todas as ferramentas disponíveis</p>
                <p>• Acesso ao painel administrativo</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UsagePage; 