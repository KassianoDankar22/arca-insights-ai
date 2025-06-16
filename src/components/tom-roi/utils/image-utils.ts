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

/**
 * Versão simplificada da função de processamento de imagem
 * @param file Arquivo da imagem a ser processada
 * @returns Objeto com o arquivo processado e a URL de preview
 */
export const processLogoImage = async (file: File): Promise<{ 
  processedFile: File | null; 
  previewUrl: string | null;
  originalPreviewUrl: string | null;
}> => {
  console.log("[processLogoImage] Iniciando processamento da logo");
  
  try {
    // Criar URLs de preview diretas, sem processamento adicional
    const originalPreviewUrl = URL.createObjectURL(file);
    console.log("[processLogoImage] URL original criada com sucesso");
    
    // SIMPLIFICAÇÃO: Retornar apenas as URLs sem processamento adicional
    // Isso evita problemas de compatibilidade e desempenho
    return {
      processedFile: null, // Não vamos processar para evitar problemas
      previewUrl: originalPreviewUrl, // Usar a mesma URL original
      originalPreviewUrl
    };
  } catch (error) {
    console.error('[processLogoImage] Erro ao processar logo:', error);
    toast.error('Não foi possível processar a imagem', { 
      description: 'Usando a versão original.' 
    });
    
    // Ainda tentamos criar uma URL para o arquivo original
    try {
      const fallbackUrl = URL.createObjectURL(file);
      return {
        processedFile: null,
        previewUrl: fallbackUrl,
        originalPreviewUrl: fallbackUrl
      };
    } catch (e) {
      console.error('[processLogoImage] Erro fatal ao criar URL:', e);
      return {
        processedFile: null,
        previewUrl: null,
        originalPreviewUrl: null
      };
    }
  }
};

/**
 * Limpa os recursos criados para evitar vazamentos de memória
 * @param urls Array de URLs criadas com URL.createObjectURL
 */
export const revokeObjectURLs = (urls: (string | null)[]): void => {
  urls.forEach(url => {
    if (url) {
      URL.revokeObjectURL(url);
    }
  });
}; 