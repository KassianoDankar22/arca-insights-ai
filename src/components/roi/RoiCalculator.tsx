
import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useIsMobile } from '@/hooks/use-mobile';

import { useRoiCalculator } from './hooks/useRoiCalculator';
import RoiCalculatorHeader from './RoiCalculatorHeader';
import RoiCalculatorForm from './RoiCalculatorForm';
import CalculationResult from './CalculationResult';
import type { FormValues } from './types';

const RoiCalculator: React.FC = () => {
  const isMobile = useIsMobile();
  
  const methods = useForm<FormValues>({
    defaultValues: {
      investmentType: '',
      projectName: '',
      location: '',
      modelType: '',
      bedrooms: '',
      hasPool: 'Não',
      purchasePrice: '',
      aluguelMensal: '3000',
      despesasMensais: '500',
      logoImage: null,
      name: '',
      email: '',
      phone: '',
    }
  });

  const {
    logoPreview,
    calculationResult,
    currentStep,
    reportRef,
    handleLogoChange,
    handleRemoveLogo,
    handleSubmit,
    prevStep,
    exportToPdf
  } = useRoiCalculator(methods);

  return (
    <div className={`p-4 max-w-3xl mx-auto min-h-[calc(100vh-80px)] flex flex-col ${isMobile ? 'pt-16 px-3' : ''}`}>
      <RoiCalculatorHeader />
      
      <FormProvider {...methods}>
        {!calculationResult ? (
          <RoiCalculatorForm
            form={methods}
            currentStep={currentStep}
            logoPreview={logoPreview}
            handleLogoChange={handleLogoChange}
            handleRemoveLogo={handleRemoveLogo}
            handleSubmit={handleSubmit}
            onPrevStep={prevStep}
          />
        ) : (
          <CalculationResult 
            calculationResult={calculationResult} 
            logoPreview={logoPreview}
            exportToPdf={exportToPdf}
            reportRef={reportRef}
          />
        )}
      </FormProvider>
    </div>
  );
};

export default RoiCalculator;
