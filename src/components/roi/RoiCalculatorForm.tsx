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
import { UseFormReturn } from 'react-hook-form';
import { Card } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

import StepProgress from './StepProgress';
import FunnelStep1 from './FunnelStep1';
import FunnelStep2 from './FunnelStep2';
import FunnelStep3 from './FunnelStep3';
import type { FormValues } from './types';

interface RoiCalculatorFormProps {
  form: UseFormReturn<FormValues>;
  currentStep: number;
  logoPreview: string | null;
  handleLogoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveLogo: () => void;
  handleSubmit: () => void;
  onPrevStep: () => void;
}

const RoiCalculatorForm: React.FC<RoiCalculatorFormProps> = ({
  form,
  currentStep,
  logoPreview,
  handleLogoChange,
  handleRemoveLogo,
  handleSubmit,
  onPrevStep
}) => {
  const isMobile = useIsMobile();
  
  return (
    <Card className={`flex-grow flex flex-col overflow-hidden border-0 shadow-lg relative ${isMobile ? 'p-0 mx-0 rounded-md' : ''}`}>
      <div className="bg-gradient-to-r from-arca-dark-blue to-arca-light-blue h-1.5 absolute top-0 left-0 right-0" />
      
      <div className={`${isMobile ? 'p-4 pt-6 pb-6' : 'p-6 pt-10'} flex-grow`}>
        <StepProgress currentStep={currentStep} totalSteps={3} />
        
        <div className={`${isMobile ? 'mt-4' : 'mt-8'} flex-grow`}>
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
                  onSubmit={handleSubmit}
                  onBack={onPrevStep}
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
                  logoPreview={logoPreview}
                  handleLogoChange={handleLogoChange}
                  handleRemoveLogo={handleRemoveLogo}
                  onSubmit={handleSubmit}
                  onBack={onPrevStep}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Card>
  );
};

export default RoiCalculatorForm;
