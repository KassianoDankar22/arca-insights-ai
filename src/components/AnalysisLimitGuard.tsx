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
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Crown, 
  Zap, 
  TrendingUp, 
  AlertTriangle, 
  Loader2,
  Calendar,
  BarChart3
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

interface AnalysisLimitGuardProps {
  children: React.ReactNode;
  onLimitExceeded?: () => void;
}

const AnalysisLimitGuard: React.FC<AnalysisLimitGuardProps> = ({ 
  children, 
  onLimitExceeded 
}) => {
  const navigate = useNavigate();
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
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Verificando limites...</span>
      </div>
    );
  }

  // Se pode criar análise, renderiza o conteúdo normalmente
  if (canCreateAnalysis) {
    return (
      <div className="space-y-4">
        {/* Barra de status do plano (sempre visível para consciência do usuário) */}
        {planType !== 'admin' && (
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {planType === 'pro' && <Zap className="w-5 h-5 text-blue-500" />}
                  {planType === 'free' && <BarChart3 className="w-5 h-5 text-gray-500" />}
                  
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {planType === 'pro' ? 'Plano Professional' : 'Plano Gratuito'}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {isUnlimited ? 'Ilimitado' : `${used}/${totalLimit}`}
                      </Badge>
                    </div>
                    
                    {planType === 'pro' && resetDate && (
                      <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                        <Calendar className="w-3 h-3" />
                        <span>Renova em {resetDate}</span>
                      </div>
                    )}
                    
                    {planType === 'free' && (
                      <div className="text-xs text-gray-500 mt-1">
                        {remaining} {remaining === 1 ? 'análise restante' : 'análises restantes'}
                      </div>
                    )}
                  </div>
                </div>
                
                {!isUnlimited && (
                  <div className="text-right">
                    <Progress value={percentage} className="w-24 h-2" />
                    <span className="text-xs text-gray-500 mt-1 block">
                      {Math.round(percentage)}%
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
        
        {children}
      </div>
    );
  }

  // Se não pode criar análise, mostra tela de limite excedido
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md mx-auto"
      >
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-orange-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Limite de Análises Atingido
          </h2>
          
          <p className="text-gray-600 mb-6">
            {planType === 'free' ? (
              <>
                Você utilizou todas as <strong>{totalLimit} análises</strong> do seu plano gratuito.
                Para continuar analisando investimentos, faça upgrade para o plano Professional.
              </>
            ) : (
              <>
                Você utilizou todas as <strong>{totalLimit} análises</strong> deste mês.
                {resetDate && (
                  <span className="block mt-2 text-sm">
                    Seu limite será renovado em <strong>{resetDate}</strong>.
                  </span>
                )}
              </>
            )}
          </p>
        </div>

        <div className="space-y-4">
          {planType === 'free' && (
            <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Crown className="w-5 h-5 text-blue-600" />
                  Plano Professional
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-left space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span><strong>20 análises</strong> por mês</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Zap className="w-4 h-4 text-blue-600" />
                    <span>Ferramentas avançadas</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <BarChart3 className="w-4 h-4 text-purple-600" />
                    <span>Relatórios detalhados</span>
                  </div>
                </div>
                
                <Button 
                  onClick={() => navigate('/plans')} 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Fazer Upgrade - R$ 49,90/mês
                </Button>
              </CardContent>
            </Card>
          )}

          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={() => navigate('/meus-rois')}
              className="flex-1"
            >
              Ver Minhas Análises
            </Button>
            
            {planType === 'pro' && (
              <Button 
                variant="outline" 
                onClick={() => navigate('/plans')}
                className="flex-1"
              >
                Ver Planos
              </Button>
            )}
          </div>
        </div>
        
        {planType === 'pro' && resetDate && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 text-blue-800 text-sm">
              <Calendar className="w-4 h-4" />
              <span>
                Suas análises serão renovadas automaticamente em <strong>{resetDate}</strong>
              </span>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AnalysisLimitGuard; 