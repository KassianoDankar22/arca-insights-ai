
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp } from 'lucide-react';

const MarketTrends: React.FC = () => {
  // Dados de exemplo para os gráficos
  const priceData = [
    { mes: 'Jan', residencial: 7500, comercial: 5800 },
    { mes: 'Fev', residencial: 7600, comercial: 5750 },
    { mes: 'Mar', residencial: 7650, comercial: 5900 },
    { mes: 'Abr', residencial: 7800, comercial: 6000 },
    { mes: 'Mai', residencial: 7950, comercial: 6050 },
    { mes: 'Jun', residencial: 8100, comercial: 6100 },
    { mes: 'Jul', residencial: 8200, comercial: 6150 },
    { mes: 'Ago', residencial: 8350, comercial: 6200 },
    { mes: 'Set', residencial: 8500, comercial: 6300 },
    { mes: 'Out', residencial: 8650, comercial: 6400 },
    { mes: 'Nov', residencial: 8700, comercial: 6450 },
    { mes: 'Dez', residencial: 8850, comercial: 6500 },
  ];

  const regionData = [
    { nome: 'Centro', valorizacao: 5.3 },
    { nome: 'Zona Sul', valorizacao: 7.8 },
    { nome: 'Zona Norte', valorizacao: 4.5 },
    { nome: 'Zona Oeste', valorizacao: 6.2 },
    { nome: 'Grande São Paulo', valorizacao: 3.9 },
  ];

  const marketInsights = [
    {
      title: "Mercado Residencial",
      description: "O mercado residencial continua mostrando crescimento constante, com valorização média de 6.5% nos últimos 12 meses. Apartamentos de 2 quartos em áreas centrais apresentam a maior demanda."
    },
    {
      title: "Mercado Comercial",
      description: "Espaços comerciais estão se recuperando lentamente após a pandemia. Há uma tendência de valorização em escritórios menores e mais versáteis, adaptados ao trabalho híbrido."
    },
    {
      title: "Locação",
      description: "O mercado de locação residencial está aquecido, com média de ocupação superior a 92%. A demanda por imóveis mobiliados aumentou 15% no último semestre."
    },
  ];

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 flex items-center">
        <TrendingUp className="mr-2" />
        Tendências do Mercado
      </h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Evolução de Preços por m²</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={priceData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip formatter={(value) => `R$ ${value}/m²`} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="residencial" 
                    name="Residencial" 
                    stroke="#9b87f5" 
                    activeDot={{ r: 8 }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="comercial" 
                    name="Comercial" 
                    stroke="#1EAEDB" 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Valorização por Região (% em 12 meses)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={regionData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="nome" />
                  <YAxis />
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Legend />
                  <Bar 
                    dataKey="valorizacao" 
                    name="Valorização" 
                    fill="#7E69AB" 
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Insights do Mercado</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {marketInsights.map((insight, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-lg mb-2">{insight.title}</h3>
                <p className="text-gray-600 text-sm">{insight.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 bg-arca-soft-purple p-4 rounded-lg">
            <h3 className="font-medium text-lg mb-2">Análise IA</h3>
            <p className="text-gray-700">
              Baseado nas tendências atuais, o mercado imobiliário está em uma fase de crescimento moderado. Imóveis residenciais na Zona Sul apresentam o melhor potencial de valorização a curto prazo. Para investidores com perfil de risco mais conservador, o Centro continua sendo uma opção estável, com demanda consistente e menor volatilidade de preços.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MarketTrends;
