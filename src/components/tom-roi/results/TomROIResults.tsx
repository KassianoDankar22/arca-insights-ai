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

import React, { useRef } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Download, Save, Calculator, TrendingUp, DollarSign, Home, PieChart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { motion } from 'framer-motion';
import { ROIAnalysisResult, PropertyData } from '../types/analyzer-types';

interface TomROIResultsProps {
  result: ROIAnalysisResult;
  propertyData: PropertyData;
  onBack: () => void;
  onSave: () => void;
  isSaving: boolean;
  analysisSaved: boolean;
  logoUrl?: string;
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

const formatPercentage = (value: number) => `${value.toFixed(1)}%`;
const formatCurrencyBR = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const TomROIResults: React.FC<TomROIResultsProps> = ({
  result,
  propertyData,
  onBack,
  onSave,
  isSaving,
  analysisSaved,
  logoUrl,
  onNewAnalysis,
  onSaveAsPDF,
  onSaveAsImage,
  showBackButton = true,
  backPath,
  backText
}) => {
  const reportRef = useRef<HTMLDivElement>(null);
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

  const isFinancing = propertyData.tipo_investimento === 'financing';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div ref={reportRef} className="space-y-6">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {logoUrl && (
                  <img 
                    src={logoUrl} 
                    alt="Logo" 
                    className="h-12 w-auto object-contain"
                  />
                )}
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Análise ROI - {result.projectName}
                  </h1>
                  <p className="text-gray-600">
                    {result.location} • {result.modelType} • {result.bedrooms} Quartos
                    {result.hasPool && ' • Piscina'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  {formatPercentage(propertyData.roi)} ROI
                </Badge>
                <Badge variant="outline">
                  {isFinancing ? 'Financiamento' : 'À Vista'}
                </Badge>
              </div>
            </div>
          </motion.div>

          {/* Results Cards and Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Valor do Imóvel</CardTitle>
                <Home className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrencyBR(result.purchasePrice)}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">ROI Anual</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {formatPercentage(propertyData.roi)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Fluxo Mensal</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrencyBR(propertyData.fluxo_caixa_mensal_antes_ir)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cap Rate</CardTitle>
                <Calculator className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatPercentage(propertyData.capRate)}
                </div>
              </CardContent>
            </Card>
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
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 justify-center bg-white p-6 rounded-xl shadow-lg">
        {showBackButton && (
          <Button 
            variant="outline" 
            onClick={onBack}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>{backText || 'Voltar'}</span>
          </Button>
        )}
        
        <Button 
          onClick={onSave}
          disabled={isSaving || analysisSaved}
          className="flex items-center space-x-2"
        >
          <Save className="h-4 w-4" />
          <span>
            {isSaving ? 'Salvando...' : analysisSaved ? 'Salvo!' : 'Salvar Análise'}
          </span>
        </Button>

        {onSaveAsPDF && (
          <Button 
            variant="outline"
            onClick={onSaveAsPDF}
            className="flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Baixar PDF</span>
          </Button>
        )}

        {onNewAnalysis && (
          <Button 
            variant="secondary"
            onClick={onNewAnalysis}
            className="flex items-center space-x-2"
          >
            <Calculator className="h-4 w-4" />
            <span>Nova Análise</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default TomROIResults;
