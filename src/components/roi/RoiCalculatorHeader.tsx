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
import { Calculator } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const RoiCalculatorHeader: React.FC = () => {
  const isMobile = useIsMobile();
  
  return (
    <h2 className={`${isMobile ? 'text-2xl mb-4' : 'text-3xl mb-6'} font-bold flex items-center justify-center text-center`}>
      <Calculator className={`${isMobile ? 'mr-1.5' : 'mr-2'}`} />
      <span className="bg-gradient-to-r from-arca-dark-blue to-arca-light-blue bg-clip-text text-transparent">
        Calculadora de ROI
      </span>
    </h2>
  );
};

export default RoiCalculatorHeader;
