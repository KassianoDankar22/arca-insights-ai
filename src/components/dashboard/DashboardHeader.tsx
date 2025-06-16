
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

import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/auth';

const DashboardHeader: React.FC = () => {
  // Get user information from context
  const { user } = useAuth();
  
  // Determine display name
  const displayName = user?.email?.split('@')[0] || 'Usuário';

  return (
    <motion.div 
      className="mb-8"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-1">
            <span className="bg-gradient-to-r from-arca-light-blue via-arca-blue to-arca-dark-blue bg-clip-text text-transparent">
              {(() => {
                const hour = new Date().getHours();
                if (hour < 12) return 'Bom dia';
                else if (hour < 18) return 'Boa tarde';
                else return 'Boa noite';
              })()}, {displayName}
            </span>
          </h1>
          <p className="text-gray-600">
            Bem-vindo(a) à ARCA sua plataforma inteligente de análise imobiliária.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardHeader;
