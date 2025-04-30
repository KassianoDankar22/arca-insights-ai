
import React from 'react';
import { motion } from 'framer-motion';
import AIAgentCard, { AIAgentProps } from '@/components/tools/AIAgentCard';

// These would eventually come from a backend API or admin panel
const aiAgents: AIAgentProps[] = [
  {
    id: 'roi-short-term',
    name: 'Tom - Análise de ROI',
    description: 'Avalia rapidamente o retorno sobre investimento de propriedades destinadas a locações de curto prazo, considerando fatores como ocupação, sazonalidade e custos. Ajuda o corretor a identificar as melhores oportunidades sem precisar de cálculos complexos.',
    icon: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
    route: '/roi-curto-prazo',
    isNew: true
  },
  {
    id: 'roi-long-term',
    name: 'Ana - ROI Longo Prazo',
    description: 'Especialista em análise de retorno sobre investimento para propriedades de longo prazo, considerando valorização imobiliária, custos de manutenção e tendências de mercado ao longo do tempo.',
    icon: 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1',
    route: '/roi-longo-prazo'
  },
  {
    id: 'market-trends',
    name: 'Lucas - Tendências de Mercado',
    description: 'Acompanha e analisa as principais tendências do mercado imobiliário, oferecendo insights valiosos sobre direções futuras, áreas em desenvolvimento e oportunidades emergentes.',
    icon: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901',
    route: '/tendencias',
    isHighlight: true
  }
];

const ToolsPage: React.FC = () => {
  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              <span className="bg-gradient-to-r from-arca-light-blue via-arca-blue to-arca-dark-blue bg-clip-text text-transparent">
                ARCA AI Tools
              </span>
            </h1>
            <p className="text-gray-600 max-w-2xl">
              Maximize seu potencial com nossas ferramentas de IA especialmente desenvolvidas para o mercado imobiliário. Analise, planeje e tome decisões melhores.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {aiAgents.map((agent) => (
            <AIAgentCard
              key={agent.id}
              {...agent}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default ToolsPage;
