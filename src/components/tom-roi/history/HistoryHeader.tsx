
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HistoryHeader: React.FC = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate('/analise/tom');
  };
  
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
      <div>
        <Button
          variant="outline"
          className="mb-4 gap-2"
          onClick={handleBack}
        >
          <ArrowLeft size={16} />
          Voltar para Análise
        </Button>
        <h2 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-semibold text-gray-800`}>
          Meus ROI's
        </h2>
        <p className="text-gray-600">
          Histórico das suas análises de ROI dos últimos 7 dias
        </p>
      </div>
    </div>
  );
};

export default HistoryHeader;
