
import React from 'react';
import { motion } from 'framer-motion';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardMetrics from '@/components/dashboard/DashboardMetrics';
import MarketOverview from '@/components/dashboard/MarketOverview';
import InvestorTips from '@/components/dashboard/InvestorTips';
import FeaturedProperties from '@/components/dashboard/FeaturedProperties';

const HomePage: React.FC = () => {
  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <DashboardHeader />
      
      {/* Dashboard content with improved grid layout */}
      <div className="space-y-6">
        <DashboardMetrics />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Market Overview - takes 2/3 of width on large screens */}
          <div className="lg:col-span-2">
            <MarketOverview />
          </div>
          
          {/* Investor Tips - takes 1/3 of width on large screens */}
          <div>
            <InvestorTips />
          </div>
        </div>
        
        <FeaturedProperties />
      </div>
      
      <footer className="text-center text-gray-500 text-sm mt-12">
        © 2025 ARCA - Inteligência Imobiliária. Todos os direitos reservados.
      </footer>
    </div>
  );
};

export default HomePage;
