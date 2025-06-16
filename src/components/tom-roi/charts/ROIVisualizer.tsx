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
import { 
  DollarSign, 
  TrendingUp, 
  Home, 
  Calendar, 
  ArrowDownRight, 
  ArrowUpRight, 
  PiggyBank,
  CircleDollarSign,
  BadgeDollarSign,
  Building,
  Droplets,
  Lightbulb,
  Shield,
  CreditCard,
  BadgePercent,
  Star
} from 'lucide-react';

interface ROIVisualizerProps {
  propertyData: {
    propertyValue: number;
    rentalIncome: {
      monthly: number;
      annual: number;
    };
    financing: {
      downPayment: {
        amount: number;
        percentage: number;
      };
      monthlyPayment: number;
      annualPayment: number;
      interestRate: number;
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
    };
    appreciation: {
      percentage: number;
      amount: number;
    };
    totalAnnualReturn: number;
  };
  formatCurrency?: (value: number | string | undefined, options?: { showCents?: boolean, abbreviate?: boolean }) => string;
}

const ROIVisualizer: React.FC<ROIVisualizerProps> = ({ 
  propertyData,
  formatCurrency
}) => {
  // Formatar valores monetários
  const formatCurrencyValue = (value: number) => {
    if (formatCurrency) {
      return formatCurrency(value, { showCents: true });
    }
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2 
    }).format(value);
  };

  const getIconForExpense = (name: string) => {
    switch (name.toLowerCase()) {
      case 'administração':
        return <Building size={18} />;
      case 'condomínio':
      case 'hoa':
        return <Home size={18} />;
      case 'iptu':
        return <CreditCard size={18} />;
      case 'água':
        return <Droplets size={18} />;
      case 'energia':
        return <Lightbulb size={18} />;
      case 'seguro':
        return <Shield size={18} />;
      default:
        return <CircleDollarSign size={18} />;
    }
  };

  // Imagem de alta qualidade para a propriedade moderna
  const modernHouseImage = 'https://images.unsplash.com/photo-1523217582562-09d0def993a6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1080&q=80';

  return (
    <div className="space-y-8">
      {/* Preço e Detalhes da Propriedade com Imagem */}
      <Card className="bg-white border border-gray-200 shadow-lg overflow-hidden rounded-xl">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/2 relative">
            <img 
              src={modernHouseImage} 
              alt="Townhomes Deluxe" 
              className="h-full w-full object-cover aspect-video md:aspect-auto" 
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent h-24">
              <div className="absolute bottom-4 left-4">
                <div className="bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-sm font-medium inline-flex items-center">
                  <Star size={14} className="text-yellow-500 fill-yellow-500 mr-1" />
                  <span>Premium Property</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-2 px-2 md:absolute md:bottom-14 md:right-4 md:px-0 md:mt-0">
              <div className="w-16 h-12 rounded-lg overflow-hidden relative cursor-pointer shadow-md hover:shadow-lg transition-all transform hover:scale-105">
                <img src="https://images.unsplash.com/photo-1560448205-4d9b3e6bb6db?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTd8fGJlZHJvb218ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60" 
                     alt="Quarto" 
                     className="w-full h-full object-cover" 
                />
                <div className="absolute inset-0 bg-black/30 hover:bg-black/10 transition-all"></div>
              </div>
              <div className="w-16 h-12 rounded-lg overflow-hidden relative cursor-pointer shadow-md hover:shadow-lg transition-all transform hover:scale-105">
                <img src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8YmF0aHJvb218ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60" 
                     alt="Banheiro" 
                     className="w-full h-full object-cover" 
                />
                <div className="absolute inset-0 bg-black/30 hover:bg-black/10 transition-all"></div>
              </div>
              <div className="w-16 h-12 rounded-lg overflow-hidden relative cursor-pointer shadow-md hover:shadow-lg transition-all transform hover:scale-105">
                <img src="https://images.unsplash.com/photo-1583845112203-29329902332e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8bGl2aW5nJTIwcm9vbXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60" 
                     alt="Sala" 
                     className="w-full h-full object-cover" 
                />
                <div className="absolute inset-0 bg-black/30 hover:bg-black/10 transition-all"></div>
              </div>
            </div>
          </div>
          <div className="md:w-1/2 p-5">
            <div className="flex items-center mb-3">
              <Home className="h-6 w-6 mr-2 text-gray-700" />
              <h3 className="text-xl font-medium text-gray-800">Townhomes Deluxe</h3>
              <div className="flex ml-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} size={14} className="text-yellow-400 fill-yellow-400" />
                ))}
              </div>
            </div>
            <div className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs inline-block mb-4 font-medium">
              3 suítes
            </div>
            <div className="flex items-center mt-4">
              <p className="text-gray-500 text-sm">A partir de</p>
              <p className="text-3xl font-bold ml-2 text-gray-800">{formatCurrencyValue(propertyData.propertyValue)}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Rendimento do Aluguel */}
      <div>
        <div className="flex mb-2 items-center">
          <div className="w-1 h-6 bg-green-500 mr-2"></div>
          <h3 className="text-lg font-medium text-gray-800 uppercase">Rendimento do Aluguel</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-white border border-gray-200 shadow-sm rounded-lg">
            <CardContent className="p-4">
              <div className="flex items-center mb-2">
                <Calendar size={18} className="text-gray-500 mr-2" />
                <span className="text-sm text-gray-500">Rendimento Mensal</span>
              </div>
              <div className="flex items-center">
                <DollarSign size={20} className="text-green-500" />
                <span className="text-xl font-semibold text-gray-800">{formatCurrencyValue(propertyData.rentalIncome.monthly)}</span>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border border-gray-200 shadow-sm rounded-lg">
            <CardContent className="p-4">
              <div className="flex items-center mb-2">
                <Calendar size={18} className="text-gray-500 mr-2" />
                <span className="text-sm text-gray-500">Rendimento Anual</span>
              </div>
              <div className="flex items-center">
                <DollarSign size={20} className="text-green-500" />
                <span className="text-xl font-semibold text-gray-800">{formatCurrencyValue(propertyData.rentalIncome.annual)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Simulação de Financiamento */}
      <div>
        <div className="flex mb-2 items-center">
          <div className="w-1 h-6 bg-blue-500 mr-2"></div>
          <h3 className="text-lg font-medium text-gray-800 uppercase">Simulação Financiamento</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-white border border-gray-200 shadow-sm rounded-lg">
            <CardContent className="p-4">
              <div className="flex items-center mb-2">
                <ArrowDownRight size={18} className="text-gray-500 mr-2" />
                <span className="text-sm text-gray-500">Entrada</span>
              </div>
              <div className="flex items-center">
                <span className="text-2xl font-semibold text-gray-800">{propertyData.financing.downPayment.percentage}%</span>
                <span className="text-lg ml-2 text-gray-500">{formatCurrencyValue(propertyData.financing.downPayment.amount)}</span>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border border-gray-200 shadow-sm rounded-lg">
            <CardContent className="p-4">
              <div className="flex items-center mb-2">
                <TrendingUp size={18} className="text-gray-500 mr-2" />
                <span className="text-sm text-gray-500">Juros</span>
              </div>
              <div className="flex items-center">
                <span className="text-2xl font-semibold text-gray-800">{propertyData.financing.interestRate}%</span>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <Card className="bg-white border border-gray-200 shadow-sm rounded-lg">
            <CardContent className="p-4">
              <div className="flex items-center mb-2">
                <Calendar size={18} className="text-gray-500 mr-2" />
                <span className="text-sm text-gray-500">Valor da Parcela Mensal</span>
              </div>
              <div className="flex items-center">
                <ArrowUpRight size={20} className="text-red-500" />
                <span className="text-xl font-semibold text-gray-800">-{formatCurrencyValue(propertyData.financing.monthlyPayment)}</span>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border border-gray-200 shadow-sm rounded-lg">
            <CardContent className="p-4">
              <div className="flex items-center mb-2">
                <Calendar size={18} className="text-gray-500 mr-2" />
                <span className="text-sm text-gray-500">Valor da Parcela Anual</span>
              </div>
              <div className="flex items-center">
                <ArrowUpRight size={20} className="text-red-500" />
                <span className="text-xl font-semibold text-gray-800">-{formatCurrencyValue(propertyData.financing.annualPayment)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Despesas da Propriedade */}
      <div>
        <div className="flex mb-2 items-center">
          <div className="w-1 h-6 bg-orange-500 mr-2"></div>
          <h3 className="text-lg font-medium text-gray-800 uppercase">Despesas da Propriedade</h3>
        </div>
        
        {/* Grid para as despesas individuais - ajustado para garantir que tudo apareça na tela */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
          {propertyData.expenses.monthly.breakdown.map((expense, index) => (
            <Card key={index} className="bg-white border border-gray-200 shadow-sm rounded-lg">
              <CardContent className="p-3">
                <div className="flex items-center mb-1">
                  {getIconForExpense(expense.name)}
                  <span className="text-xs text-gray-500 ml-1 truncate">{expense.name}</span>
                </div>
                <span className="text-sm font-semibold text-gray-800">{formatCurrencyValue(expense.value)}</span>
                <div className="text-xs text-gray-400">Mensal</div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Totais de despesas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-white border border-gray-200 shadow-sm rounded-lg">
            <CardContent className="p-4">
              <div className="flex items-center mb-2">
                <Calendar size={18} className="text-gray-500 mr-2" />
                <span className="text-sm text-gray-500">Despesa mensal</span>
              </div>
              <div className="flex items-center">
                <ArrowUpRight size={20} className="text-red-500" />
                <span className="text-xl font-semibold text-gray-800">-{formatCurrencyValue(propertyData.expenses.monthly.total)}</span>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border border-gray-200 shadow-sm rounded-lg">
            <CardContent className="p-4">
              <div className="flex items-center mb-2">
                <Calendar size={18} className="text-gray-500 mr-2" />
                <span className="text-sm text-gray-500">Despesa Anual</span>
              </div>
              <div className="flex items-center">
                <ArrowUpRight size={20} className="text-red-500" />
                <span className="text-xl font-semibold text-gray-800">-{formatCurrencyValue(propertyData.expenses.annual)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Rendimento Abatendo o Financiamento */}
      <div>
        <div className="flex mb-2 items-center">
          <div className="w-1 h-6 bg-purple-500 mr-2"></div>
          <h3 className="text-lg font-medium text-gray-800 uppercase">Rendimento Abatendo o Financiamento</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-white border border-gray-200 shadow-sm rounded-lg">
            <CardContent className="p-4">
              <div className="flex items-center mb-2">
                <Calendar size={18} className="text-gray-500 mr-2" />
                <span className="text-sm text-gray-500">Rendimento Mensal</span>
              </div>
              <div className="flex items-center">
                <DollarSign size={20} className="text-green-500" />
                <span className="text-xl font-semibold text-green-600">+{formatCurrencyValue(propertyData.netIncome.monthly)}</span>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border border-gray-200 shadow-sm rounded-lg">
            <CardContent className="p-4">
              <div className="flex items-center mb-2">
                <Calendar size={18} className="text-gray-500 mr-2" />
                <span className="text-sm text-gray-500">Rendimento Anual</span>
              </div>
              <div className="flex items-center">
                <DollarSign size={20} className="text-green-500" />
                <span className="text-xl font-semibold text-green-600">+{formatCurrencyValue(propertyData.netIncome.annual)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Valorização e Total do Rendimento */}
      <div>
        <div className="flex mb-2 items-center">
          <div className="w-1 h-6 bg-teal-500 mr-2"></div>
          <h3 className="text-lg font-medium text-gray-800 uppercase">Valorização e Rendimento Total</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-white border border-gray-200 shadow-sm rounded-lg">
            <CardContent className="p-4">
              <div className="flex items-center mb-2">
                <BadgePercent size={18} className="text-gray-500 mr-2" />
                <span className="text-sm text-gray-500">Valorização anual</span>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center">
                  <span className="text-xl font-semibold text-gray-800">{propertyData.appreciation.percentage}%</span>
                </div>
                <div className="flex items-center">
                  <TrendingUp size={20} className="text-green-500 mr-2" />
                  <span className="text-xl font-semibold text-green-600">+{formatCurrencyValue(propertyData.appreciation.amount)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border border-gray-200 shadow-sm rounded-lg">
            <CardContent className="p-4">
              <div className="flex items-center mb-2">
                <PiggyBank size={18} className="text-gray-500 mr-2" />
                <span className="text-sm text-gray-500">Fluxo de caixa + Valorização</span>
              </div>
              <div className="flex items-center">
                <CircleDollarSign size={20} className="text-green-500 mr-2" />
                <span className="text-2xl font-bold text-green-600">+{formatCurrencyValue(propertyData.totalAnnualReturn)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ROIVisualizer; 