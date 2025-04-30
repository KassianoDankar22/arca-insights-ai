
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { motion } from 'framer-motion';

// Dados simulados para o gráfico
const data = [
  { month: 'Jan', Miami: 180, Orlando: 150 },
  { month: 'Fev', Miami: 200, Orlando: 170 },
  { month: 'Mar', Miami: 190, Orlando: 190 },
  { month: 'Abr', Miami: 240, Orlando: 220 },
  { month: 'Mai', Miami: 280, Orlando: 250 },
  { month: 'Jun', Miami: 310, Orlando: 270 },
  { month: 'Jul', Miami: 290, Orlando: 290 },
  { month: 'Ago', Miami: 340, Orlando: 320 },
  { month: 'Set', Miami: 320, Orlando: 310 },
  { month: 'Out', Miami: 360, Orlando: 340 },
  { month: 'Nov', Miami: 350, Orlando: 350 },
  { month: 'Dez', Miami: 390, Orlando: 380 },
];

// Métricas de resumo
const summaryMetrics = [
  { label: 'Imóveis', value: '1.2k', change: '+12%' },
  { label: 'Rentabilidade', value: '8.2%', change: '+0.5%' },
  { label: 'Valorização', value: '5.3%', change: '+0.8%' },
];

const MarketOverview: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="shadow-sm border h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-bold flex justify-between items-center">
            <span>Visão do Mercado</span>
            <span className="text-xs text-arca-blue bg-blue-50 py-1 px-2 rounded-full">
              +4% em 2024
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Resumo de métricas */}
          <div className="flex justify-between mb-6 mt-2">
            {summaryMetrics.map((metric, index) => (
              <div key={index} className="text-center">
                <p className="text-sm text-gray-600">{metric.label}</p>
                <p className="text-xl font-bold">{metric.value}</p>
                <p className="text-xs text-green-600">{metric.change}</p>
              </div>
            ))}
          </div>

          {/* Gráfico */}
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    border: 'none'
                  }} 
                  labelStyle={{ fontWeight: 'bold' }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="Orlando"
                  stroke="#9b87f5"
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="Miami"
                  stroke="#1EAEDB"
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MarketOverview;
