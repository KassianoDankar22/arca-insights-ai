
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { motion } from 'framer-motion';

interface MetricCardProps { 
  icon: React.ElementType; 
  title: string; 
  value: string; 
  change: string; 
  isPositive?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  icon: Icon, 
  title, 
  value, 
  change, 
  isPositive = true 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-white border border-gray-200 transition-all hover:shadow-md">
        <CardContent className="p-6">
          <div className="flex items-center mb-2">
            <div className="p-2 rounded-full bg-blue-50 mr-3">
              <Icon className="text-arca-blue" size={20} />
            </div>
            <p className="text-gray-600 text-sm font-medium">{title}</p>
          </div>
          <div className="flex items-center justify-between mt-2">
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <span className={`text-xs font-medium py-1 px-2 rounded-full ${isPositive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {isPositive ? '↑' : '↓'} {change}
            </span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MetricCard;
