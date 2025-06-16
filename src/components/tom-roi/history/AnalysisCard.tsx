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
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Trash2, MapPin, Bed, Waves, Calendar, DollarSign, TrendingUp } from 'lucide-react';
import { ROIAnalysisHistoryItem } from './useAnalysisHistory';

interface AnalysisCardProps {
  analysis: ROIAnalysisHistoryItem;
  onView: (id: string) => void;
  onDelete: (id: string) => void;
}

const AnalysisCard: React.FC<AnalysisCardProps> = ({ analysis, onView, onDelete }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  // Calcular dados essenciais para exibição resumida usando dados específicos da análise
  const propertyValue = analysis.details.propertyValue;
  const downPayment = analysis.details.downPayment;
  const roiPercentage = analysis.details.roi; // Usar ROI já calculado
  
  // Calcular valores para exibição
  const monthlyRent = analysis.details.monthlyRent;
  const monthlyExpenses = Math.floor(monthlyRent * 0.35);
  const netAnnualIncome = (monthlyRent - monthlyExpenses) * 12;
  const appreciationAmount = propertyValue * 0.06;
  const totalAnnualReturn = netAnnualIncome + appreciationAmount;

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Informações principais */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{analysis.title}</h3>
            
            {/* Linha de informações básicas */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{analysis.details.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Bed className="h-4 w-4" />
                <span>{analysis.details.bedrooms} quartos</span>
              </div>
              {analysis.details.hasPool && (
                <div className="flex items-center gap-1">
                  <Waves className="h-4 w-4 text-blue-500" />
                  <span>Com piscina</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(analysis.createdAt)}</span>
              </div>
            </div>

            {/* Métricas principais em linha */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Valor do Imóvel</p>
                <p className="font-semibold text-gray-900">{formatCurrency(propertyValue)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">ROI Estimado</p>
                <p className="font-semibold text-green-600 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  {formatPercentage(roiPercentage)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Retorno Anual</p>
                <p className="font-semibold text-blue-600 flex items-center gap-1">
                  <DollarSign className="h-3 w-3" />
                  {formatCurrency(totalAnnualReturn)}
                </p>
              </div>
        <div>
                <p className="text-xs text-gray-500 mb-1">Aluguel Mensal</p>
                <p className="font-semibold text-gray-900">{formatCurrency(monthlyRent)}</p>
              </div>
            </div>
        </div>

          {/* Botões de ação */}
          <div className="flex items-center gap-2 lg:ml-6">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onView(analysis.id)}
              className="flex items-center gap-1 hover:bg-blue-50 hover:border-blue-200"
          >
            <Eye size={16} />
              Ver Detalhes
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onDelete(analysis.id)}
              className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-200"
          >
            <Trash2 size={16} />
            Excluir
          </Button>
            </div>
          </div>
      </CardContent>
    </Card>
  );
};

export default AnalysisCard;
