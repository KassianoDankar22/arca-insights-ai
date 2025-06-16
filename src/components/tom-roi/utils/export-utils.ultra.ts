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
import { toast } from 'sonner';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// Import the default logo as a fallback
import defaultArcaLogo from '@/assets/arca-logo.png';

// Function to export element content as PDF using html2canvas + jsPDF
export const exportToPDF = async (
  elementRef: any,
  fileName: string,
  uploadedLogoUrl?: string | null
) => {
  try {
    // Verificar se o elemento existe - aceita tanto RefObject quanto HTMLElement
    let element: HTMLElement | null = null;
    
    if (elementRef?.current) {
      // É um RefObject do React
      element = elementRef.current;
    } else if (elementRef instanceof HTMLElement) {
      // É um HTMLElement direto
      element = elementRef;
    } else if (elementRef) {
      // Tenta acessar como um elemento direto
      element = elementRef;
    }
    
    if (!element) {
      console.error('❌ Elemento não encontrado:', elementRef);
      throw new Error('Elemento não encontrado para exportação');
    }

    console.log('📄 Iniciando exportação PDF...', fileName);
    toast.loading('Preparando PDF...', { id: 'pdf-export' });

    // Aguardar renderização (tempo reduzido)
    await new Promise(resolve => setTimeout(resolve, 200));

    // Capturar com configurações otimizadas para velocidade
    const canvas = await html2canvas(element, {
      scale: 2, // Reduzir escala para melhor performance
      useCORS: true,
      allowTaint: false,
      backgroundColor: '#ffffff',
      logging: false,
      scrollX: 0,
      scrollY: 0,
      foreignObjectRendering: false,
      removeContainer: false,
      width: element.offsetWidth,
      height: element.offsetHeight,
      x: 0,
      y: 0,
      imageTimeout: 3000, // Timeout mais curto
      ignoreElements: function(element) {
        // Ignorar elementos que podem ser pesados
        return element.classList && (
          element.classList.contains('animate-spin') ||
          element.classList.contains('animate-pulse')
        );
      }
    });

    // Validações básicas do canvas
    if (!canvas) {
      throw new Error('Falha ao criar canvas');
    }

    const canvasWidth = canvas.width || 1;
    const canvasHeight = canvas.height || 1;
    
    if (canvasWidth <= 0 || canvasHeight <= 0) {
      throw new Error(`Dimensões inválidas do canvas: ${canvasWidth}x${canvasHeight}`);
    }

    console.log('✅ Canvas criado:', { width: canvasWidth, height: canvasHeight });

    // Criar PDF com formato A4 otimizado
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4', // A4 (210mm x 297mm)
      compress: true
    });

    // Dimensões A4 com margens mínimas para máximo aproveitamento
    const pageWidth = 210; // A4 width
    const pageHeight = 297; // A4 height
    const margin = 3; // Margem muito reduzida para aproveitar mais espaço
    const maxWidth = pageWidth - (margin * 2);
    const maxHeight = pageHeight - (margin * 2);

    // Calcular proporção de forma segura
    const ratio = canvasWidth / canvasHeight;
    const safeRatio = isFinite(ratio) && ratio > 0 ? ratio : 1;

    // Sempre usar o máximo espaço disponível
    let finalWidth = maxWidth; // Usar toda a largura disponível
    let finalHeight = maxHeight; // Usar toda a altura disponível

    // Se a proporção não se encaixar perfeitamente, ajustar mantendo a proporção
    const widthBasedHeight = finalWidth / safeRatio;
    const heightBasedWidth = finalHeight * safeRatio;

    if (widthBasedHeight <= maxHeight) {
      // Pode usar toda a largura
      finalHeight = widthBasedHeight;
    } else {
      // Usar toda a altura
      finalWidth = heightBasedWidth;
    }

    // Garantir dimensões mínimas robustas
    if (!isFinite(finalWidth) || finalWidth <= 0) {
      finalWidth = maxWidth;
    }
    if (!isFinite(finalHeight) || finalHeight <= 0) {
      finalHeight = maxHeight;
    }

    // Posicionamento centralizado com margens mínimas
    const x = (pageWidth - finalWidth) / 2;
    const y = (pageHeight - finalHeight) / 2;
    
    const finalX = isFinite(x) && x >= margin ? x : margin;
    const finalY = isFinite(y) && y >= margin ? y : margin;

    console.log('📊 Dimensões PDF Otimizadas:', { 
      finalWidth, finalHeight, finalX, finalY, 
      pageWidth, pageHeight, safeRatio, 
      aproveitamento: `${((finalWidth * finalHeight) / (maxWidth * maxHeight) * 100).toFixed(1)}%`,
      margem: `${margin}mm`
    });

    // Converter canvas para imagem com qualidade otimizada
    const imgData = canvas.toDataURL('image/jpeg', 0.85); // JPEG mais rápido que PNG
    
    if (!imgData || imgData === 'data:,') {
      throw new Error('Falha ao converter canvas para imagem');
    }

    // Adicionar imagem ao PDF
    pdf.addImage(
      imgData, 
      'JPEG', // Usar JPEG para velocidade
      finalX, 
      finalY, 
      finalWidth, 
      finalHeight,
      undefined,
      'MEDIUM' // Compressão média para velocidade
    );

    // Adicionar data no rodapé
    const now = new Date();
    const dateString = now.toLocaleDateString('pt-BR');
    
    pdf.setFontSize(8);
    pdf.setTextColor(128, 128, 128);
    pdf.text(
      `Gerado em ${dateString} por Arca AI`, 
      pageWidth / 2, 
      pageHeight - 10, 
      { align: 'center' }
    );

    // Salvar PDF
    pdf.save(fileName);

    toast.dismiss('pdf-export');
    toast.success('PDF gerado com sucesso!');
    
    console.log('✅ PDF exportado:', fileName);

  } catch (error) {
    toast.dismiss('pdf-export');
    console.error('❌ Erro ao exportar PDF:', error);
    
    // Mensagem de erro mais amigável
    let errorMessage = 'Erro ao gerar PDF';
    if (error instanceof Error) {
      if (error.message.includes('canvas')) {
        errorMessage = 'Erro ao capturar conteúdo. Tente novamente.';
      } else if (error.message.includes('dimensões')) {
        errorMessage = 'Erro nas dimensões. Verifique o conteúdo.';
      } else {
        errorMessage = 'Erro inesperado. Tente novamente.';
      }
    }
    
    toast.error(errorMessage);
    throw error;
  }
};

export const exportToJPEG = async (
  elementRef: React.RefObject<HTMLElement>,
  fileName: string
) => {
   const targetElement = elementRef.current;
   if (!targetElement) return;
   
   try {
     await new Promise(resolve => setTimeout(resolve, 100)); // Reduzir tempo de espera
     
     const canvas = await html2canvas(targetElement, {
       scale: 2, // Escala otimizada para velocidade
       logging: false,
       useCORS: true,
       allowTaint: false,
       backgroundColor: '#ffffff',
       width: targetElement.scrollWidth,
       height: targetElement.scrollHeight,
       x: 0,
       y: 0,
       foreignObjectRendering: false
     });

     const link = document.createElement('a');
     link.download = fileName;
     link.href = canvas.toDataURL('image/jpeg', 0.9); // Qualidade boa mas rápida
     link.click();
     
     toast.success('Imagem exportada');
     return true;

   } catch (error) {
     console.error('Error exporting to JPEG:', error);
     toast.error('Erro ao exportar imagem');
     return false;
   }
}; 