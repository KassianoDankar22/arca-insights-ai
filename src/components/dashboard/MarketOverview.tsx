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
import { TrendingUp, TrendingDown, Activity, Loader2 } from 'lucide-react';
import { useMarketData } from '@/hooks/useMarketData';

interface MetricProps {
  label: string;
  value: string;
  change: string;
  trend?: 'up' | 'down' | 'neutral';
}

interface MarketOverviewProps {
  // Não precisamos mais de props, pois os dados vêm do hook
}

const Metric = ({ label, value, change, trend = 'up' }: MetricProps) => {
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Activity;
  const trendColor = trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-gray-500';
  
  return (
  <div>
    <p className="text-sm text-gray-600">{label}</p>
      <div className="flex items-center gap-2">
    <p className="text-2xl font-semibold">{value}</p>
        <TrendIcon className={`h-5 w-5 ${trendColor}`} />
      </div>
      <p className={`text-xs ${trendColor}`}>{change}</p>
    </div>
  );
};

export default function MarketOverview(props: MarketOverviewProps) {
  const { 
    marketTrends, 
    marketInsights, 
    marketStats, 
    loading, 
    error,
    getTrendsByCategory,
    getInsightsByType
  } = useMarketData();

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-2" />
            <p className="text-gray-600">Carregando dados do mercado...</p>
    </div>
  </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center py-8">
          <p className="text-red-600 mb-2">Erro ao carregar dados do mercado</p>
          <p className="text-sm text-gray-500">{error}</p>
        </div>
      </Card>
    );
  }

  // Obter tendências por categoria
  const growthTrends = getTrendsByCategory('growth');
  const stableTrends = getTrendsByCategory('stable');
  const declineTrends = getTrendsByCategory('decline');

  // Obter insights por tipo
  const opportunities = getInsightsByType('opportunity');
  const risks = getInsightsByType('risk');
  const trends = getInsightsByType('trend');

  return (
    <Card className="p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            Insights do Mercado
            <Badge variant="outline" className="text-green-600 border-green-600">
              Dados Reais
            </Badge>
          </h2>
          <div className="grid grid-cols-1 gap-6">
            <Metric 
              label="Propriedades Analisadas" 
              value={marketStats?.propertiesAnalyzed.toString() || '0'} 
              change={`+${marketStats?.avgRoiImprovement || 0}% ROI médio`}
              trend="up"
            />
            <Metric 
              label="Estabilidade do Mercado" 
              value={`${marketStats?.marketStability || 0}%`} 
              change="Condições favoráveis"
              trend="up"
            />
            <Metric 
              label="Oportunidades Ativas" 
              value={marketStats?.investmentOpportunities.toString() || '0'} 
              change="Novas oportunidades identificadas"
              trend="up"
            />
          </div>
        </div>
      </div>

      {/* Tendências de Mercado */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-600 mb-2">Tendências de Mercado</h3>
        <div className="space-y-4">
          {/* Oportunidades em Alta */}
          {growthTrends.length > 0 && (
            <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
              <div className="flex items-start gap-3">
                <div className="p-1 rounded text-green-600">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-700">Oportunidades em Alta</p>
                  {growthTrends.map((trend) => (
                    <div key={trend.id} className="mt-1">
                      <p className="text-sm text-green-600">• {trend.title}</p>
                      <p className="text-xs text-green-500">{trend.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Riscos ou Segmentos em Baixa */}
          {(risks.length > 0 || declineTrends.length > 0) && (
            <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-400">
              <div className="flex items-start gap-3">
                <div className="p-1 rounded text-red-600">
                  <TrendingDown className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-700">Pontos de Atenção</p>
                  {risks.map((risk) => (
                    <div key={risk.id} className="mt-1">
                      <p className="text-sm text-red-600">• {risk.title}</p>
                      <p className="text-xs text-red-500">{risk.description}</p>
                    </div>
                  ))}
                  {declineTrends.map((trend) => (
                    <div key={trend.id} className="mt-1">
                      <p className="text-sm text-red-600">• {trend.title}</p>
                      <p className="text-xs text-red-500">{trend.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Mercado Estável */}
          {(stableTrends.length > 0 || trends.length > 0) && (
            <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
              <div className="flex items-start gap-3">
                <div className="p-1 rounded text-blue-600">
                  <Activity className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-700">Mercado Estável</p>
                  {stableTrends.map((trend) => (
                    <div key={trend.id} className="mt-1">
                      <p className="text-sm text-blue-600">• {trend.title}</p>
                      <p className="text-xs text-blue-500">{trend.description}</p>
                    </div>
                  ))}
                  {trends.map((trend) => (
                    <div key={trend.id} className="mt-1">
                      <p className="text-sm text-blue-600">• {trend.title}</p>
                      <p className="text-xs text-blue-500">{trend.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer com link */}
      <div className="border-t pt-4">
        <a href="#" className="text-cyan-500 text-sm hover:underline block">
          Ver relatório completo →
        </a>
          </div>
      </Card>
  );
}
