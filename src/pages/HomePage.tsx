
import React from 'react';
import { motion } from 'framer-motion';
import DashboardMetrics from '@/components/dashboard/DashboardMetrics';
import MarketOverview from '@/components/dashboard/MarketOverview';
import InvestorTips from '@/components/dashboard/InvestorTips';
import FeaturedProperties from '@/components/dashboard/FeaturedProperties';

const HomePage: React.FC = () => {
  // User information
  const userName = "Juliana Lengler"; 
  const userGender = "female";

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          {/* Dynamic greeting based on time of day */}
          {(() => {
            const hour = new Date().getHours();
            if (hour < 12) return 'Bom dia';
            else if (hour < 18) return 'Boa tarde';
            else return 'Boa noite';
          })()}, {userName}
        </h1>
        <p className="text-gray-600">
          {/* Gender-specific welcome message */}
          {userGender === 'female' ? 'Bem-vinda' : 'Bem-vindo'} à ARCA sua plataforma inteligente de análise imobiliária.
        </p>
      </motion.div>
      
      <DashboardMetrics />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Market Overview */}
        <div className="lg:col-span-2">
          <MarketOverview />
        </div>
        
        {/* Investor Tips */}
        <div>
          <InvestorTips />
        </div>
      </div>
      
      <FeaturedProperties />
      
      <footer className="text-center text-gray-500 text-sm mt-12">
        © 2025 ARCA - Inteligência Imobiliária. Todos os direitos reservados.
      </footer>
    </div>
  );
};

export default HomePage;
