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
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DataPanelProps {
  isVisible: boolean;
}

const DataPanel: React.FC<DataPanelProps> = ({ isVisible }) => {
  const roiData = [
    { mes: 'Jan', roi: 1.2 },
    { mes: 'Fev', roi: 1.5 },
    { mes: 'Mar', roi: 1.3 },
    { mes: 'Abr', roi: 1.8 },
    { mes: 'Mai', roi: 2.1 },
    { mes: 'Jun', roi: 1.9 },
    { mes: 'Jul', roi: 2.3 },
    { mes: 'Ago', roi: 2.5 },
    { mes: 'Set', roi: 2.7 },
    { mes: 'Out', roi: 3.0 },
    { mes: 'Nov', roi: 2.8 },
    { mes: 'Dez', roi: 3.2 },
  ];

  const tendenciaRegional = [
    { regiao: 'Zona Sul', crescimento: 5.2 },
    { regiao: 'Centro', crescimento: 3.8 },
    { regiao: 'Zona Oeste', crescimento: 7.3 },
    { regiao: 'Zona Norte', crescimento: 4.5 },
    { regiao: 'Região Metropolitana', crescimento: 6.8 },
  ];

  if (!isVisible) return null;

  return (
    <div className="w-96 border-l border-gray-200 h-full overflow-y-auto p-4 bg-gray-50">
      <h2 className="text-xl font-semibold mb-4">Análise de Dados</h2>
      
      <Card className="mb-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">ROI Projetado (12 meses)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={roiData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Area type="monotone" dataKey="roi" stroke="#9b87f5" fill="#9b87f5" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <Card className="mb-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Tendência de Valorização por Região</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={tendenciaRegional} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="regiao" tick={{ fontSize: 9 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="crescimento" fill="#1EAEDB" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <Card className="mb-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Resumo da Análise</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-sm space-y-2">
            <li className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green-500"></span>
              <span>ROI projetado de 3.2% para Dezembro</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-500"></span>
              <span>Zona Oeste com maior potencial de valorização</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-yellow-500"></span>
              <span>Crescimento médio do mercado de 5.5%</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataPanel;
