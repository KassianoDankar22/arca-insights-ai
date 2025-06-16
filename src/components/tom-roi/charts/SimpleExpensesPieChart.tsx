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
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

interface SimpleExpensesPieChartProps {
  expenses: Array<{ name: string; value: number }>;
}

// Cores para categorias de despesas
const COLORS = [
  '#0088FE', // Admin
  '#00C49F', // HOA
  '#FFBB28', // Energia
  '#FF8042', // Água
  '#8884d8', // Imposto
  '#82ca9d', // Seguro
  '#ffc658'  // Outros/Piscina
];

// Mapeamento de nomes de despesas para versões mais amigáveis
const expenseNameMap: Record<string, string> = {
  "ADMIN": "Administração",
  "HOA": "Condomínio",
  "ENERGIA": "Energia",
  "ÁGUA": "Água",
  "IMPOSTO": "Imposto",
  "SEGURO": "Seguro",
  "PISCINA": "Piscina"
};

const SimpleExpensesPieChart: React.FC<SimpleExpensesPieChartProps> = ({ expenses }) => {
  // Filtrar apenas despesas com valores positivos
  const validExpenses = expenses.filter(item => item.value > 0);
  
  // Se não houver despesas válidas, exibir mensagem
  if (validExpenses.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500 text-sm">Não há dados de despesas disponíveis</p>
      </div>
    );
  }

  // Preparar dados para o gráfico, com nomes amigáveis
  const chartData = validExpenses.map(item => ({
    name: expenseNameMap[item.name] || item.name,
    value: item.value
  }));

  // Dimensões mínimas para resolver erros de renderização
  const chartStyle = { 
    width: '100%', 
    height: '100%',
    minWidth: '200px',
    minHeight: '180px'
  };

  // Callback para formatar valores no Legend
  const formatLegendValue = (value: any, entry: any) => {
    const formatter = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
    
    // Encontrar o item correspondente nos dados
    const item = chartData.find(item => item.name === entry.name);
    if (item) {
      return `${entry.name}: ${formatter.format(item.value)}`;
    }
    return entry.name;
  };

  return (
    <div style={chartStyle}>
      <ResponsiveContainer width="100%" height="100%" minWidth={50} minHeight={50}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={45}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
            animationDuration={1000}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            labelLine={false}
          >
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[index % COLORS.length]} 
              />
            ))}
          </Pie>
          <Legend 
            formatter={formatLegendValue}
            layout="vertical" 
            verticalAlign="middle" 
            align="right"
            wrapperStyle={{ fontSize: '10px' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SimpleExpensesPieChart; 