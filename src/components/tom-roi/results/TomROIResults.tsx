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
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, FileDown, ImageDown, RotateCcw } from 'lucide-react';
import { ROIAnalysisResult, PropertyData } from '../types/analyzer-types';

interface TomROIResultsProps {
  result: ROIAnalysisResult;
  propertyData: PropertyData;
  onNewAnalysis: () => void;
  onSaveAsPDF: () => void;
  onSaveAsImage: () => void;
  showBackButton?: boolean;
  backPath?: string;
  backText?: string;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

const formatPercentage = (value: number) => {
  return `${value.toFixed(2)}%`;
};

const TomROIResults: React.FC<TomROIResultsProps> = ({
  result,
  propertyData,
  onNewAnalysis,
  onSaveAsPDF,
  onSaveAsImage,
  showBackButton,
  backPath,
  backText
}) => {
  const isMobile = useIsMobile();

  const getInvestmentTypeLabel = (type: string) => {
    switch (type) {
      case 'cash':
        return 'À vista';
      case 'local_financing':
        return 'Financiamento Local (EUA)';
      case 'foreign_financing':
        return 'Financiamento Internacional';
      default:
        return type;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <Button
          variant="outline"
          onClick={onNewAnalysis}
          className="flex items-center space-x-2"
        >
          <RotateCcw className="h-4 w-4" />
          <span>Nova Análise</span>
        </Button>
        
        {showBackButton && backPath && backText && (
           <Button
             variant="ghost"
             onClick={() => window.location.href = backPath}
             className="flex items-center space-x-2"
           >
             <ArrowLeft className="h-4 w-4" />
             <span>{backText}</span>
           </Button>
        )}
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={onSaveAsPDF} className="flex items-center space-x-2">
            <FileDown className="h-4 w-4" />
            <span>PDF</span>
          </Button>
          <Button variant="outline" onClick={onSaveAsImage} className="flex items-center space-x-2">
            <ImageDown className="h-4 w-4" />
            <span>Imagem</span>
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="space-y-6">
            <div>
              <h2 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-gray-900`}>
                Análise de ROI: {result.projectName}
              </h2>
              <p className="text-gray-500 mt-1">
                {result.location}
              </p>
              {propertyData.decoracao_total && (
                <p className="text-sm text-gray-500">
                  Decoração: {formatCurrency(propertyData.decoracao_total)}
                </p>
              )}
              {propertyData.closing_costs_total && (
                <p className="text-sm text-gray-500">
                  Custos de Fechamento: {formatCurrency(propertyData.closing_costs_total)}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Detalhes do Imóvel
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tipo do Modelo</span>
                    <span className="font-medium">{result.modelType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Quartos</span>
                    <span className="font-medium">{result.bedrooms}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Piscina</span>
                    <span className="font-medium">{result.hasPool ? 'Sim' : 'Não'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Valor de Compra</span>
                    <span className="font-medium">{formatCurrency(result.purchasePrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tipo de Investimento</span>
                    <span className="font-medium">{getInvestmentTypeLabel(result.investmentType)}</span>
                  </div>
                  {(result.investmentType === 'local_financing' || result.investmentType === 'foreign_financing') && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Valor da Entrada</span>
                        <span className="font-medium">{formatCurrency(result.downPaymentValue)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Percentual de Entrada</span>
                        <span className="font-medium">{formatPercentage(result.downPaymentPercent)}</span>
                      </div>
                    </>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Taxa de Ocupação Anual</span>
                    <span className="font-medium">{formatPercentage(result.annualOccupancyRate)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Resultados Financeiros
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Renda Bruta Mensal</span>
                    <span className="font-medium">{formatCurrency(propertyData.rentalIncome.monthly)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Renda Bruta Anual</span>
                    <span className="font-medium">{formatCurrency(propertyData.rentalIncome.annual)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Despesas Mensais</span>
                    <span className="font-medium">{formatCurrency(propertyData.expenses.monthly.total)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Despesas Anuais</span>
                    <span className="font-medium">{formatCurrency(propertyData.expenses.annual)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Renda Líquida Mensal</span>
                    <span className="font-medium">{formatCurrency(propertyData.netIncome.monthly)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Renda Líquida Anual</span>
                    <span className="font-medium">{formatCurrency(propertyData.netIncome.annual)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Valorização Anual</span>
                    <span className="font-medium">{formatCurrency(propertyData.appreciation.amount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">ROI sobre Entrada</span>
                    <span className="font-medium">{formatPercentage(propertyData.roiPercentOnDownPayment)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Analysis Text Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Análise Detalhada
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <pre className="whitespace-pre-wrap text-sm text-gray-700">
                  {result.resultado_texto}
                </pre>
              </div>
              {result.analysisDate && (
                <p className="text-xs text-gray-500">
                  Análise realizada em: {result.analysisDate}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TomROIResults;
