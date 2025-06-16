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
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

interface LogoUploaderProps {
  logoPreview: string | null;
  onLogoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveLogo: () => void;
}

const LogoUploader: React.FC<LogoUploaderProps> = ({ logoPreview, onLogoChange, onRemoveLogo }) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex flex-col justify-center items-center p-3 border-2 border-dashed rounded-lg bg-gray-50 hover:bg-gray-100 transition cursor-pointer relative h-[85px]">
      {logoPreview ? (
        <div className="mb-0 relative">
          <img 
            src={logoPreview} 
            alt="Logo Preview" 
            className="max-h-16 max-w-full object-contain" 
          />
          <Button 
            type="button"
            variant="destructive" 
            size="sm"
            className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full"
            onClick={onRemoveLogo}
          >
            ×
          </Button>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <Upload className={`${isMobile ? 'h-5 w-5' : 'h-6 w-6'} text-gray-400 mb-1`} />
          <label className="flex flex-col items-center cursor-pointer">
            <span className={`font-medium text-gray-600 ${isMobile ? 'text-xs' : 'text-sm'}`}>
              Adicionar Logo
            </span>
            <span className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-gray-400 mt-0.5`}>PNG, JPG (máx. 2MB)</span>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={onLogoChange}
            />
          </label>
        </div>
      )}
    </div>
  );
};

export default LogoUploader;
