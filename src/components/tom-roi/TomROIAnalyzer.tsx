
import React, { useRef } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useIsMobile } from '@/hooks/use-mobile';
import TomROIForm from './TomROIForm';
import TomROIResults from './TomROIResults';
import AnalysisLoading from './results/AnalysisLoading';
import { FormValues } from './types/analyzer-types';
import { useTomAssistant } from './hooks/useTomAssistant';
import { exportToPDF, exportToJPEG } from './utils/export-utils';
import { useNavigate } from 'react-router-dom';

interface TomROIAnalyzerProps {
  showBackButton?: boolean;
  backPath?: string;
  backText?: string;
}

const TomROIAnalyzer: React.FC<TomROIAnalyzerProps> = ({ 
  showBackButton = false,
  backPath,
  backText
}) => {
  const isMobile = useIsMobile();
  const resultRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { isLoading, result, progress, analyzeROI, resetAnalysis } = useTomAssistant();
  
  const methods = useForm<FormValues>({
    defaultValues: {
      condominio: '',
      tipo_investimento: '',
      localizacao: '',
      modelo: '',
      quartos: '',
      piscina: false,
      valor_imovel: '',
      entrada_valor: '',
      entrada_percentual: '',
    }
  });

  const handleSubmit = async (data: FormValues) => {
    await analyzeROI(data);
  };

  const handleReset = () => {
    resetAnalysis();
    methods.reset();
  };

  const handleRecalculate = () => {
    resetAnalysis();
  };

  // Function to export the analysis as PDF
  const handleExportPDF = async () => {
    if (result) {
      const fileName = `ROI_Analise_${result.condominio.replace(/\s+/g, '_')}.pdf`;
      await exportToPDF(resultRef, fileName);
    }
  };

  // Function to export the analysis as JPEG
  const handleExportJPEG = async () => {
    if (result) {
      const fileName = `ROI_Analise_${result.condominio.replace(/\s+/g, '_')}.jpeg`;
      await exportToJPEG(resultRef, fileName);
    }
  };
  
  // Function to view history
  const handleViewHistory = () => {
    navigate('/meus-rois');
  };

  return (
    <div className={`p-4 max-w-6xl mx-auto min-h-[calc(100vh-80px)] ${isMobile ? 'pt-16 px-3' : 'py-8'}`}>
      <FormProvider {...methods}>
        {!result && !isLoading ? (
          <TomROIForm 
            onSubmit={handleSubmit} 
            isLoading={isLoading} 
          />
        ) : isLoading ? (
          <AnalysisLoading 
            stage={progress.stage} 
            percentage={progress.percentage} 
          />
        ) : (
          <TomROIResults 
            result={result}
            onRecalculate={handleRecalculate}
            onReset={handleReset}
            onExportPDF={handleExportPDF}
            onExportJPEG={handleExportJPEG}
            onViewHistory={handleViewHistory}
            resultRef={resultRef}
            showBackButton={showBackButton}
            backPath={backPath}
            backText={backText}
          />
        )}
      </FormProvider>
    </div>
  );
};

export default TomROIAnalyzer;
