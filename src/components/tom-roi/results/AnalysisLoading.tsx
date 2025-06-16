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

import React, { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { ProgressState } from '../types/analyzer-types';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface AnalysisLoadingProps {
  stage?: string;
  percentage?: number;
  onRetry?: () => void;
}

const AnalysisLoading: React.FC<AnalysisLoadingProps> = ({
  stage = 'Analisando dados...',
  percentage = 0,
  onRetry
}) => {
  const isMobile = useIsMobile();
  const [currentTip, setCurrentTip] = useState(0);
  const [showLongWaitMessage, setShowLongWaitMessage] = useState(false);
  const [showRetryButton, setShowRetryButton] = useState(false);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip(prev => (prev + 1) % tips.length);
    }, 5000);

    const longWaitTimer = setTimeout(() => {
      setShowLongWaitMessage(true);
    }, 30000);

    const retryButtonTimer = setTimeout(() => {
      if (onRetry) {
        setShowRetryButton(true);
      }
    }, 60000);
    
    return () => {
      clearInterval(interval);
      clearTimeout(longWaitTimer);
      clearTimeout(retryButtonTimer);
    };
  }, [onRetry]);
  
  const getStageText = (stage: string) => {
    switch (stage) {
      case 'creating-thread':
        return 'Iniciando análise...';
      case 'sending-message':
        return 'Enviando dados...';
      case 'running-assistant':
        return 'Analisando propriedade...';
      case 'checking-status':
        return 'Verificando resultados...';
      case 'getting-results':
        return 'Preparando relatório...';
      case 'complete':
        return 'Análise concluída!';
      default:
        return 'Processando...';
    }
  };

  const getDetailedMessage = () => {
    switch (stage) {
      case 'creating-thread':
        return 'Iniciando análise do imóvel';
      case 'sending-message':
        return 'Processando dados do imóvel';
      case 'running-assistant':
        return 'Calculando indicadores financeiros';
      case 'checking-status':
        if (percentage >= 85) {
          return 'Finalizando cálculos';
        } else if (percentage >= 75) {
          return 'Verificando resultados';
        }
        return 'Verificando resultados';
      case 'getting-results':
        return 'Preparando visualização dos resultados';
      case 'complete':
        return 'Análise concluída!';
      default:
        return 'Processando dados';
    }
  };

  const getEstimatedTime = () => {
    if (showLongWaitMessage) return "Aguarde mais alguns instantes...";
    if (percentage < 60) return "Tempo estimado: 30 segundos";
    if (percentage < 80) return "Quase pronto...";
    if (percentage < 95) return "Finalizando...";
    return "Concluindo...";
  };
  
  const tips = [
    "Analisando dados do imóvel...",
    "Calculando retorno sobre investimento...",
    "Verificando fluxo de caixa...",
    "Estimando valorização anual...",
    "Preparando resultados..."
  ];
  
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-arca-main border-t-transparent rounded-full animate-spin mb-6"></div>
        <h2 className="text-2xl font-bold">{getStageText(stage)}</h2>
        </div>
        <div>
        <Progress value={percentage} className="h-2" />
        </div>
        <p className="text-gray-600">
          {getDetailedMessage()}
        </p>
        <p className="text-sm text-gray-500">
          {getEstimatedTime()}
        </p>
        {showLongWaitMessage && (
          <p className="text-sm text-gray-500">
            {tips[currentTip]}
          </p>
        )}
        {showRetryButton && onRetry && (
          <Button
            variant="outline"
            onClick={onRetry}
            className="flex items-center gap-2"
          >
            <RefreshCw size={16} />
            Tentar novamente
          </Button>
        )}
      </div>
    </div>
  );
};

export default AnalysisLoading;
