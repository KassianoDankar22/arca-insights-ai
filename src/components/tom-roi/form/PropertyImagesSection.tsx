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

import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ImagePlus, X, Loader2 } from 'lucide-react';

interface PropertyImagesSectionProps {
  onImagesChange: (files: File[]) => void;
  onRemoveImage: (index: number) => void;
  imagePreviewUrls: string[];
  isUploading?: boolean;
}

const PropertyImagesSection: React.FC<PropertyImagesSectionProps> = ({ 
  onImagesChange,
  onRemoveImage,
  imagePreviewUrls = [],
  isUploading = false
}) => {
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isUploading) return;

    const files = event.target.files;
    if (!files || files.length === 0) return;

    const newFilesArray = Array.from(files).filter(file => file.type.startsWith('image/'));
    
    const urls = Array.isArray(imagePreviewUrls) ? imagePreviewUrls : [];
    const availableSlots = 5 - urls.length;
    
    if (availableSlots <= 0) {
        console.warn("Limite de 5 imagens atingido.");
        return;
    }
    
    const filesToAdd = newFilesArray.slice(0, availableSlots);
    
    if (filesToAdd.length > 0) {
        onImagesChange(filesToAdd);
    }

    event.target.value = '';
  };

  const handleRemoveClick = (index: number) => {
    if (isUploading) return;
    onRemoveImage(index);
  };

  const urls = Array.isArray(imagePreviewUrls) ? imagePreviewUrls : [];

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="property-images-input" className="text-base font-medium">
          Imagens da Propriedade (Opcional)
        </Label>
        <p className="text-xs text-gray-500 mt-1">
          Adicione até 5 imagens da propriedade para incluir no relatório
        </p>
      </div>

      <div className={`flex flex-wrap gap-4 mt-2 ${isUploading ? 'opacity-70 pointer-events-none' : ''}`}>
        {urls.map((url, index) => (
          <div key={url || index} className="relative group">
            <div className="w-24 h-24 border rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
              <img 
                src={url} 
                alt={`Preview da propriedade ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => { 
                  console.error(`Erro ao carregar preview: ${url}`); 
                  (e.target as HTMLImageElement).style.display = 'none';
                }} 
              />
            </div>
            <button
              type="button"
              onClick={() => handleRemoveClick(index)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
              aria-label={`Remover imagem ${index + 1}`}
              disabled={isUploading}
            >
              <X size={14} />
            </button>
          </div>
        ))}

        {urls.length < 5 && (
          <label 
            htmlFor="property-images-input" 
            className={`w-24 h-24 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center transition-colors ${
              isUploading 
                ? 'cursor-not-allowed bg-gray-100' 
                : 'cursor-pointer hover:border-arca-blue hover:bg-gray-50'
            }`}
            aria-disabled={isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 size={24} className="text-gray-400 animate-spin" />
                <span className="text-xs text-gray-500 mt-1">Enviando...</span>
              </>
            ) : (
              <>
                <ImagePlus size={24} className="text-gray-400" />
                <span className="text-xs text-gray-500 mt-1">Adicionar</span>
              </>
            )}
            <Input 
              id="property-images-input"
              type="file" 
              multiple
              accept="image/*" 
              className="hidden" 
              onChange={handleFileSelect}
              disabled={isUploading}
              key={urls.length}
            />
          </label>
        )}
      </div>
    </div>
  );
};

export default PropertyImagesSection; 