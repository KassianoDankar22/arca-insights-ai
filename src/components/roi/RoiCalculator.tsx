
import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import RoiCalculatorForm from './RoiCalculatorForm';
import CalculationResult from './CalculationResult';
import type { FormValues } from './types';

const RoiCalculator: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  
  const form = useForm<FormValues>({
    defaultValues: {
      investmentType: 'shortTerm',
      projectName: '',
      location: '',
      modelType: '',
      bedrooms: '',
      hasPool: 'no',
      purchasePrice: '',
      aluguelMensal: '',
      despesasMensais: '',
      logoImage: null,
      name: '',
      email: '',
      phone: '',
    },
  });

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue('logoImage', file);
      const reader = new FileReader();
      reader.onload = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    form.setValue('logoImage', null);
    setLogoPreview(null);
  };

  const handleSubmit = form.handleSubmit(() => {
    if (currentStep < 3) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // Submit the form and show results
      setShowResults(true);
    }
  });

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  return (
    <FormProvider {...form}>
      <div className="max-w-4xl mx-auto p-4">
        {!showResults ? (
          <RoiCalculatorForm
            form={form}
            currentStep={currentStep}
            logoPreview={logoPreview}
            handleLogoChange={handleLogoChange}
            handleRemoveLogo={handleRemoveLogo}
            handleSubmit={handleSubmit}
            onPrevStep={handlePrevStep}
          />
        ) : (
          <CalculationResult
            formData={form.getValues()}
            onNewCalculation={() => {
              setShowResults(false);
              setCurrentStep(1);
              form.reset();
              setLogoPreview(null);
            }}
          />
        )}
      </div>
    </FormProvider>
  );
};

export default RoiCalculator;
