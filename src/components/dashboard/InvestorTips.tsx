
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

interface TipProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const Tip: React.FC<TipProps> = ({ title, description, icon }) => (
  <div className="flex items-start space-x-3 mb-4 pb-4 border-b border-gray-100 last:border-b-0 last:mb-0 last:pb-0">
    <div className="p-2 rounded-full bg-blue-50 flex-shrink-0">
      {icon}
    </div>
    <div>
      <h3 className="font-medium text-sm mb-1">{title}</h3>
      <p className="text-xs text-gray-600">{description}</p>
    </div>
  </div>
);

const InvestorTips: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="shadow-sm border h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-bold">Dicas do Investidor</CardTitle>
        </CardHeader>
        <CardContent>
          <Tip 
            icon={<TrendingUp className="text-arca-blue" size={16} />}
            title="Valorização em Lake Nona"
            description="Imóveis em Lake Nona valorizaram 12% nos últimos 6 meses, superando a média da região."
          />
          <Tip 
            icon={<TrendingUp className="text-arca-blue" size={16} />}
            title="ROI em Short Term"
            description="O aluguel por temporada em Orlando está rendendo 14% ao ano, considerando ocupação média de 70%."
          />
          <Tip 
            icon={<TrendingUp className="text-arca-blue" size={16} />}
            title="Crescimento em Winter Garden"
            description="Winter Garden está entre os 5 bairros com maior crescimento populacional em 2024."
          />

          <div className="mt-4">
            <button className="text-arca-blue text-xs font-medium hover:underline">
              Ver todas as dicas →
            </button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default InvestorTips;
