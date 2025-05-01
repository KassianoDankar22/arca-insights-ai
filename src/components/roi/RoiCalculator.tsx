
import React from 'react';
import { useForm } from 'react-hook-form';
import { useIsMobile } from '@/hooks/use-mobile';

import { useRoiCalculator } from './hooks/useRoiCalculator';
import RoiCalculatorHeader from './RoiCalculatorHeader';
import RoiCalculatorForm from './RoiCalculatorForm';
import CalculationResult from './CalculationResult';
import type { FormValues } from './types';

const RoiCalculator: React.FC = () => {
  const isMobile = useIsMobile();
  
  const form = useForm<FormValues>({
    defaultValues: {
      investmentType: '',
      projectName: '',
      location: '',
      modelType: '',
      bedrooms: '',
      hasPool: 'Não',
      purchasePrice: '',
      aluguelMensal: '3000', // Set default values
      despesasMensais: '500', // Set default values
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
  } = useRoiCalculator(form);

  return (
    <div className={`p-4 max-w-3xl mx-auto min-h-[80vh] flex flex-col ${isMobile ? 'pt-16 px-3' : ''}`}>
      <RoiCalculatorHeader />
      
      {!calculationResult ? (
        <RoiCalculatorForm
          form={form}
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
    </div>
  );
};

export default RoiCalculator;
