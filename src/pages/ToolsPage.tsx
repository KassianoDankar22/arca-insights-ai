
import React from 'react';
import { motion } from 'framer-motion';
import AIAgentCard, { AIAgentProps } from '@/components/tools/AIAgentCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload } from 'lucide-react';

// These would eventually come from a backend API or admin panel
const aiAgents: AIAgentProps[] = [
  {
    id: 'roi-short-term',
    name: 'Tom - Análise de ROI',
    description: 'Avalia rapidamente o retorno sobre investimento de propriedades destinadas a locações de curto prazo, considerando fatores como ocupação, sazonalidade e custos. Ajuda o corretor a identificar as melhores oportunidades sem precisar de cálculos complexos.',
    icon: '/lovable-uploads/781bb3b7-dc4b-42be-842a-086cb608c3c6.png',
    route: '/roi-curto-prazo',
    isNew: true
  },
  {
    id: 'roi-long-term',
    name: 'Ana - ROI Longo Prazo',
    description: 'Especialista em análise de retorno sobre investimento para propriedades de longo prazo, considerando valorização imobiliária, custos de manutenção e tendências de mercado ao longo do tempo.',
    icon: '/lovable-uploads/695ed016-2dd6-49b3-97f0-bdbdabc3e04d.png',
    route: '/roi-longo-prazo'
  },
  {
    id: 'market-trends',
    name: 'Lucas - Tendências de Mercado',
    description: 'Acompanha e analisa as principais tendências do mercado imobiliário, oferecendo insights valiosos sobre direções futuras, áreas em desenvolvimento e oportunidades emergentes.',
    icon: '/lovable-uploads/f661dcdf-81da-40d9-b1b9-622de36233cb.png',
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
              <div className="flex items-start space-x-4">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-2">
                    Funcionalidades planejadas:
                  </p>
                  <ul className="list-disc pl-5 mt-2 text-sm text-gray-600">
                    <li>Criação de novos agentes de IA</li>
                    <li>Personalização de prompts e comportamentos</li>
                    <li className="font-medium text-blue-600">Upload de imagens personalizadas para cada agente</li>
                    <li>Análise de uso e métricas de desempenho</li>
                    <li>Gestão de APIs e integrações</li>
                  </ul>
                </div>
                <div className="border border-dashed border-gray-300 rounded-lg p-4 bg-gray-50 w-48 flex flex-col items-center justify-center">
                  <Upload className="text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500 text-center">
                    Interface para upload de avatares dos agentes
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
};

export default ToolsPage;
