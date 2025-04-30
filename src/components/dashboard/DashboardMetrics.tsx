
import React from 'react';
import { BarChart2, TrendingUp, CircleDollarSign, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import CurrencyWidget from './CurrencyWidget';

// Componente de card para métricas individuais
const MetricCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  value: string;
  change?: string;
  isPositive?: boolean;
  color?: string;
}> = ({ icon, title, value, change, isPositive = true, color = 'bg-arca-purple' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden border shadow-sm">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-600 mb-1">{title}</p>
              <h3 className="text-2xl font-bold">{value}</h3>
              {change && (
                <p className={`text-xs mt-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                  {isPositive ? '↑' : '↓'} {change}
                </p>
              )}
            </div>
            <div className={`p-3 rounded-full ${color} bg-opacity-15`}>
              {icon}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

const DashboardMetrics: React.FC = () => {
  // Animation stagger effect for cards
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <motion.div 
      className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* Metric Cards in first 3 slots */}
      <div className="lg:col-span-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MetricCard 
            icon={<BarChart2 className="text-arca-purple" size={24} />} 
            title="ROI Médio" 
            value="8.6%" 
            change="1.2%"
            isPositive={true}
            color="bg-arca-purple"
          />
          <MetricCard 
            icon={<Users className="text-arca-blue" size={24} />} 
            title="Oportunidades" 
            value="24" 
            change="4"
            isPositive={true}
            color="bg-arca-blue"
          />
          <MetricCard 
            icon={<CircleDollarSign className="text-green-600" size={24} />} 
            title="Preço Médio" 
            value="R$ 457.500" 
            change="2.5%"
            isPositive={true}
            color="bg-green-100"
          />
        </div>
      </div>

      {/* Currency widget in the 4th slot */}
      <div className="lg:col-span-1">
        <CurrencyWidget />
      </div>
    </motion.div>
  );
};

export default DashboardMetrics;
