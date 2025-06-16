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
 * Component: TomROIResults - ROI Results Display
 * ========================================
 */

import React, { forwardRef, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText, FileImage, RotateCcw, Star, TrendingUp, DollarSign, BarChart3, TrendingDown, Wallet } from 'lucide-react';
import { ROIAnalysisResult } from './types/analyzer-types';
import { formatCurrency } from './utils/formatter';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';
import arcaLogo from '@/assets/arca-logo.png';

// Import das funções de exportação
import { 
  exportToPDF as exportPdfFunction, 
  exportToJPEG as exportJpegFunction
} from '@/components/tom-roi/utils/export-utils.ultra';

import { calcularAguaMensalPorQuartos, calcularSeguroMensalPorQuartos } from '@/components/tom-roi/utils/financial-utils';
import { getHOAByCondominiumAndBedrooms, getDefaultHOAByBedrooms } from '@/components/tom-roi/data/hoa-table';

interface TomROIResultsProps {
  result: ROIAnalysisResult;
  logoUrl?: string | null;
  onNewAnalysis?: () => void;
  showBackButton?: boolean;
  backPath?: string;
  backText?: string;
  onBack: () => void;
}

const TomROIResults = forwardRef<HTMLDivElement, TomROIResultsProps>(({
  result,
  logoUrl,
  onNewAnalysis,
  showBackButton = true,
  backPath = '/',
  backText = 'Voltar',
  onBack,
}, ref) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const formatPercentage = (value: number | undefined | null) => {
    if (value === undefined || value === null || isNaN(value)) {
      return '0.0%';
    }
    return `${value.toFixed(1)}%`;
  };

  // Limpar nome do condomínio removendo números no final (bug fix)
  const cleanProjectName = (name: string): string => {
    if (!name) return name;
    return name.replace(/\d+$/, '').trim();
  };

  // Transformar dados do resultado para o formato esperado
  const transformResultData = (result: ROIAnalysisResult) => {
    if (!result || !result.propertyData) {
      console.error('Dados do resultado não disponíveis:', result);
      return null;
    }

    console.log('[TomROIResults] Dados recebidos:', result);

    // Valores base da análise
    const propertyValue = result.propertyData.valor_imovel || 0;
    const downPaymentAmount = result.propertyData.valor_entrada || (propertyValue * 0.3);
    const downPaymentPercentage = result.propertyData.percentual_entrada || 30;
    
    // Calcular aluguel mensal baseado no valor do imóvel (0.8% do valor)
    const monthlyRent = result.propertyData.receita_aluguel_mensal || Math.floor(propertyValue * 0.008);
    
    // Calcular despesas mensais usando as funções corretas
    const adminFee = Math.floor(monthlyRent * 0.20); // 20% do aluguel
    const iptuAnual = propertyValue * 0.012; // 1.2% anual do valor (IPTU correto para FL)
    const iptu = Math.floor(iptuAnual / 12);
    
    // Usar função correta para seguro baseado em quartos
    const bedrooms = parseInt(result.propertyData.quartos_imovel) || 3;
    const insurance = calcularSeguroMensalPorQuartos(bedrooms);
    
    // Energia: $75 por quarto (valor mais realista)
    const utilities = 75 * bedrooms;
    
    // Usar função correta para água baseado em quartos e piscina
    const water = calcularAguaMensalPorQuartos(bedrooms, result.propertyData.piscina_imovel || false);
    
    // Usar função correta para HOA baseado no condomínio e quartos
    let hoa: number;
    if (result.propertyData.nome_condominio) {
      const hoaFromTable = getHOAByCondominiumAndBedrooms(result.propertyData.nome_condominio, bedrooms);
      if (hoaFromTable) {
        hoa = hoaFromTable;
      } else {
        hoa = getDefaultHOAByBedrooms(bedrooms);
      }
    } else {
      hoa = getDefaultHOAByBedrooms(bedrooms);
    }
    
    const poolMaintenance = result.propertyData.piscina_imovel ? 120 : 0;
    
    const monthlyExpenses = adminFee + iptu + insurance + utilities + water + hoa + poolMaintenance;
    
    // Calcular financiamento
    const monthlyPayment = result.propertyData.parcela_mensal || 
                          (propertyValue > downPaymentAmount ? Math.floor((propertyValue - downPaymentAmount) / (30 * 12)) : 0);
    
    // Calcular renda líquida
    const monthlyNetIncome = monthlyRent - monthlyExpenses - monthlyPayment;
    const annualNetIncome = monthlyNetIncome * 12;
    
    // Valorização anual
    const appreciationAmount = propertyValue * 0.06;
    
    // CORREÇÃO: Verificar se decoração foi incluída
    // Se decoracao_total for 0 ou não existir, significa que não foi incluída
    const decorationAmount = result.propertyData.decoracao_total || 0;
    const decorationPercentage = decorationAmount > 0 ? (decorationAmount / propertyValue) * 100 : 0;
    
    // CORREÇÃO: Verificar se closing costs foi incluído
    // Se closing_costs_total for 0 ou não existir, significa que não foi incluído
    const closingCostsAmount = result.propertyData.closing_costs_total || 0;
    const closingCostsPercentage = closingCostsAmount > 0 ? (closingCostsAmount / propertyValue) * 100 : 0;
    
    // ROI total anual
    const totalAnnualReturn = annualNetIncome + appreciationAmount;
    
    // CORREÇÃO: Calcular investimento total incluindo decoração e closing costs
    const totalInvestment = downPaymentAmount + closingCostsAmount + decorationAmount;
    const roiPercentage = totalInvestment > 0 ? (totalAnnualReturn / totalInvestment) * 100 : 0;

    console.log('[TomROIResults] Despesas calculadas:', {
      adminFee,
      iptu,
      insurance,
      utilities,
      water,
      hoa,
      poolMaintenance,
      total: monthlyExpenses,
      quartos: bedrooms,
      piscina: result.propertyData.piscina_imovel,
      condominio: result.propertyData.nome_condominio
    });

    console.log('[TomROIResults] CORREÇÃO DE ROI APLICADA:', {
      totalAnnualReturn: totalAnnualReturn,
      downPaymentAmount: downPaymentAmount,
      closingCostsAmount: closingCostsAmount,
      decorationAmount: decorationAmount,
      totalInvestment: totalInvestment,
      roiAnterior: (totalAnnualReturn / downPaymentAmount * 100).toFixed(1) + '%',
      roiCorrigido: roiPercentage.toFixed(1) + '%'
    });

    return {
      propertyValue,
      downPaymentAmount,
      downPaymentPercentage,
      monthlyRent,
      monthlyExpenses,
      monthlyNetIncome,
      annualNetIncome,
      appreciationAmount,
      totalAnnualReturn,
      roiPercentage,
      monthlyPayment,
      adminFee,
      iptu,
      insurance,
      utilities,
      water,
      hoa,
      poolMaintenance,
      decorationAmount,
      decorationPercentage,
      closingCostsAmount,
      closingCostsPercentage,
    };
  };

  const propertyData = transformResultData(result);

  if (!propertyData) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-600">Erro ao carregar dados da análise</p>
        <Button onClick={onBack} className="mt-4">
          <ArrowLeft size={16} className="mr-2" />
          Voltar
        </Button>
      </div>
    );
  }

  const handleExportPDF = async () => {
    if (!contentRef.current || !result) return;
    
    try {
      const fileName = `ROI_Analise_${cleanProjectName(result.projectName)}.pdf`;
      await exportPdfFunction(contentRef.current, fileName, logoUrl || null);
      toast.success("PDF exportado com sucesso!");
    } catch (error) {
      console.error("Erro ao exportar PDF:", error);
      toast.error("Erro ao exportar PDF", { 
        description: error instanceof Error ? error.message : "Falha desconhecida ao gerar PDF"
      });
    }
  };

  const handleExportJPEG = async () => {
    if (!contentRef.current || !result) return;
    
    try {
      const fileName = `ROI_Analise_${cleanProjectName(result.projectName)}.jpg`;
      await exportJpegFunction(contentRef, fileName);
      toast.success("JPEG exportado com sucesso!");
    } catch (error) {
      console.error("Erro ao exportar JPEG:", error);
      toast.error("Erro ao exportar JPEG", { 
        description: error instanceof Error ? error.message : "Falha desconhecida ao gerar JPEG"
      });
    }
  };

  return (
    <div ref={ref} className="space-y-6">
      {/* Header com botões */}
      <div className="flex items-center justify-between flex-wrap gap-2 print:hidden">
        <Button
          variant="outline"
          onClick={onNewAnalysis}
          className="flex items-center space-x-2"
        >
          <RotateCcw className="h-4 w-4" />
          <span>Nova Análise</span>
        </Button>
        
        {showBackButton && (
           <Button
             variant="ghost"
             onClick={onBack}
             className="flex items-center space-x-2"
           >
             <ArrowLeft className="h-4 w-4" />
             <span>{backText}</span>
           </Button>
        )}
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportPDF} className="flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span>PDF</span>
          </Button>
          <Button variant="outline" onClick={handleExportJPEG} className="flex items-center space-x-2">
            <FileImage className="h-4 w-4" />
            <span>Imagem</span>
          </Button>
        </div>
      </div>

      {/* Conteúdo principal - Layout do PDF */}
      <div ref={contentRef} className="bg-white p-8 rounded-lg shadow-lg border border-gray-200 print:shadow-none print:border-none">
        
        {/* Header do Projeto */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              {logoUrl ? (
                <img 
                  src={logoUrl} 
                  alt="Logo do Corretor" 
                  className="h-12 w-auto object-scale-down"
                  crossOrigin="anonymous"
                />
              ) : (
                <img 
                  src={arcaLogo} 
                  alt="Arca AI Logo" 
                  className="h-12 w-auto object-scale-down"
                  crossOrigin="anonymous"
                />
              )}
            </div>
            <div>
              <div className="flex items-center gap-4 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">{cleanProjectName(result.projectName)}</h1>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded text-sm font-medium">PREMIUM</span>
              </div>
              <p className="text-gray-600">{result.location}</p>
              <p className="text-gray-600">{result.modelType}, {result.bedrooms} quartos{result.hasPool ? ', com piscina' : ''}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Valor do Imóvel</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(propertyData.propertyValue)}</p>
          </div>
        </div>

        {/* Cards principais - ROI e Retorno Anual */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-blue-600 text-white p-6 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium opacity-90"><TrendingUp className="inline w-4 h-4 mr-1" /> ROI</span>
            </div>
            <div className="text-3xl font-bold mb-1">{formatPercentage(propertyData.roiPercentage)}</div>
            <div className="text-sm opacity-80">Retorno sobre valor investido</div>
          </div>

          <div className="bg-green-600 text-white p-6 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium opacity-90"><DollarSign className="inline w-4 h-4 mr-1" /> RETORNO ANUAL TOTAL</span>
            </div>
            <div className="text-3xl font-bold mb-1">{formatCurrency(propertyData.totalAnnualReturn)}</div>
            <div className="text-sm opacity-80">Aluguel + valorização anual</div>
          </div>
        </div>

        {/* Grid de seções */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          
          {/* Financiamento */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="text-blue-600"><BarChart3 className="inline w-4 h-4 mr-1" /></span> FINANCIAMENTO
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Valor do imóvel</p>
                <p className="font-semibold text-gray-900">{formatCurrency(propertyData.propertyValue)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Entrada ({propertyData.downPaymentPercentage}%)</p>
                <p className="font-semibold text-gray-900">{formatCurrency(propertyData.downPaymentAmount)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Parcela mensal</p>
                <p className="font-semibold text-red-600">-{formatCurrency(propertyData.monthlyPayment)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Taxa de juros</p>
                <p className="font-semibold text-gray-900">7%</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Closing Costs ({propertyData.closingCostsPercentage.toFixed(1)}%)</p>
                <p className="font-semibold text-gray-900">{formatCurrency(propertyData.closingCostsAmount)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Decoração ({propertyData.decorationPercentage.toFixed(1)}%)</p>
                <p className="font-semibold text-gray-900">{formatCurrency(propertyData.decorationAmount)}</p>
              </div>
            </div>
          </div>

          {/* Receita de Aluguel */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="text-green-600"><TrendingUp className="inline w-4 h-4 mr-1" /></span> RECEITA DE ALUGUEL
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Diária média</p>
                <p className="font-semibold text-gray-900">{formatCurrency(Math.floor(propertyData.monthlyRent / 20))}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Ocupação</p>
                <p className="font-semibold text-gray-900">80%</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Aluguel mensal</p>
                <p className="font-semibold text-green-600">+{formatCurrency(propertyData.monthlyRent)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Aluguel anual</p>
                <p className="font-semibold text-green-600">+{formatCurrency(propertyData.monthlyRent * 12)}</p>
              </div>
            </div>
          </div>

          {/* Despesas Mensais */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="text-red-600"><TrendingDown className="inline w-4 h-4 mr-1" /></span> DESPESAS MENSAIS
            </h3>
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="text-center">
                <p className="text-xs text-gray-600">ADMIN (20%)</p>
                <p className="font-semibold text-gray-900">{formatCurrency(propertyData.adminFee)}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-600">IPTU</p>
                <p className="font-semibold text-gray-900">{formatCurrency(propertyData.iptu)}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-600">SEGURO</p>
                <p className="font-semibold text-gray-900">{formatCurrency(propertyData.insurance)}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-600">ENERGIA</p>
                <p className="font-semibold text-gray-900">{formatCurrency(propertyData.utilities)}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-600">ÁGUA</p>
                <p className="font-semibold text-gray-900">{formatCurrency(propertyData.water)}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-600">HOA</p>
                <p className="font-semibold text-gray-900">{formatCurrency(propertyData.hoa)}</p>
              </div>
            </div>
            <div className="border-t pt-3">
              <p className="text-sm text-gray-600">TOTAL DESPESAS OPERACIONAIS</p>
              <p className="text-xl font-bold text-red-600">-{formatCurrency(propertyData.monthlyExpenses)}</p>
            </div>
          </div>

          {/* Fluxo de Caixa Líquido */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="text-blue-600"><DollarSign className="inline w-4 h-4 mr-1" /></span> FLUXO DE CAIXA LÍQUIDO (Mensal)
            </h3>
            <div className="text-2xl font-bold text-blue-600 mb-2">{formatCurrency(propertyData.monthlyNetIncome)}</div>
            <p className="text-sm text-gray-600 mb-4">Após despesas e financiamento</p>

            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <span className="text-purple-600"><DollarSign className="inline w-4 h-4 mr-1" /></span> FLUXO DE CAIXA LÍQUIDO (Anual)
            </h3>
            <div className="text-2xl font-bold text-purple-600">{formatCurrency(propertyData.annualNetIncome)}</div>
            <p className="text-sm text-gray-600">Soma anual do fluxo de caixa mensal</p>
          </div>

        </div>

        {/* Seção inferior */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Valorização Anual */}
          <div className="bg-orange-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-orange-700">
              <span><TrendingUp className="inline w-4 h-4 mr-1" /></span> VALORIZAÇÃO ANUAL ESTIMADA
            </h3>
            <div className="text-2xl font-bold text-orange-600 mb-2">{formatCurrency(propertyData.appreciationAmount)}</div>
            <p className="text-sm text-orange-600 mb-4">6.0% de valorização do imóvel</p>
            
            <div className="border-t border-orange-200 pt-4">
              <h4 className="text-sm font-semibold text-orange-700 mb-2"><Star className="inline w-4 h-4 mr-1" /> NET CAP RATE</h4>
              <div className="text-xl font-bold text-orange-700">6.5%</div>
              <p className="text-xs text-orange-600">Taxa de capitalização líquida</p>
            </div>
          </div>

          {/* NET RENTAL YIELD (novo) */}
          <div className="bg-purple-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-purple-700">
              <span><BarChart3 className="inline w-4 h-4 mr-1" /></span> NET RENTAL YIELD
            </h3>
            <div className="text-2xl font-bold text-purple-600 mb-2">
              {formatPercentage(propertyData.annualNetIncome / propertyData.propertyValue * 100)}
            </div>
            <p className="text-sm text-purple-600 mb-4">Baseado apenas no aluguel líquido / valor do imóvel</p>
            
            <div className="border-t border-purple-200 pt-4">
              <h4 className="text-sm font-semibold text-purple-700 mb-2"><DollarSign className="inline w-4 h-4 mr-1" /> ROI SÓ SOBRE ENTRADA</h4>
              <div className="text-xl font-bold text-purple-700">
                {formatPercentage(propertyData.totalAnnualReturn / propertyData.downPaymentAmount * 100)}
              </div>
              <p className="text-xs text-purple-600">Para comparação com outros investimentos</p>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500 mt-8 pt-4 border-t border-gray-200">
          <p>Esta análise é uma estimativa e deve ser usada apenas para fins informativos. As condições de mercado podem variar.</p>
          <p className="mt-2">Análise gerada em {new Date(result.analysisDate).toLocaleDateString('pt-BR')} por Arca AI</p>
        </div>
      </div>
    </div>
  );
});

TomROIResults.displayName = 'TomROIResults';

export default TomROIResults; 