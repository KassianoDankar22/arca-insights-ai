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
import { motion } from 'framer-motion';
import TomROIAnalyzer from '@/components/tom-roi/TomROIAnalyzer';
import ErrorBoundary from '@/components/ErrorBoundary';

const TomROIPage: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <ErrorBoundary fallbackMessage="Ocorreu um erro ao carregar a página de análise. Por favor, tente novamente mais tarde.">
        <TomROIAnalyzer 
          showBackButton={true}
          backPath="/"
          backText="Voltar para Dashboard"
        />
      </ErrorBoundary>
    </motion.div>
  );
};

export default TomROIPage;
