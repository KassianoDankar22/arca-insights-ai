
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Building, Home } from 'lucide-react';
import MarketInsightCard from './MarketInsightCard';

const MarketOverview: React.FC = () => {
  return (
    <Card className="bg-white border border-gray-200 h-full">
      <CardContent className="p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-xl font-semibold mb-1">Visão Geral do Mercado</h2>
          <h3 className="text-lg font-medium mb-3">Tendências Imobiliárias - Maio 2025</h3>
          <p className="text-gray-700 mb-6">
            O mercado imobiliário da Flórida continua resiliente com crescimento consistente. 
            Confira os principais insights:
          </p>
          
          <MarketInsightCard 
            icon={TrendingUp} 
            title="Orlando: Crescimento Sustentável"
            iconBgColor="bg-blue-100"
          >
            <p className="text-sm text-gray-600">
              Valorização média de 4.2% nos últimos 6 meses, com Lake Nona e Winter Garden liderando. 
              Imóveis para temporada apresentam ocupação média de 80%.
            </p>
          </MarketInsightCard>
          
          <MarketInsightCard 
            icon={Building} 
            title="Miami: Mercado Premium"
            iconBgColor="bg-green-100"
          >
            <p className="text-sm text-gray-600">
              Valorização de 5.8% no último semestre. Brickell e Miami Beach continuam atraindo compradores 
              internacionais. Aumento de 15% nas transações de luxo.
            </p>
          </MarketInsightCard>
          
          <MarketInsightCard 
            icon={Home} 
            title="Tipo de Imóvel Mais Rentável"
            iconBgColor="bg-purple-100"
          >
            <p className="text-sm text-gray-600">
              Single Family Homes (3-4 quartos) em áreas suburbanas continuam oferecendo o melhor equilíbrio 
              entre valorização e rendimento de aluguel. ROI médio de 8-9%.
            </p>
          </MarketInsightCard>
        </motion.div>
      </CardContent>
    </Card>
  );
};

export default MarketOverview;
