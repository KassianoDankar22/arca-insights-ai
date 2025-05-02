
import React from 'react';
import { Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

interface SubmitButtonProps {
  isLoading: boolean;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ isLoading }) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="pt-4">
      <Button 
        type="submit" 
        disabled={isLoading}
        className={`w-full ${isMobile ? 'h-12' : 'h-14'} bg-arca-blue hover:bg-blue-600 text-white transition-colors rounded-lg`}
        aria-label="Iniciar análise"
      >
        {isLoading ? (
          <div className="flex items-center justify-center gap-2">
            <Loader className="animate-spin" size={20} />
            <span>🔍 Tom está analisando os dados...</span>
          </div>
        ) : (
          'Iniciar Análise com o Tom'
        )}
      </Button>
    </div>
  );
};

export default SubmitButton;
