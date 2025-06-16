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
import { BarChart2, TrendingUp, CircleDollarSign, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import CurrencyWidget from './CurrencyWidget';
import { useRealEstateData } from '@/hooks/useRealEstateData';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';

// Componente de card para métricas individuais
interface MetricCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  change?: string;
  isPositive?: boolean;
  color?: string;
  isLoading?: boolean;
  historicalData?: {name: string, value: number}[];
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  icon, 
  title, 
  value, 
  change, 
  isPositive = true, 
  color = 'bg-arca-purple', 
  isLoading = false,
  historicalData 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <Card className="overflow-hidden border shadow-sm h-full">
        <div className="p-4 flex flex-col justify-between h-full">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-600 mb-1">{title}</p>
              {isLoading ? (
                <div className="h-8 bg-gray-200 rounded animate-pulse w-24 mb-1" />
              ) : (
                <h3 className="text-2xl font-bold">{value}</h3>
              )}
            </div>
            <div className={`p-2 rounded-full ${color} bg-opacity-15`}>
              {React.cloneElement(icon as React.ReactElement, { size: 20 })}
            </div>
          </div>
          {change && !isLoading && (
            <p className={`text-xs ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {isPositive ? '↑' : '↓'} {change}
            </p>
          )}
          {historicalData && !isLoading && (
            <div className="h-16 mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historicalData}>
                  <YAxis hide domain={['dataMin - 0.5', 'dataMax + 0.5']} />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke={isPositive ? "#10B981" : "#EF4444"}
                    strokeWidth={2} 
                    dot={false} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

const DashboardMetrics: React.FC = () => {
  // Animation stagger effect for cards
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Usar o hook para obter dados reais
  const { 
    averageRoi, 
    roiChange, 
    opportunities, 
    opportunitiesChange, 
    averagePrice, 
    priceChange, 
    isLoading 
  } = useRealEstateData();

  // Dados simulados para o gráfico do ROI Médio
  const roiHistoricalExample = [
    { name: 'D1', value: 8.2 },
    { name: 'D2', value: 8.4 },
    { name: 'D3', value: 8.3 },
    { name: 'D4', value: 8.5 },
    { name: 'D5', value: 8.6 },
    { name: 'D6', value: 8.8 },
    { name: 'D7', value: averageRoi },
  ];

  // Dados simulados para o gráfico de Oportunidades
  const opportunitiesHistoricalExample = [
    { name: 'D1', value: opportunities - opportunitiesChange - 2 },
    { name: 'D2', value: opportunities - opportunitiesChange - 1 },
    { name: 'D3', value: opportunities - opportunitiesChange + 1 }, 
    { name: 'D4', value: opportunities - opportunitiesChange },
    { name: 'D5', value: opportunities - 2 },
    { name: 'D6', value: opportunities - 1 },
    { name: 'D7', value: opportunities },
  ];

  // Dados simulados para o gráfico de Preço Médio
  const priceHistoricalExample = [
    { name: 'D1', value: averagePrice * 0.98 }, 
    { name: 'D2', value: averagePrice * 0.99 },
    { name: 'D3', value: averagePrice * 0.985 },
    { name: 'D4', value: averagePrice * 1.00 },
    { name: 'D5', value: averagePrice * 1.01 },
    { name: 'D6', value: averagePrice * 1.005 },
    { name: 'D7', value: averagePrice },
  ];

  // Formatador para valores monetários em dólares
  const formatCurrency = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });

  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <MetricCard 
        icon={<BarChart2 className="text-arca-purple" />}
        title="ROI Médio" 
        value={`${averageRoi}%`} 
        change={`${roiChange}%`}
        isPositive={roiChange > 0}
        color="bg-arca-purple"
        isLoading={isLoading}
        historicalData={roiHistoricalExample}
      />
      <MetricCard 
        icon={<Users className="text-arca-blue" />} 
        title="Oportunidades" 
        value={`${opportunities}`} 
        change={`${opportunitiesChange}`}
        isPositive={opportunitiesChange > 0}
        color="bg-arca-blue"
        isLoading={isLoading}
        historicalData={opportunitiesHistoricalExample}
      />
      <MetricCard 
        icon={<CircleDollarSign className="text-green-600" />} 
        title="Preço Médio" 
        value={isLoading ? '...' : formatCurrency.format(averagePrice)} 
        change={`${priceChange}%`}
        isPositive={priceChange > 0}
        color="bg-green-100"
        isLoading={isLoading}
        historicalData={priceHistoricalExample}
      />
      <CurrencyWidget />
    </motion.div>
  );
};

export default DashboardMetrics;
