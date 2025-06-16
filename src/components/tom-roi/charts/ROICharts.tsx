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

import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import SimpleExpensesPieChart from './SimpleExpensesPieChart';

interface ROIChartsProps {
  resultText?: string;
  propertyValue?: number;
  propertyData?: {
    propertyValue: number;
    rentalIncome: { 
      monthly: number; 
      annual: number;
      dailyRate: number;
      occupancyRate: number;
    };
    financing: {
      downPayment: { amount: number; percentage: number };
      monthlyPayment: number;
      annualPayment: number;
      interestRate: number;
      prazoAnos?: number;
    };
    expenses: {
      monthly: { 
        total: number;
        breakdown: Array<{ name: string; value: number }>;
      };
      annual: number;
    };
    netIncome: { 
      monthly: number; 
      annual: number;
      aluguelMensalBruto?: number;
      despesasTotaisMensais?: number;
      liquidoPreFinanciamento?: number;
    };
    appreciation: { percentage: number; amount: number };
    totalAnnualReturn: number;
    roiPercentSobreEntrada?: number;
    resumoInvestimento?: {
      fluxoCaixaAnualDetalhado: {
        aluguelBrutoAnual: number;
        despesasAnuais: number;
        financiamentoAnual: number;
        liquidoAnual: number;
      };
      retornoTotalAnualDetalhado: {
        aluguelLiquidoAnual: number;
        valorizacaoAnual: number;
        totalAnual: number;
      };
    };
  };
  formatCurrency?: (value: number | string | undefined, options?: { showCents?: boolean, abbreviate?: boolean }) => string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const ROICharts: React.FC<ROIChartsProps> = ({ resultText = "", propertyValue = 0, propertyData, formatCurrency }) => {
  // Formatar valores monetários
  const formatCurrencyValue = (value: number) => {
    if (formatCurrency) {
      return formatCurrency(value, { showCents: false });
    }
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      maximumFractionDigits: 0 
    }).format(value);
  };

  // Garantir que o ROI esteja atualizado
  const recalculateRoiIfNeeded = () => {
    if (!propertyData) return { roiPercent: 0, totalReturn: 0 };
    
    // Obter os valores básicos necessários para o cálculo
    const entradaValor = propertyData.financing?.downPayment?.amount || 0;
    const retornoAnualTotal = propertyData.resumoInvestimento?.retornoTotalAnualDetalhado?.totalAnual || 
                             propertyData.totalAnnualReturn || 0;
                             
    // SEMPRE calcular o ROI com a fórmula correta
    const roiCalculado = entradaValor > 0 ? (retornoAnualTotal / entradaValor) * 100 : 0;
    
    console.log("[ROICharts] Recalculando ROI com valores fundamentais:", {
      entradaValor: formatCurrency(entradaValor),
      retornoAnualTotal: formatCurrency(retornoAnualTotal),
      roiCalculado: roiCalculado.toFixed(1) + '%',
      roiOriginal: propertyData.roiPercentSobreEntrada ? propertyData.roiPercentSobreEntrada.toFixed(1) + '%' : 'N/A'
    });
    
    return {
      roiPercent: roiCalculado,
      totalReturn: retornoAnualTotal
    };
  };
  
  const { roiPercent, totalReturn } = recalculateRoiIfNeeded();

  // Extract financial data - always use propertyData when available
  const extractedData = useMemo(() => {
    // If propertyData is not available, use default values
    if (!propertyData) {
      return {
      roi: 0,
      monthlyCashFlow: 0,
      yearlyIncome: 0,
        estimatedValue: propertyValue || 0,
      paybackPeriod: 0,
      expenses: [],
      financedValue: 0,
      downPayment: 0,
      monthlyPayment: 0,
      annualPayment: 0,
      propertyAppreciation: 0,
      rentalFee: 0,
      netIncome: 0,
      rentalIncomeMonthly: 0,
      occupancyRate: 80,
      averageNightlyRate: 0,
      monthlyExpenseTotal: 0,
      annualExpenseTotal: 0,
      propertyDetails: {
        bedrooms: 0,
        hasPool: false,
        location: '',
        investmentType: ''
      }
    };
    }

    // Always use real data from propertyData
    return {
      roi: roiPercent,
      monthlyCashFlow: propertyData.netIncome.monthly,
      yearlyIncome: propertyData.rentalIncome.annual,
      estimatedValue: propertyData.propertyValue,
      paybackPeriod: propertyData.netIncome.annual > 0 ? propertyData.propertyValue / propertyData.netIncome.annual : 0,
      expenses: propertyData.expenses.monthly.breakdown || [],
      financedValue: propertyData.propertyValue - propertyData.financing.downPayment.amount,
      downPayment: propertyData.financing.downPayment.amount,
      monthlyPayment: propertyData.financing.monthlyPayment,
      annualPayment: propertyData.financing.annualPayment,
      propertyAppreciation: propertyData.appreciation.amount,
      rentalFee: 0, // Not directly available
      netIncome: propertyData.netIncome.monthly,
      rentalIncomeMonthly: propertyData.rentalIncome.monthly,
      occupancyRate: propertyData.rentalIncome.occupancyRate,
      averageNightlyRate: propertyData.rentalIncome.dailyRate,
      monthlyExpenseTotal: propertyData.expenses.monthly.total,
      annualExpenseTotal: propertyData.expenses.annual,
      propertyDetails: {
        bedrooms: 0, // Get from result when available
        hasPool: false, // Get from result when available
        location: '',
        investmentType: ''
      }
    };
  }, [propertyData, propertyValue, roiPercent]);

  // Calculate yearly return projection (5 years)
  const projectionData = useMemo(() => {
    // Use paybackPeriod to calculate a more realistic growth if available
    const yearlyReturn = extractedData.yearlyIncome;
    const growthFactor = extractedData.paybackPeriod > 0 ? 
                        Math.min(1.08, 1 + (1 / extractedData.paybackPeriod)) : 
                        1.05; // Default 5% annual growth
    
    // Array to store accumulated values by year
    return Array.from({ length: 6 }, (_, i) => {
      if (i === 0) {
        return { year: 'Hoje', value: 0 };
      } else {
        // Calculate accumulated value with compound growth
        let accumulatedValue = 0;
        for (let year = 1; year <= i; year++) {
          accumulatedValue += yearlyReturn * Math.pow(growthFactor, year - 1);
        }
        return { year: `Ano ${i}`, value: accumulatedValue };
      }
    });
  }, [extractedData.yearlyIncome, extractedData.paybackPeriod]);

  // Format percentages
  const formatPercentage = (value: number) => `${value.toFixed(1)}%`;

  // For ROI comparison chart - use updated values for the Brazilian market
  const roiComparisonData = [
    { name: 'Poupança', roi: 6.17 }, // Average savings return
    { name: 'Imóvel', roi: extractedData.roi > 0 ? extractedData.roi : 8.4 }, // Property ROI or market average
    { name: 'CDI', roi: 10.65 } // Average CDI return
  ];

  // Properly type the formatter to avoid errors with ValueType
  const formatTooltipValue = (value: any, name: string, props: any) => {
    if (typeof value === 'number') {
      return [`${value.toFixed(2)}%`, 'ROI'];
    }
    return [`${value}%`, 'ROI'];
  };

  // Add a new chart to show the breakdown of income vs expenses
  const incomeExpenseData = [
    { 
      name: 'Receita', 
      value: extractedData.rentalIncomeMonthly > 0 ? extractedData.rentalIncomeMonthly : extractedData.monthlyCashFlow * 1.3 
    },
    { 
      name: 'Despesas', 
      value: extractedData.monthlyExpenseTotal > 0 ? extractedData.monthlyExpenseTotal : extractedData.monthlyCashFlow * 0.3 
    }
  ];
  
  // Dimensões mínimas para resolver o erro de width(0) e height(0)
  const chartStyle = { 
    width: '100%', 
    height: '100%',
    minWidth: '200px',
    minHeight: '180px'
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 print:grid-cols-2" style={{minHeight: '500px'}}>
      {/* Monthly Cash Flow */}
      <Card>
        <CardHeader>
          <CardTitle className="text-md font-semibold">Fluxo de Caixa Mensal</CardTitle>
        </CardHeader>
        <CardContent className="h-[200px]" style={chartStyle}>
          <ResponsiveContainer width="100%" height="100%" minWidth={50} minHeight={50}>
            <BarChart
              data={[{ name: 'Fluxo Mensal', value: extractedData.monthlyCashFlow }]}
              margin={{ top: 20, right: 30, left: 30, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={formatCurrencyValue} domain={[0, 'auto']} />
              <Tooltip formatter={(value) => [`R$ ${Number(value).toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, 'Valor']} />
              <Bar dataKey="value" fill="#0088FE" animationDuration={500} isAnimationActive={false} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Receita vs Despesas */}
      <Card>
        <CardHeader>
          <CardTitle className="text-md font-semibold">Receita vs Despesas Mensais</CardTitle>
        </CardHeader>
        <CardContent className="h-[200px]" style={chartStyle}>
          <ResponsiveContainer width="100%" height="100%" minWidth={50} minHeight={50}>
            <BarChart
              data={incomeExpenseData}
              margin={{ top: 20, right: 30, left: 30, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={formatCurrencyValue} domain={[0, 'auto']} />
              <Tooltip formatter={(value) => [`R$ ${Number(value).toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, 'Valor']} />
              <Bar dataKey="value" animationDuration={500} isAnimationActive={false}>
                {incomeExpenseData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? '#00C49F' : '#FF8042'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* ROI Comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="text-md font-semibold">ROI Comparativo (% ao ano)</CardTitle>
        </CardHeader>
        <CardContent className="h-[200px]" style={chartStyle}>
          <ResponsiveContainer width="100%" height="100%" minWidth={50} minHeight={50}>
            <BarChart
              data={roiComparisonData}
              margin={{ top: 20, right: 30, left: 30, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={formatPercentage} domain={[0, 'auto']} />
              <Tooltip formatter={formatTooltipValue} />
              <Bar dataKey="roi" fill="#00C49F" animationDuration={500} isAnimationActive={false} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 5-Year Projection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-md font-semibold">Projeção de Retorno (5 anos)</CardTitle>
        </CardHeader>
        <CardContent className="h-[200px]" style={chartStyle}>
          <ResponsiveContainer width="100%" height="100%" minWidth={50} minHeight={50}>
            <LineChart
              data={projectionData}
              margin={{ top: 20, right: 30, left: 30, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis tickFormatter={formatCurrencyValue} domain={[0, 'auto']} />
              <Tooltip formatter={(value) => [formatCurrencyValue(Number(value)), 'Retorno Acumulado']} />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#8884d8" 
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                animationDuration={500}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Expenses Breakdown - using the simplified component to avoid cuts in PDF */}
      <Card>
        <CardHeader>
          <CardTitle className="text-md font-semibold">Despesas</CardTitle>
        </CardHeader>
        <CardContent className="h-[200px]" style={chartStyle}>
          <SimpleExpensesPieChart expenses={extractedData.expenses} />
        </CardContent>
      </Card>
    </div>
  );
};

export default ROICharts; 