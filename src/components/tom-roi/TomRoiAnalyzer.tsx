
import React, { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { FormProvider, useForm } from 'react-hook-form';
import TomRoiForm from './TomRoiForm';
import TomRoiResults from './TomRoiResults';
import { TomRoiFormValues, TomRoiResultData } from './types';

const TomRoiAnalyzer: React.FC = () => {
  const isMobile = useIsMobile();
  const [isLoading, setIsLoading] = useState(false);
  const [resultData, setResultData] = useState<TomRoiResultData | null>(null);
  
  const methods = useForm<TomRoiFormValues>({
    defaultValues: {
      projectName: '',
      location: '',
      modelType: '',
      bedrooms: '',
      hasPool: false,
      purchasePrice: '',
    }
  });

  const handleSubmit = async (data: TomRoiFormValues) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Generate mock data for now
      // In a real-world scenario, this would be fetched from an API
      const mockResult: TomRoiResultData = {
        property: {
          value: parseFloat(data.purchasePrice),
          downPayment: parseFloat(data.purchasePrice) * 0.2,
          financedAmount: parseFloat(data.purchasePrice) * 0.8,
          interestRate: 7.5,
          term: 30
        },
        rental: {
          averageRate: parseFloat(data.purchasePrice) / 1000 * 2.5,
          occupancyRate: 75,
          monthlyGross: (parseFloat(data.purchasePrice) / 1000 * 2.5) * 22 * 0.75,
          yearlyGross: (parseFloat(data.purchasePrice) / 1000 * 2.5) * 22 * 0.75 * 12
        },
        expenses: {
          management: (parseFloat(data.purchasePrice) / 1000 * 2.5) * 22 * 0.75 * 0.15,
          pool: data.hasPool ? 200 : 0,
          utilities: 150,
          hoa: 400,
          propertyTax: parseFloat(data.purchasePrice) * 0.01 / 12,
          insurance: parseFloat(data.purchasePrice) * 0.005 / 12,
          totalMonthly: 0, // Will be calculated below
        },
        roi: {
          netMonthlyIncome: 0, // Will be calculated below
          afterFinancing: 0, // Will be calculated below
          annualAppreciation: parseFloat(data.purchasePrice) * 0.05,
          totalAnnual: 0 // Will be calculated below
        },
        formData: data
      };

      // Calculate the derived values
      mockResult.expenses.totalMonthly = 
        mockResult.expenses.management + 
        mockResult.expenses.pool + 
        mockResult.expenses.utilities + 
        mockResult.expenses.hoa + 
        mockResult.expenses.propertyTax + 
        mockResult.expenses.insurance;
      
      mockResult.roi.netMonthlyIncome = mockResult.rental.monthlyGross - mockResult.expenses.totalMonthly;
      
      // Calculate monthly mortgage payment (P&I)
      const monthlyInterestRate = mockResult.property.interestRate / 100 / 12;
      const totalPayments = mockResult.property.term * 12;
      const monthlyPayment = 
        mockResult.property.financedAmount * 
        (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, totalPayments)) / 
        (Math.pow(1 + monthlyInterestRate, totalPayments) - 1);
      
      mockResult.roi.afterFinancing = mockResult.roi.netMonthlyIncome - monthlyPayment;
      mockResult.roi.totalAnnual = (mockResult.roi.netMonthlyIncome * 12) + mockResult.roi.annualAppreciation;
      
      setResultData(mockResult);
      setIsLoading(false);
    }, 2000);
  };

  const handleReset = () => {
    setResultData(null);
    methods.reset();
  };

  const handleRecalculate = () => {
    setResultData(null);
  };

  // Function to export the analysis as PDF/JPEG
  const handleExport = () => {
    alert('Exportando análise... (funcionalidade a ser implementada)');
  };

  // Function to view history of analyses
  const handleViewHistory = () => {
    alert('Visualizando histórico... (funcionalidade a ser implementada)');
  };

  return (
    <div className={`p-4 max-w-6xl mx-auto min-h-[calc(100vh-80px)] ${isMobile ? 'pt-16 px-3' : 'py-8'}`}>
      <FormProvider {...methods}>
        {!resultData ? (
          <TomRoiForm 
            onSubmit={handleSubmit} 
            isLoading={isLoading} 
          />
        ) : (
          <TomRoiResults 
            resultData={resultData}
            onRecalculate={handleRecalculate}
            onReset={handleReset}
            onExport={handleExport}
            onViewHistory={handleViewHistory}
          />
        )}
      </FormProvider>
    </div>
  );
};

export default TomRoiAnalyzer;
