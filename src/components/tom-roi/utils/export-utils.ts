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

import { toast } from 'sonner';
import html2pdf from 'html2pdf.js';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
// Import o html2canvas aqui se for usar para JPEG e quiser ter um import único no topo.
// Caso contrário, a importação dinâmica no exportToJPEG funciona.
// import html2canvas from 'html2canvas'; 

// Import the default logo as a fallback
import defaultArcaLogo from '@/assets/arca-logo.png';

// Interface PropertyData ATUALIZADA para espelhar TomROIAnalyzer.tsx
interface PropertyData {
  propertyValue: number;
  financing: {
    downPayment: { amount: number; percentage: number };
    monthlyPayment: number;
    annualPayment: number;
    interestRate: number;
    prazoAnos?: number;
    financedAmount?: number; // Adicionado para consistência, já que TomROIAnalyzer o tem
  };
  rentalIncome: {
    monthly: number;
    annual: number;
    dailyRate: number;
    occupancyRate: number;
  };
  expenses: {
    monthly: {
      total: number;
      breakdown: Array<{ name: string; value: number }>;
    };
    annual: number;
    adminPercentage?: number; // Adicionado para consistência
  };
  netIncome: {
    monthly: number; // Líquido APÓS financiamento
    annual: number;  // Líquido APÓS financiamento
    aluguelMensalBruto?: number;
    despesasTotaisMensais?: number;
    liquidoPreFinanciamento?: number; // NOVO: Aluguel Bruto - Despesas Totais (Antes do financiamento)
  };
  appreciation: {
    percentage: number;
    amount: number;
  };
  totalAnnualReturn: number;
  roiPercentSobreEntrada?: number;
}

// Interface ROIAnalysisResult (simplificada, pois muitos dados agora vêm de PropertyData)
interface ROIAnalysisResult {
  condominio?: string;
  localizacao?: string;
  modelo?: string;
  quartos?: number | string;
  piscina?: boolean;
  // valor_imovel, entrada_valor, entrada_percentual, resultado_texto são usados para construir PropertyData
}

export interface ExportToPDFOptions {
  title?: string;
  subtitle?: string;
  logo?: string;
  showHeader?: boolean;
  showFooter?: boolean;
}

export interface ExportToJPEGOptions {
  quality?: number;
  scale?: number;
}

// IMPORTANTE: Esta função recebe dados já calculados (propertyData)
// e não deve alterar ou recalcular nenhum valor. Os dados exibidos no PDF 
// são exatamente os mesmos dados exibidos no frontend.
export const exportToPDF = async (element: HTMLElement | null, options: ExportToPDFOptions = {}) => {
  if (!element) return false;

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false
    });

    const imgData = canvas.toDataURL('image/jpeg', 1.0);
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth - 20;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // Adicionar cabeçalho se necessário
    if (options.showHeader) {
      if (options.logo) {
        pdf.addImage(options.logo, 'JPEG', 10, 10, 40, 20);
      }
      if (options.title) {
        pdf.setFontSize(16);
        pdf.text(options.title, pageWidth / 2, 15, { align: 'center' });
      }
      if (options.subtitle) {
        pdf.setFontSize(12);
        pdf.text(options.subtitle, pageWidth / 2, 25, { align: 'center' });
      }
    }

    // Adicionar a imagem do relatório
    pdf.addImage(imgData, 'JPEG', 10, options.showHeader ? 40 : 10, imgWidth, imgHeight);

    // Adicionar rodapé se necessário
    if (options.showFooter) {
      pdf.setFontSize(8);
      pdf.text('Análise de ROI gerada com Arca Insights AI', pageWidth / 2, pageHeight - 10, { align: 'center' });
    }

    pdf.save('analise-roi.pdf');
    return true;
  } catch (error) {
    console.error('Erro ao exportar para PDF:', error);
    return false;
  }
};

export const exportToJPEG = async (element: HTMLElement | null, options: ExportToJPEGOptions = {}) => {
  if (!element) return false;

  try {
    const canvas = await html2canvas(element, {
      scale: options.scale || 2,
      useCORS: true,
      logging: false
    });

    const link = document.createElement('a');
    link.download = 'analise-roi.jpg';
    link.href = canvas.toDataURL('image/jpeg', options.quality || 0.95);
    link.click();
    return true;
  } catch (error) {
    console.error('Erro ao exportar para JPEG:', error);
    return false;
  }
};

// Removendo funções não utilizadas que causavam erros de linter
// export const addLogo = async (pdf: jsPDF, ...) => { ... }
// export const addPropertyImages = async (pdf: jsPDF, ...) => { ... } 