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

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ServiceAgentCard, { ServiceAgentProps } from '@/components/tools/ServiceAgentCard';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Dados dos agentes de serviço. Idealmente, viriam de uma API ou CMS.
const serviceAgents: ServiceAgentProps[] = [
  {
    id: 'tom-roi',
    title: 'Tom - Análise de ROI',
    category: 'Análise de ROI',
    description: 'Analise o ROI de imóveis para locação de curto prazo e identifique as melhores oportunidades.',
    avatarUrl: '/img/tom-avatar.jpg',
    route: '/analise/tom',
    tags: ['Curto Prazo', 'Imóveis', 'Novo!']
  },
  {
    id: 'ana-roi-long-term',
    title: 'Ana - ROI Longo Prazo',
    category: 'Análise de ROI',
    description: 'Calcule o ROI de propriedades a longo prazo, considerando valorização e custos.',
    avatarUrl: 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1',
    route: '/roi-longo-prazo',
    tags: ['Longo Prazo', 'Investimento']
  },
  {
    id: 'lucas-market-trends',
    title: 'Lucas - Tendências de Mercado',
    category: 'Inteligência de Mercado',
    description: 'Descubra tendências, áreas promissoras e oportunidades no mercado imobiliário.',
    avatarUrl: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901',
    route: '/tendencias',
    tags: ['Insights', 'Premium'],
  }
];

/**
 * Componente ToolsPage
 * 
 * Renderiza a página principal de ferramentas/agentes de IA.
 * Apresenta um título, uma lista de agentes filtráveis por categoria (usando abas)
 * e exibe os cards dos agentes usando o componente ServiceAgentCard.
 * Utiliza framer-motion para animações de entrada.
 */
const ToolsPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  
  // Extrai categorias únicas dos agentes e adiciona "Todas" para o filtro inicial.
  const categories = ['Todas', ...new Set(serviceAgents.map(agent => agent.category))];

  // Filtra os agentes a serem exibidos com base na categoria selecionada.
  const filteredAgents = selectedCategory === 'Todas' 
    ? serviceAgents 
    : serviceAgents.filter(agent => agent.category === selectedCategory);

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="has-dot-pattern-background relative z-0 p-4 md:p-6 rounded-lg"
      >
        <div className="relative z-10">
          <div className="flex flex-col text-center items-center mb-8 md:mb-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">
              <span className="bg-gradient-to-r from-arca-light-blue via-arca-blue to-arca-dark-blue bg-clip-text text-transparent">
                ARCA AI Tools
              </span>
            </h1>
            <p className="text-xl md:text-2xl font-semibold text-gray-700 dark:text-gray-200 mt-1 mb-3">
              Nossos Agentes Especialistas do Mercado Imobiliário
            </p>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl text-sm md:text-base">
              Explore nossos agentes especializados para diversas necessidades do mercado imobiliário.
            </p>
          </div>

          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-6 md:mb-8 flex justify-center">
            <TabsList>
              {categories.map(category => (
                <TabsTrigger key={category} value={category}>
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {filteredAgents.map((agent) => (
              <ServiceAgentCard
                key={agent.id}
                {...agent}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ToolsPage;
