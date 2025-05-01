
import React from 'react';
import { motion } from 'framer-motion';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardMetrics from '@/components/dashboard/DashboardMetrics';
import FeaturedProperties from '@/components/dashboard/FeaturedProperties';
import InvestorTipCard from '@/components/dashboard/InvestorTipCard';

const Dashboard: React.FC = () => {
  const investorTips = [
    {
      number: 1,
      title: "Diversifique seus investimentos",
      description: "Não concentre todos seus recursos em um único imóvel ou região."
    },
    {
      number: 2,
      title: "Analise o ROI antes de investir",
      description: "Use nossa calculadora para projetar o retorno sobre investimento."
    },
    {
      number: 3,
      title: "Acompanhe as tendências do mercado",
      description: "Mantenha-se atualizado sobre mudanças no mercado imobiliário."
    }
  ];

  return (
    <div className="pb-12">
      <DashboardHeader />
      
      <DashboardMetrics />
      
      <FeaturedProperties />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <h2 className="text-xl font-bold mb-4">Dicas para Investidores</h2>
        <div>
          {investorTips.map((tip) => (
            <InvestorTipCard
              key={tip.number}
              number={tip.number}
              title={tip.title}
              description={tip.description}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
