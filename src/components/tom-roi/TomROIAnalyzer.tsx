
import React, { useRef } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useIsMobile } from '@/hooks/use-mobile';
import TomROIForm from './TomROIForm';
import TomROIResults from './TomROIResults';
import { FormValues } from './types/analyzer-types';
import { useROIAnalysis } from './hooks/useROIAnalysis';
import { exportToPDF, exportToJPEG } from './utils/export-utils';

const TomROIAnalyzer: React.FC = () => {
  const isMobile = useIsMobile();
  const resultRef = useRef<HTMLDivElement>(null);
  const { isLoading, result, analyzeROI, resetAnalysis, viewHistory } = useROIAnalysis();
  
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

  return (
    <div className={`p-4 max-w-6xl mx-auto min-h-[calc(100vh-80px)] ${isMobile ? 'pt-16 px-3' : 'py-8'}`}>
      <FormProvider {...methods}>
        {!result ? (
          <TomROIForm 
            onSubmit={handleSubmit} 
            isLoading={isLoading} 
          />
        ) : (
          <TomROIResults 
            result={result}
            onRecalculate={handleRecalculate}
            onReset={handleReset}
            onExportPDF={handleExportPDF}
            onExportJPEG={handleExportJPEG}
            onViewHistory={viewHistory}
            resultRef={resultRef}
          />
        )}
      </FormProvider>
    </div>
  );
};

export default TomROIAnalyzer;
