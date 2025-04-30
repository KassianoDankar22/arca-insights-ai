
import React from 'react';
import { motion } from 'framer-motion';
import AIAgentCard, { AIAgentProps } from '@/components/tools/AIAgentCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// These would eventually come from a backend API or admin panel
const aiAgents: AIAgentProps[] = [
  {
    id: 'roi-short-term',
    name: 'Tom - Análise de ROI',
    description: 'Avalia rapidamente o retorno sobre investimento de propriedades destinadas a locações de curto prazo, considerando fatores como ocupação, sazonalidade e custos. Ajuda o corretor a identificar as melhores oportunidades sem precisar de cálculos complexos.',
    icon: '/lovable-uploads/da65bc47-d9af-483b-b089-65947a0e2081.png',
    route: '/roi-curto-prazo',
    isNew: true
  },
  {
    id: 'roi-long-term',
    name: 'Ana - ROI Longo Prazo',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget ultricies aliquam, nunc nisl aliquet nunc, quis aliquam nisl nunc eu nisl.',
    icon: '/lovable-uploads/da65bc47-d9af-483b-b089-65947a0e2081.png',
    route: '/roi-longo-prazo'
  },
  {
    id: 'market-trends',
    name: 'Lucas - Tendências de Mercado',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget ultricies aliquam, nunc nisl aliquet nunc, quis aliquam nisl nunc eu nisl.',
    icon: '/lovable-uploads/da65bc47-d9af-483b-b089-65947a0e2081.png',
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Ferramentas de IA</h1>
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
        
        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle>Painel do Administrador</CardTitle>
              <CardDescription>
                No futuro, você poderá gerenciar todas as ferramentas diretamente pelo painel administrativo, 
                incluindo a criação de novos agentes, edição de configurações e análise de desempenho.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Funcionalidades planejadas:
              </p>
              <ul className="list-disc pl-5 mt-2 text-sm text-gray-600">
                <li>Criação de novos agentes de IA</li>
                <li>Personalização de prompts e comportamentos</li>
                <li>Análise de uso e métricas de desempenho</li>
                <li>Gestão de APIs e integrações</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
};

export default ToolsPage;
