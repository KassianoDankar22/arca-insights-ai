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
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Target, Star, Lightbulb, Award, Zap, Loader2, DollarSign } from 'lucide-react';
import { useMarketData } from '@/hooks/useMarketData';

interface Tip {
  title: string;
  description: string;
}

interface InvestorTip {
  id: string;
  title: string;
  description: string;
  category: 'financing' | 'location' | 'timing' | 'strategy';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimated_savings: number;
  time_to_implement: string;
  created_at: string;
}

interface InvestorTipsProps {
  tips?: Tip[]; // Manter compatibilidade com props antigas
}

export default function InvestorTips({ tips: propTips }: InvestorTipsProps) {
  const { 
    investorTips, 
    loading, 
    error, 
    getTopTips 
  } = useMarketData();

  // Usar dados reais do hook ou fallback para props
  const realTips = investorTips.length > 0 ? getTopTips(3) : [];
  const fallbackTips = propTips || [];

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-2" />
            <p className="text-gray-600">Carregando dicas...</p>
          </div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center py-8">
          <p className="text-red-600 mb-2">Erro ao carregar dicas</p>
          <p className="text-sm text-gray-500">{error}</p>
        </div>
      </Card>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600';
      case 'intermediate': return 'text-yellow-600';
      case 'advanced': return 'text-red-600';
      default: return 'text-blue-600';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'financing': return DollarSign;
      case 'location': return Target;
      case 'timing': return Star;
      case 'strategy': return TrendingUp;
      default: return Lightbulb;
    }
  };

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
          Dicas do Investidor
          {realTips.length > 0 && (
            <Badge variant="outline" className="text-green-600 border-green-600">
              Dados Reais
            </Badge>
          )}
        </h2>
        <p className="text-sm text-gray-600">Insights personalizados baseados em dados de mercado</p>
      </div>

      {/* Insights Personalizados */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-600 mb-4">Recomendações Exclusivas</h3>
        <div className="space-y-4">
          {realTips.length > 0 ? (
            // Renderizar dicas reais do Supabase
            realTips.map((tip: InvestorTip, index) => {
              const IconComponent = getCategoryIcon(tip.category);
              const colorClass = index === 0 ? 'blue' : index === 1 ? 'green' : 'purple';
              
              return (
                <div key={tip.id} className={`p-4 rounded-lg bg-${colorClass}-50 border-l-4 border-${colorClass}-400`}>
                  <div className="flex items-start gap-3">
                    <div className={`p-1 rounded text-${colorClass}-600`}>
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className={`text-sm font-medium text-${colorClass}-700`}>
                          {tip.title}
                        </p>
                        <Badge variant="outline" className={`text-xs ${getDifficultyColor(tip.difficulty)}`}>
                          {tip.difficulty}
                        </Badge>
                      </div>
                      <p className={`text-sm mt-1 text-${colorClass}-600`}>
                        {tip.description}
                      </p>
                      <div className="mt-2 flex items-center gap-4 text-xs">
                        <span className={`text-${colorClass}-500`}>
                          <DollarSign className="inline w-4 h-4 mr-1" /> Economia: {formatCurrency(tip.estimated_savings)}
                        </span>
                        <span className={`text-${colorClass}-500`}>
                          ⏱️ Tempo: {tip.time_to_implement}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            // Renderizar dicas de fallback
            fallbackTips.map((tip: Tip, index) => (
              <div key={index} className={`p-4 rounded-lg ${
                index === 0 ? 'bg-blue-50 border-l-4 border-blue-400' :
                index === 1 ? 'bg-green-50 border-l-4 border-green-400' :
                'bg-purple-50 border-l-4 border-purple-400'
              }`}>
                <div className="flex items-start gap-3">
                  <div className={`p-1 rounded ${
                    index === 0 ? 'text-blue-600' :
                    index === 1 ? 'text-green-600' :
                    'text-purple-600'
                  }`}>
                    {index === 0 && <Target className="h-5 w-5" />}
                    {index === 1 && <TrendingUp className="h-5 w-5" />}
                    {index === 2 && <Star className="h-5 w-5" />}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${
                      index === 0 ? 'text-blue-700' :
                      index === 1 ? 'text-green-700' :
                      'text-purple-700'
                    }`}>{tip.title}</p>
                    <p className={`text-sm mt-1 ${
                      index === 0 ? 'text-blue-600' :
                      index === 1 ? 'text-green-600' :
                      'text-purple-600'
                    }`}>{tip.description}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Dicas Rápidas Adicionais */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-600 mb-3">Dicas Rápidas</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="p-1 rounded text-amber-600">
              <Lightbulb className="h-4 w-4" />
            </div>
            <p className="text-sm text-gray-700">Diversifique em diferentes regiões para reduzir riscos</p>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="p-1 rounded text-emerald-600">
              <Award className="h-4 w-4" />
            </div>
            <p className="text-sm text-gray-700">Considere propriedades próximas a universidades</p>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="p-1 rounded text-indigo-600">
              <Zap className="h-4 w-4" />
            </div>
            <p className="text-sm text-gray-700">Mercado de aluguel por temporada em alta em 2025</p>
          </div>
        </div>
      </div>

      {/* Footer com link */}
      <div className="border-t pt-4">
        <a href="#" className="text-cyan-500 text-sm hover:underline block">
          Ver todas as dicas →
        </a>
      </div>
      </Card>
  );
}
