
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Loader } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useIsMobile } from '@/hooks/use-mobile';

interface AnalysisLoadingProps {
  stage: 'creating-thread' | 'sending-message' | 'running-assistant' | 'checking-status' | 'getting-results' | 'complete' | null;
  percentage: number;
}

const AnalysisLoading: React.FC<AnalysisLoadingProps> = ({ stage, percentage }) => {
  const isMobile = useIsMobile();
  
  const getStageMessage = () => {
    switch (stage) {
      case 'creating-thread':
        return 'Iniciando análise...';
      case 'sending-message':
        return 'Enviando dados do imóvel...';
      case 'running-assistant':
        return 'Tom está calculando o ROI...';
      case 'checking-status':
        return 'Processando análise...';
      case 'getting-results':
        return 'Finalizando resultados...';
      case 'complete':
        return 'Análise completa!';
      default:
        return 'Preparando análise...';
    }
  };
  
  return (
    <Card className="bg-white/80 backdrop-blur-lg border border-gray-200 shadow-lg">
      <CardContent className={`${isMobile ? 'p-4' : 'p-6'} flex flex-col items-center justify-center min-h-[300px]`}>
        <div className="flex flex-col items-center space-y-6 max-w-md mx-auto text-center">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-100 rounded-full blur-2xl opacity-70"></div>
            <div className="relative p-6 bg-white rounded-full shadow-lg">
              <Loader className="animate-spin text-arca-blue w-12 h-12" />
            </div>
          </div>
          
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold text-gray-800">
              🔍 Tom está analisando os dados...
            </h2>
            <p className="text-gray-600">
              Aguarde um instante enquanto preparamos sua simulação completa de ROI.
            </p>
            <p className="text-gray-500 text-sm font-medium">
              {getStageMessage()}
            </p>
          </div>
          
          <div className="w-full">
            <Progress value={percentage} className="h-2" />
            <p className="text-xs text-gray-500 mt-1 text-right">{percentage}%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalysisLoading;
