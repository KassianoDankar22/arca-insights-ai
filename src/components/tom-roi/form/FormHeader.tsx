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

import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface FormHeaderProps {
  currentStep: number;
  totalSteps: number;
}

const FormHeader: React.FC<FormHeaderProps> = ({ currentStep, totalSteps }) => {
  const isMobile = useIsMobile();

  const steps = [
    'Dados do Imóvel',
    'Características',
    'Valores',
  ];

  return (
    <div className="text-center">
      <h2 className={`${isMobile ? 'text-xl mb-2' : 'text-2xl mb-4'} font-bold text-gray-800`}>
        Análise de ROI para Imóveis
      </h2>
      
      <p className={`text-gray-600 ${isMobile ? 'text-sm mb-4' : 'mb-6'}`}>
        {currentStep === 1 && "Insira os dados básicos do imóvel"}
        {currentStep === 2 && "Informe as características do imóvel"}
        {currentStep === 3 && "Defina os valores e tipo de investimento"}
      </p>

      <div className="relative">
        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
          <div
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-arca-dark-blue to-arca-light-blue transition-all duration-500"
          />
        </div>

        <div className="hidden sm:flex justify-between -mt-2">
          {steps.map((step, index) => (
            <div
              key={step}
              className={`flex flex-col items-center ${
                index + 1 <= currentStep ? 'text-arca-blue' : 'text-gray-400'
              }`}
            >
              <div
                className={`w-6 h-6 flex items-center justify-center rounded-full mb-1 ${
                  index + 1 <= currentStep
                    ? 'bg-arca-blue text-white'
                    : 'bg-gray-200 text-gray-400'
                }`}
              >
                {index + 1}
              </div>
              <span className="text-xs">{step}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FormHeader;
