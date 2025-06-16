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
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface SubmitButtonProps {
  isLoading: boolean;
  apiStatus: 'online' | 'offline' | 'error';
  isValid: boolean;
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({
  isLoading,
  apiStatus,
  isValid,
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  onSubmit
}) => {
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;
  const isDisabled = !isValid || isLoading || apiStatus === 'offline' || apiStatus === 'error';

  const getButtonText = () => {
    if (isLoading) return 'Processando...';
    if (apiStatus === 'offline') return 'Serviço indisponível';
    if (apiStatus === 'error') return 'Erro no serviço';
    if (isLastStep) return 'Analisar ROI';
    return 'Próximo';
  };

  const handleClick = () => {
    if (isLastStep) {
      onSubmit();
    } else {
      onNext();
    }
  };

  return (
    <div className="flex justify-between space-x-4">
      {!isFirstStep && (
        <button
          type="button"
          className="shadow-[0_4px_14px_0_rgb(0,118,255,39%)] hover:shadow-[0_6px_20px_rgba(0,118,255,23%)] hover:bg-[rgba(0,118,255,0.9)] px-8 py-2 bg-[#0070f3] rounded-md text-white font-light transition duration-200 ease-linear"
          onClick={onPrevious}
          disabled={isLoading}
        >
          Anterior
        </button>
      )}
      <button
        type="button"
        onClick={handleClick}
        disabled={isDisabled}
        className={`shadow-[0_4px_14px_0_rgb(0,118,255,39%)] hover:shadow-[0_6px_20px_rgba(0,118,255,23%)] hover:bg-[rgba(0,118,255,0.9)] px-8 py-2 bg-[#0070f3] rounded-md text-white font-light transition duration-200 ease-linear flex items-center ${isFirstStep ? 'ml-auto' : ''} ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {getButtonText()}
      </button>
    </div>
  );
};

export default SubmitButton;
