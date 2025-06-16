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

type StepProgressProps = {
  currentStep: number;
  totalSteps: number;
};

const StepProgress: React.FC<StepProgressProps> = ({ currentStep, totalSteps }) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div key={index} className="flex flex-col items-center relative">
            <div className={`${isMobile ? 'w-6 h-6 text-xs' : 'w-8 h-8 text-sm'} rounded-full flex items-center justify-center font-medium ${
              index + 1 === currentStep
                ? 'bg-arca-purple text-white'
                : index + 1 < currentStep
                ? 'bg-arca-light-blue text-white'
                : 'bg-gray-100 text-gray-500'
            }`}>
              {index + 1}
            </div>
            {!isMobile && (
              <span className={`mt-1 text-xs ${index + 1 === currentStep ? 'text-arca-purple font-medium' : 'text-gray-500'}`}>
                {index === 0 ? 'Dados' : index === 1 ? 'Imóvel' : 'Detalhes'}
              </span>
            )}
          </div>
        ))}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className="h-2.5 rounded-full bg-gradient-to-r from-arca-dark-blue to-arca-light-blue" 
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>
    </div>
  );
};

export default StepProgress;
