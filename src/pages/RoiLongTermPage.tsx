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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, ArrowUpRight } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const RoiLongTermPage = () => {
  const isMobile = useIsMobile();
  
  // Dados de exemplo para simulação de valorização a longo prazo
  const projectionData = [
    { ano: '2025', base: 550000, otimista: 580000, pessimista: 520000 },
    { ano: '2026', base: 577500, otimista: 638000, pessimista: 530400 },
    { ano: '2027', base: 606375, otimista: 701800, pessimista: 541008 },
    { ano: '2028', base: 636694, otimista: 771980, pessimista: 551828 },
    { ano: '2029', base: 668528, otimista: 849178, pessimista: 562865 },
    { ano: '2030', base: 701955, otimista: 934096, pessimista: 574122 },
    { ano: '2031', base: 737052, otimista: 1027505, pessimista: 585605 },
    { ano: '2032', base: 773905, otimista: 1130256, pessimista: 597317 },
    { ano: '2033', base: 812600, otimista: 1243281, pessimista: 609263 },
    { ano: '2034', base: 853230, otimista: 1367610, pessimista: 621448 },
  ];

  // For mobile, show less data points
  const mobileProjectionData = isMobile ? 
    projectionData.filter((_, index) => index % 2 === 0) : 
    projectionData;

  return (
    <div className={`${isMobile ? 'p-3' : 'p-4'} max-w-5xl mx-auto`}>
      <h2 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold mb-6 flex items-center`}>
        <TrendingUp className="mr-2" />
        ROI a Longo Prazo
      </h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className={isMobile ? 'px-4 py-3' : ''}>
            <CardTitle className={isMobile ? 'text-lg' : ''}>Projeção de Valorização</CardTitle>
          </CardHeader>
          <CardContent className={isMobile ? 'px-2 py-1' : ''}>
            <div className={`${isMobile ? 'h-60' : 'h-80'}`}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart 
                  data={mobileProjectionData} 
                  margin={{ 
                    top: 5, 
                    right: isMobile ? 10 : 30, 
                    left: isMobile ? 0 : 20, 
                    bottom: 5 
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="ano" tick={{ fontSize: isMobile ? 10 : 12 }} />
                  <YAxis tick={{ fontSize: isMobile ? 10 : 12 }} />
                  <Tooltip formatter={(value) => `R$ ${value.toLocaleString()}`} />
                  <Legend wrapperStyle={{ fontSize: isMobile ? 10 : 12 }} />
                  <Line 
                    type="monotone" 
                    dataKey="pessimista" 
                    name="Cenário Pessimista" 
                    stroke="#ff8042" 
                    strokeDasharray="5 5"
                    strokeWidth={isMobile ? 1 : 2}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="base" 
                    name="Cenário Base" 
                    stroke="#9b87f5" 
                    activeDot={{ r: isMobile ? 6 : 8 }} 
                    strokeWidth={isMobile ? 1 : 2}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="otimista" 
                    name="Cenário Otimista" 
                    stroke="#00c49f"
                    strokeWidth={isMobile ? 1 : 2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className={isMobile ? 'px-4 py-3' : ''}>
            <CardTitle className={isMobile ? 'text-lg' : ''}>Simulação</CardTitle>
          </CardHeader>
          <CardContent className={isMobile ? 'px-4 py-2' : ''}>
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="valorInicial" className="text-sm font-medium">
                  Valor Inicial (R$)
                </label>
                <Input id="valorInicial" type="number" defaultValue="500000" className={isMobile ? 'h-10 text-sm' : ''} />
              </div>
              <div className="space-y-2">
                <label htmlFor="periodo" className="text-sm font-medium">
                  Período (anos)
                </label>
                <Input id="periodo" type="number" min="1" max="30" defaultValue="10" className={isMobile ? 'h-10 text-sm' : ''} />
              </div>
              <div className="space-y-2">
                <label htmlFor="taxaBase" className="text-sm font-medium">
                  Taxa de Valorização Base (% a.a.)
                </label>
                <Input id="taxaBase" type="number" step="0.1" defaultValue="5.0" className={isMobile ? 'h-10 text-sm' : ''} />
              </div>
              <Button 
                className={`w-full bg-arca-purple hover:bg-arca-dark-purple ${isMobile ? 'py-2 text-sm' : ''}`}
              >
                Calcular Projeção
              </Button>
            </div>
            
            <div className="mt-6 bg-arca-soft-purple p-4 rounded-lg">
              <h3 className="font-medium mb-2 flex items-center">
                <ArrowUpRight className="mr-1" size={16} />
                Retorno Estimado (10 anos)
              </h3>
              <p className="text-3xl font-bold text-arca-purple">70.4%</p>
              <p className="text-sm text-gray-600 mt-2">Valor futuro estimado: R$ 853.230,00</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-3">
          <CardHeader className={isMobile ? 'px-4 py-3' : ''}>
            <CardTitle className={isMobile ? 'text-lg' : ''}>Análise de Fatores de Longo Prazo</CardTitle>
          </CardHeader>
          <CardContent className={isMobile ? 'px-4 py-2' : ''}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className={`font-medium ${isMobile ? 'text-base' : 'text-lg'} mb-2`}>Fatores Econômicos</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li className="flex items-center">
                    <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                    Taxa de juros em tendência de queda
                  </li>
                  <li className="flex items-center">
                    <span className="h-2 w-2 rounded-full bg-yellow-500 mr-2"></span>
                    PIB com projeção de crescimento moderado
                  </li>
                  <li className="flex items-center">
                    <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                    Inflação controlada no longo prazo
                  </li>
                </ul>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className={`font-medium ${isMobile ? 'text-base' : 'text-lg'} mb-2`}>Desenvolvimento Urbano</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li className="flex items-center">
                    <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                    Novos projetos de mobilidade previstos
                  </li>
                  <li className="flex items-center">
                    <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                    Expansão de áreas comerciais na região
                  </li>
                  <li className="flex items-center">
                    <span className="h-2 w-2 rounded-full bg-blue-500 mr-2"></span>
                    Revitalização de bairros adjacentes
                  </li>
                </ul>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className={`font-medium ${isMobile ? 'text-base' : 'text-lg'} mb-2`}>Perfil Demográfico</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li className="flex items-center">
                    <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                    Aumento da população jovem na região
                  </li>
                  <li className="flex items-center">
                    <span className="h-2 w-2 rounded-full bg-blue-500 mr-2"></span>
                    Crescimento de famílias com renda média-alta
                  </li>
                  <li className="flex items-center">
                    <span className="h-2 w-2 rounded-full bg-yellow-500 mr-2"></span>
                    Tendência estável de procura por imóveis
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="mt-6 bg-gray-50 p-4 rounded-lg">
              <h3 className={`font-medium ${isMobile ? 'text-base' : 'text-lg'} mb-2`}>Análise IA</h3>
              <p className={`text-gray-700 ${isMobile ? 'text-sm' : ''}`}>
                Com base nos dados históricos e projeções econômicas para a região, este imóvel apresenta um potencial de valorização acima da média do mercado nacional. A combinação de novos projetos de infraestrutura urbana e o perfil demográfico crescente da região sugere uma demanda sustentada a longo prazo. O cenário base projeta uma valorização anual de 5%, resultando em um retorno total de 70.4% em 10 anos.
              </p>
              <p className={`mt-2 text-gray-700 ${isMobile ? 'text-sm' : ''}`}>
                Recomenda-se considerar este imóvel como um investimento de longo prazo, especialmente se houver capacidade para mantê-lo por pelo menos 5 anos, quando o retorno começa a se acentuar devido ao efeito dos juros compostos na valorização.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RoiLongTermPage;
