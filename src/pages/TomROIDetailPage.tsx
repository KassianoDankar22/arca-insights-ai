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
 * Component: TomROIDetailPage - ROI Analysis Detail View
 * ========================================
 */

import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText, FileImage, Star, TrendingUp, DollarSign, BarChart3, TrendingDown, Wallet } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { toast } from 'sonner';
import { formatCurrency } from '@/components/tom-roi/utils/formatter';
import { useIsMobile } from '@/hooks/use-mobile';
import arcaLogo from '@/assets/arca-logo.png';

// Import das funções de exportação
import { 
  exportToPDF as exportPdfFunction, 
  exportToJPEG as exportJpegFunction
} from '@/components/tom-roi/utils/export-utils.ultra';

import { calcularAguaMensalPorQuartos, calcularSeguroMensalPorQuartos } from '@/components/tom-roi/utils/financial-utils';
import { getHOAByCondominiumAndBedrooms, getDefaultHOAByBedrooms } from '@/components/tom-roi/data/hoa-table';

interface ROIAnalysis {
  id: string;
  condominio: string;
  localizacao: string;
  criado_em: string;
  expira_em: string;
  valor_imovel: number;
  entrada_valor?: number;
  entrada_percentual?: number;
  modelo: string;
  quartos: number;
  piscina: boolean;
  tipo_investimento: string;
  resultado_texto?: string;
  logo_storage_url?: string;
}

