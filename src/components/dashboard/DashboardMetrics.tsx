
import React from 'react';
import { BarChart2, TrendingUp, CircleDollarSign } from 'lucide-react';
import MetricCard from './MetricCard';
import CurrencyWidget from './CurrencyWidget';

const DashboardMetrics: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-8">
      <div className="lg:col-span-3">
        {/* Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <MetricCard 
            icon={BarChart2} 
            title="ROI Médio" 
            value="8.6%" 
            change="1.2%"
            isPositive={true}
          />
          <MetricCard 
            icon={TrendingUp} 
            title="Valorização Anual" 
            value="5.3%" 
            change="0.8%"
            isPositive={true}
          />
          <MetricCard 
            icon={CircleDollarSign} 
            title="Preço Médio" 
            value="R$ 457.500" 
            change="2.5%"
            isPositive={true}
          />
        </div>
      </div>
      <div className="lg:col-span-1">
        <CurrencyWidget />
      </div>
    </div>
  );
};

export default DashboardMetrics;
