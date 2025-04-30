
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import InvestorTipCard from './InvestorTipCard';

const InvestorTips: React.FC = () => {
  return (
    <Card className="bg-white border border-gray-200 h-full">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4">Dicas para Investidores</h2>
        
        <InvestorTipCard 
          number={1}
          title="Foco em áreas em expansão"
          description="Lake Nona (Orlando) e Doral (Miami) são áreas em rápido desenvolvimento com excelente potencial de valorização."
        />
        
        <InvestorTipCard 
          number={2}
          title="Timing da compra"
          description="O início do ano (Jan-Mar) geralmente oferece os melhores preços devido à sazonalidade do mercado da Flórida."
        />
        
        <InvestorTipCard 
          number={3}
          title="Diversificação"
          description="Para investidores com capital maior, diversificar entre imóvel para moradia permanente e aluguel temporário maximiza o potencial de retorno."
        />
      </CardContent>
    </Card>
  );
};

export default InvestorTips;
