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
import { UseFormReturn } from 'react-hook-form';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { FormValues } from '../types';

export const useRoiCalculator = (form: UseFormReturn<FormValues>) => {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [calculationResult, setCalculationResult] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const reportRef = useRef<HTMLDivElement>(null);
  
  // Default values for calculation since we removed the input fields
  const defaultAluguelMensal = 3000; // R$ 3,000 monthly rent
  const defaultDespesasMensais = 500; // R$ 500 monthly expenses

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      form.setValue('logoImage', file);
    }
  };

  const handleRemoveLogo = () => {
    setLogoPreview(null);
    form.setValue('logoImage', null);
  };

  const calculateRoi = (data: FormValues) => {
    const compra = parseFloat(data.purchasePrice);
    // Use default values since we've removed the fields
    const aluguel = defaultAluguelMensal;
    const despesas = defaultDespesasMensais;
    
    if (isNaN(compra)) {
      return;
    }
    
    const receitaAnual = aluguel * 12;
    const despesaAnual = despesas * 12;
    const lucroAnual = receitaAnual - despesaAnual;
    const roiAnual = (lucroAnual / compra) * 100;
    const retornoEmAnos = compra / lucroAnual;
    
    setCalculationResult({
      roiAnual: roiAnual.toFixed(2),
      retornoEmAnos: retornoEmAnos.toFixed(1),
      receitaAnual,
      despesaAnual,
      lucroAnual,
      pieData: [
        { name: 'Despesas', value: despesaAnual },
        { name: 'Lucro', value: lucroAnual }
      ],
      formData: { 
        ...data,
        aluguelMensal: defaultAluguelMensal.toString(),
        despesasMensais: defaultDespesasMensais.toString()
      }
    });
  };

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 3));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = () => {
    if (currentStep < 3) {
      nextStep();
    } else {
      const data = form.getValues();
      calculateRoi(data);
    }
  };

  const exportToPdf = async () => {
    if (reportRef.current && calculationResult) {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        logging: false
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgWidth = 210;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`ROI_Analise_${calculationResult.formData.projectName || 'Propriedade'}.pdf`);
    }
  };

  return {
    logoPreview,
    calculationResult,
    currentStep,
    reportRef,
    handleLogoChange,
    handleRemoveLogo,
    handleSubmit,
    nextStep,
    prevStep,
    exportToPdf
  };
};
