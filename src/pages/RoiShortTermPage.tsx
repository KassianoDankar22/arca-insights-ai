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
import TomROIAnalyzer from '@/components/tom-roi/TomROIAnalyzer';
import { motion } from 'framer-motion';
import { BarChart2, ArrowRight, PieChart, ChevronRight } from 'lucide-react';

const RoiShortTermPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header Section */}
      <div className="max-w-6xl mx-auto pt-8 pb-6 px-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-blue-100 rounded-md">
            <BarChart2 className="text-arca-blue" size={24} />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-arca-blue to-blue-600 bg-clip-text text-transparent">
            Análise de ROI para Curto Prazo
          </h1>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center text-gray-600 gap-2 md:gap-4 pl-1">
          <div className="flex items-center gap-2">
            <PieChart size={16} className="text-blue-500" />
            <span>Análise profissional</span>
          </div>
          <div className="hidden md:block text-gray-400">
            <ChevronRight size={16} />
          </div>
          <div className="flex items-center gap-2">
            <ArrowRight size={16} className="text-green-500" />
            <span>Resultados em segundos</span>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <TomROIAnalyzer showBackButton={true} backPath="/" backText="Voltar para Dashboard" />
      
      {/* Footer note */}
      <div className="max-w-6xl mx-auto p-4 text-center text-sm text-gray-500 italic mt-6">
        Powered by IA para fornecer análises precisas de retorno sobre investimento para o mercado imobiliário
      </div>
    </motion.div>
  );
};

export default RoiShortTermPage;
