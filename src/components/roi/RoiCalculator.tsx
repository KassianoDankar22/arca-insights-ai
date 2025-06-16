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


import React, { useState, useRef } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import RoiCalculatorForm from './RoiCalculatorForm';
import CalculationResult from './CalculationResult';
import { jsPDF } from 'jspdf';
import type { FormValues } from './types';

const RoiCalculator: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);
  
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
  
  const exportToPdf = () => {
    if (reportRef.current) {
      const doc = new jsPDF('p', 'pt', 'a4');
      doc.html(reportRef.current, {
        callback: function(pdf) {
          pdf.save('roi-analysis.pdf');
        }
      });
    }
  };

  // Calculate ROI values from form data
  const calculateResults = () => {
    const formData = form.getValues();
    const purchasePrice = parseFloat(formData.purchasePrice) || 0;
    const aluguelMensal = parseFloat(formData.aluguelMensal) || 0;
    const despesasMensais = parseFloat(formData.despesasMensais) || 0;

    const receitaAnual = aluguelMensal * 12;
    const despesaAnual = despesasMensais * 12;
    const lucroAnual = receitaAnual - despesaAnual;

    // Calculate ROI
    const roiAnual = purchasePrice > 0 ? ((lucroAnual / purchasePrice) * 100).toFixed(2) : '0.00';
    const retornoEmAnos = purchasePrice > 0 && lucroAnual > 0 ? (purchasePrice / lucroAnual).toFixed(1) : 'N/A';

    // Data for pie chart
    const pieData = [
      { name: 'Despesas', value: despesaAnual },
      { name: 'Lucro', value: lucroAnual }
    ];

    return {
      roiAnual,
      retornoEmAnos,
      receitaAnual,
      despesaAnual,
      lucroAnual,
      pieData,
      formData,
    };
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
            calculationResult={calculateResults()}
            logoPreview={logoPreview}
            exportToPdf={exportToPdf}
            reportRef={reportRef}
          />
        )}
      </div>
    </FormProvider>
  );
};

export default RoiCalculator;
