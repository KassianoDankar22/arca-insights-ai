
import React from 'react';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LogoUploaderProps {
  logoPreview: string | null;
  onLogoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveLogo: () => void;
}

const LogoUploader: React.FC<LogoUploaderProps> = ({ logoPreview, onLogoChange, onRemoveLogo }) => {
  return (
    <div className="md:col-span-1 flex flex-col justify-center items-center p-4 border-2 border-dashed rounded-lg bg-gray-50 hover:bg-gray-100 transition cursor-pointer relative">
      {logoPreview ? (
        <div className="mb-2 relative">
          <img 
            src={logoPreview} 
            alt="Logo Preview" 
            className="max-h-24 max-w-full object-contain" 
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
        <Upload className="h-10 w-10 text-gray-400 mb-2" />
      )}
      
      <label className="flex flex-col items-center cursor-pointer">
        <span className="font-medium text-gray-600 text-sm">
          {logoPreview ? 'Alterar logo' : 'Adicionar sua Logo'}
        </span>
        <span className="text-xs text-gray-400 mt-1">PNG, JPG ou SVG (max. 2MB)</span>
        <input
          type="file"
          className="hidden"
          accept="image/*"
          onChange={onLogoChange}
        />
      </label>
    </div>
  );
};

export default LogoUploader;
