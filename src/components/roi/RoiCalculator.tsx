
import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Card } from '@/components/ui/card';
import { Calculator } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { motion, AnimatePresence } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

import StepProgress from './StepProgress';
import CalculationResult from './CalculationResult';
import FunnelStep1 from './FunnelStep1';
import FunnelStep2 from './FunnelStep2';
import FunnelStep3 from './FunnelStep3';
import type { FormValues } from './types';

const RoiCalculator: React.FC = () => {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [calculationResult, setCalculationResult] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const reportRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  
  // Default values for calculation since we removed the input fields
  const defaultAluguelMensal = 3000; // R$ 3,000 monthly rent
  const defaultDespesasMensais = 500; // R$ 500 monthly expenses
  
  const form = useForm<FormValues>({
    defaultValues: {
      investmentType: '',
      projectName: '',
      location: '',
      modelType: '',
      bedrooms: '',
      hasPool: 'Não',
      purchasePrice: '',
      aluguelMensal: defaultAluguelMensal.toString(), // Set default values
      despesasMensais: defaultDespesasMensais.toString(), // Set default values
      logoImage: null,
      name: '',
      email: '',
      phone: '',
    }
  });

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

  const handleSubmit = form.handleSubmit((data) => {
    if (currentStep < 3) {
      nextStep();
    } else {
      calculateRoi(data);
    }
  });

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

  return (
    <div className={`p-4 max-w-3xl mx-auto min-h-[80vh] flex flex-col ${isMobile ? 'px-3' : ''}`}>
      <h2 className={`${isMobile ? 'text-2xl mb-4' : 'text-3xl mb-6'} font-bold flex items-center justify-center text-center`}>
        <Calculator className={`${isMobile ? 'mr-1.5' : 'mr-2'}`} />
        <span className="bg-gradient-to-r from-arca-dark-blue to-arca-light-blue bg-clip-text text-transparent">
          Calculadora de ROI
        </span>
      </h2>
      
      {!calculationResult ? (
        <Card className={`flex-grow flex flex-col overflow-hidden border-0 shadow-lg relative ${isMobile ? 'p-0' : ''}`}>
          <div className="bg-gradient-to-r from-arca-dark-blue to-arca-light-blue h-1.5 absolute top-0 left-0 right-0" />
          
          <div className={`${isMobile ? 'p-4 pt-8' : 'p-6 pt-10'} flex-grow`}>
            <StepProgress currentStep={currentStep} totalSteps={3} />
            
            <div className={`${isMobile ? 'mt-6' : 'mt-8'} flex-grow`}>
              <AnimatePresence mode="wait">
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                  >
                    <FunnelStep1 
                      form={form} 
                      onSubmit={handleSubmit}
                    />
                  </motion.div>
                )}
                
                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                  >
                    <FunnelStep2 
                      form={form}
                      onSubmit={handleSubmit}
                      onBack={prevStep}
                    />
                  </motion.div>
                )}
                
                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                  >
                    <FunnelStep3 
                      form={form}
                      logoPreview={logoPreview}
                      handleLogoChange={handleLogoChange}
                      handleRemoveLogo={handleRemoveLogo}
                      onSubmit={handleSubmit}
                      onBack={prevStep}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </Card>
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
