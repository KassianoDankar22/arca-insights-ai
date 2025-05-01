
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
      <Button
        variant="outline"
        className="gap-2"
        onClick={onRecalculate}
      >
        <ArrowLeft size={18} />
        Alterar Dados e Recalcular
      </Button>
      
      <Button
        variant="outline"
        className="gap-2"
        onClick={onReset}
      >
        <ListRestart size={18} />
        Gerar Novo ROI
      </Button>
      
      <Button
        variant="outline"
        className="gap-2"
        onClick={onExportPDF}
      >
        <FileText size={18} />
        Exportar PDF
      </Button>
      
      <Button
        variant="outline"
        className="gap-2"
        onClick={onExportJPEG}
      >
        <FileImage size={18} />
        Exportar JPEG
      </Button>
      
      <Button
        className="gap-2 bg-arca-blue hover:bg-blue-600 text-white"
        onClick={onViewHistory}
      >
        <BarChart2 size={18} />
        Ver Histórico de Análises
      </Button>
    </div>
  );
};

export default ActionButtons;