// Transformar dados da análise para o formato esperado
const transformAnalysisData = (analysisData: ROIAnalysis): any => {
  if (!analysisData) return null;

  console.log('[transformAnalysisData] Dados recebidos:', analysisData);

  // Valores base da análise
  const propertyValue = analysisData.valor_imovel || 0;
  const downPaymentAmount = analysisData.entrada_valor || (propertyValue * 0.3); // 30% padrão
  const downPaymentPercentage = analysisData.entrada_percentual || 30;
  
  // Calcular aluguel mensal baseado no valor do imóvel (0.8% do valor)
  const monthlyRent = Math.floor(propertyValue * 0.008);
  
  // Calcular despesas mensais usando as funções corretas
  const adminFee = Math.floor(monthlyRent * 0.20); // 20% do aluguel
  const iptuAnual = propertyValue * 0.012; // 1.2% anual do valor (IPTU correto para FL)
  const iptu = Math.floor(iptuAnual / 12);
  
  // Usar função correta para seguro baseado em quartos
  const insurance = calcularSeguroMensalPorQuartos(analysisData.quartos || 3);
  
  // Energia: $75 por quarto (valor mais realista)
  const utilities = 75 * (analysisData.quartos || 3);
  
  // Usar função correta para água baseado em quartos e piscina
  const water = calcularAguaMensalPorQuartos(analysisData.quartos || 3, analysisData.piscina || false);
  
  // Usar função correta para HOA baseado no condomínio e quartos
  let hoa: number;
  if (analysisData.condominio) {
    const hoaFromTable = getHOAByCondominiumAndBedrooms(analysisData.condominio, analysisData.quartos || 3);
    if (hoaFromTable) {
      hoa = hoaFromTable;
    } else {
      hoa = getDefaultHOAByBedrooms(analysisData.quartos || 3);
    }
  } else {
    hoa = getDefaultHOAByBedrooms(analysisData.quartos || 3);
  }
  
  const poolMaintenance = analysisData.piscina ? 120 : 0; // Manutenção piscina
  
  const monthlyExpenses = adminFee + iptu + insurance + utilities + water + hoa + poolMaintenance;
  
  // Calcular financiamento
  const monthlyPayment = propertyValue > downPaymentAmount ? Math.floor((propertyValue - downPaymentAmount) / (30 * 12)) : 0;
  
  // Calcular renda líquida
  const monthlyNetIncome = monthlyRent - monthlyExpenses - monthlyPayment;
  const annualNetIncome = monthlyNetIncome * 12;
  
  // Valorização anual
  const appreciationAmount = propertyValue * 0.06;
  
  // ROI total anual
  const totalAnnualReturn = annualNetIncome + appreciationAmount;
  
  // CORREÇÃO: Calcular investimento total incluindo decoração e closing costs
  // Primeiro extrair os dados do resultado_texto se disponível
  let decorationAmount = 0;
  let decorationPercentage = 0;
  let closingCostsAmount = 0;
  let closingCostsPercentage = 0;
  
  // Tentar extrair dados do resultado_texto se disponível
  if (analysisData.resultado_texto) {
    try {
      const resultData = JSON.parse(analysisData.resultado_texto);
      
      // Verificar se decoração foi incluída
      if (resultData.decoracao_total !== undefined) {
        decorationAmount = resultData.decoracao_total || 0;
        decorationPercentage = decorationAmount > 0 ? (decorationAmount / propertyValue) * 100 : 0;
      } else if (resultData.incluiu_decoracao === false) {
        decorationAmount = 0;
        decorationPercentage = 0;
      }
      
      // Verificar se closing costs foi incluído
      if (resultData.closing_costs_total !== undefined) {
        closingCostsAmount = resultData.closing_costs_total || 0;
        closingCostsPercentage = closingCostsAmount > 0 ? (closingCostsAmount / propertyValue) * 100 : 0;
      } else if (resultData.incluiu_closing_costs === false) {
        closingCostsAmount = 0;
        closingCostsPercentage = 0;
      }
    } catch (error) {
      console.error('Erro ao parsear resultado_texto:', error);
      // Manter valores padrão (0) em caso de erro
    }
  }
  
  // Calcular investimento total incluindo decoração e closing costs
  const totalInvestment = downPaymentAmount + closingCostsAmount + decorationAmount;
  const roiPercentage = totalInvestment > 0 ? (totalAnnualReturn / totalInvestment) * 100 : 0;

  console.log('[transformAnalysisData] Despesas calculadas:', {
    adminFee,
    iptu,
    insurance,
    utilities,
    water,
    hoa,
    poolMaintenance,
    total: monthlyExpenses,
    quartos: analysisData.quartos,
    piscina: analysisData.piscina,
    condominio: analysisData.condominio
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
    projectName: analysisData.condominio,
    location: analysisData.localizacao,
    modelType: analysisData.modelo,
    bedrooms: analysisData.quartos,
    hasPool: analysisData.piscina,
    analysisDate: analysisData.criado_em,
    logoUrl: analysisData.logo_storage_url,
  };
};

const TomROIDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [analysis, setAnalysis] = useState<ROIAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    const fetchAnalysis = async () => {
      if (!id || !user) return;

    try {
      const { data, error } = await supabase
        .from('roi_analises')
        .select('*')
          .eq('id', id)
          .eq('user_id', user.id)
        .single();
        
      if (error) {
          console.error('Erro ao buscar análise:', error);
          toast.error('Erro ao carregar análise');
          navigate('/meus-rois');
        return;
      }
      
      setAnalysis(data);
    } catch (error) {
        console.error('Erro ao buscar análise:', error);
        toast.error('Erro ao carregar análise');
        navigate('/meus-rois');
    } finally {
      setLoading(false);
    }
    };

    fetchAnalysis();
  }, [id, user, navigate]);

  const handleExportPDF = async () => {
    if (!contentRef.current || !analysis) return;
    
    try {
      const fileName = `ROI_Analise_${cleanProjectName(analysis.condominio)}.pdf`;
      await exportPdfFunction(contentRef.current, fileName, analysis.logo_storage_url || null);
        toast.success("PDF exportado com sucesso!");
    } catch (error) {
      console.error("Erro ao exportar PDF:", error);
      toast.error("Erro ao exportar PDF", { 
        description: error instanceof Error ? error.message : "Falha desconhecida ao gerar PDF"
      });
    }
  };

  const handleExportJPEG = async () => {
    if (!contentRef.current || !analysis) return;
    
    try {
      const fileName = `ROI_Analise_${cleanProjectName(analysis.condominio)}.jpg`;
      await exportJpegFunction(contentRef, fileName);
        toast.success("JPEG exportado com sucesso!");
    } catch (error) {
      console.error("Erro ao exportar JPEG:", error);
      toast.error("Erro ao exportar JPEG", { 
        description: error instanceof Error ? error.message : "Falha desconhecida ao gerar JPEG"
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-lg text-gray-600">Carregando análise...</p>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-lg text-gray-600">Análise não encontrada</p>
          <Button onClick={() => navigate('/meus-rois')} className="mt-4">
            <ArrowLeft size={16} className="mr-2" />
            Voltar ao Histórico
          </Button>
        </div>
      </div>
    );
  }

  const propertyData = transformAnalysisData(analysis);

  if (!propertyData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-lg text-gray-600">Erro ao processar dados da análise</p>
          <Button onClick={() => navigate('/meus-rois')} className="mt-4">
            <ArrowLeft size={16} className="mr-2" />
            Voltar ao Histórico
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header com botões */}
      <div className="flex items-center justify-between flex-wrap gap-2 print:hidden">
        <Button
          variant="ghost"
          onClick={() => navigate('/meus-rois')}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Voltar ao Histórico</span>
        </Button>

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
              {propertyData.logoUrl ? (
                <img 
                  src={propertyData.logoUrl} 
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
                <h1 className="text-2xl font-bold text-gray-900">{cleanProjectName(propertyData.projectName)}</h1>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded text-sm font-medium">PREMIUM</span>
              </div>
              <p className="text-gray-600">{propertyData.location}</p>
              <p className="text-gray-600">{propertyData.modelType}, {propertyData.bedrooms} quartos{propertyData.hasPool ? ', com piscina' : ''}</p>
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
          <p className="mt-2">Análise gerada em {new Date(propertyData.analysisDate).toLocaleDateString('pt-BR')} por Arca AI</p>
        </div>
      </div>
    </div>
  );
};

export default TomROIDetailPage;
