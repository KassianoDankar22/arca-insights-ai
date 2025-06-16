/**
 * ========================================
 * ARCA AI - ROI ANALYSIS PLATFORM
 * ========================================
 * 
 * Copyright (c) 2025 JimmyDev
 * All rights reserved.
 * 
 * PROPRIETARY AND CONFIDENTIAL
 * This file contains proprietary code developed by JimmyDev.
 * Unauthorized copying, distribution, or use is strictly prohibited.
 * 
 * Developed by: JimmyDev
 * ========================================
 */

/**
 * ========================================
 * ARCA AI - ROI ANALYSIS PLATFORM
 * ========================================
 * 
 * Copyright (c) 2024 JimmyDev
 * All rights reserved.
 * 
 * PROPRIETARY AND CONFIDENTIAL
 * This file contains proprietary code developed by JimmyDev.
 * Unauthorized copying, distribution, or use is strictly prohibited.
 * 
 * Developed by: JimmyDev
 * ========================================
 */


import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ResultHeaderProps {
  condominioName: string;
  location: string;
  showBackButton?: boolean;
  backPath?: string;
  backText?: string;
}

const ResultHeader: React.FC<ResultHeaderProps> = ({ 
  condominioName, 
  location, 
  showBackButton = false,
  backPath = '/analise/tom',
  backText = 'Voltar para Análise'
}) => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate(backPath);
  };
  
  return (
    <div className="text-center mb-6">
      {showBackButton && (
        <div className="flex justify-start mb-4">
          <Button
            variant="outline"
            className="gap-2"
            onClick={handleBack}
          >
            <ArrowLeft size={16} />
            {backText}
          </Button>
        </div>
      )}
      
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
