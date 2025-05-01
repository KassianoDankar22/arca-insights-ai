
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface ResultHeaderProps {
  condominioName: string;
  location: string;
}

const ResultHeader: React.FC<ResultHeaderProps> = ({ condominioName, location }) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="text-center mb-6">
      <h2 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-semibold text-gray-800 mb-3`}>
        Análise de ROI para {condominioName}
      </h2>
      <p className="text-gray-600">
        Aqui está a análise detalhada para seu imóvel em {location}
      </p>
    </div>
  );
};

export default ResultHeader;
