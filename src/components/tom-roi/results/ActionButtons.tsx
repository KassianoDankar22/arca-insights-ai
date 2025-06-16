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
import { FileText, Download, FileImage, BarChart2, ArrowLeft, ListRestart } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface ActionButtonsProps {
  onRecalculate: () => void;
  onReset: () => void;
  onExportPDF: () => void;
  onExportJPEG: () => void;
  onViewHistory: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  onRecalculate,
  onReset,
  onExportPDF,
  onExportJPEG,
  onViewHistory,
}) => {
  const isMobile = useIsMobile();

  return (
    <div className={`flex ${isMobile ? 'flex-col space-y-3' : 'flex-row flex-wrap gap-3'} justify-center mt-8`}>
      <button
        className="gap-2 shadow-[0_4px_14px_0_rgb(0,118,255,39%)] hover:shadow-[0_6px_20px_rgba(0,118,255,23%)] hover:bg-[rgba(0,118,255,0.9)] px-8 py-2 bg-[#0070f3] rounded-md text-white font-light transition duration-200 ease-linear flex items-center"
        onClick={onRecalculate}
      >
        <ArrowLeft size={18} />
        Alterar Dados e Recalcular
      </button>
      
      <button
        className="gap-2 shadow-[0_4px_14px_0_rgb(0,118,255,39%)] hover:shadow-[0_6px_20px_rgba(0,118,255,23%)] hover:bg-[rgba(0,118,255,0.9)] px-8 py-2 bg-[#0070f3] rounded-md text-white font-light transition duration-200 ease-linear flex items-center"
        onClick={onReset}
      >
        <ListRestart size={18} />
        Gerar Novo ROI
      </button>
      
      <button
        className="gap-2 shadow-[0_4px_14px_0_rgb(0,118,255,39%)] hover:shadow-[0_6px_20px_rgba(0,118,255,23%)] hover:bg-[rgba(0,118,255,0.9)] px-8 py-2 bg-[#0070f3] rounded-md text-white font-light transition duration-200 ease-linear flex items-center"
        onClick={onExportPDF}
      >
        <FileText size={18} />
        Exportar PDF
      </button>
      
      <button
        className="gap-2 shadow-[0_4px_14px_0_rgb(0,118,255,39%)] hover:shadow-[0_6px_20px_rgba(0,118,255,23%)] hover:bg-[rgba(0,118,255,0.9)] px-8 py-2 bg-[#0070f3] rounded-md text-white font-light transition duration-200 ease-linear flex items-center"
        onClick={onExportJPEG}
      >
        <FileImage size={18} />
        Exportar JPEG
      </button>
      
      <button
        className="gap-2 shadow-[0_4px_14px_0_rgb(0,118,255,39%)] hover:shadow-[0_6px_20px_rgba(0,118,255,23%)] hover:bg-[rgba(0,118,255,0.9)] px-8 py-2 bg-[#0070f3] rounded-md text-white font-light transition duration-200 ease-linear flex items-center"
        onClick={onViewHistory}
      >
        <BarChart2 size={18} />
        Ver Histórico de Análises
      </button>
    </div>
  );
};

export default ActionButtons;
