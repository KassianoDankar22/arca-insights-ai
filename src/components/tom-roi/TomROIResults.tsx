
import React from 'react';
import ResultHeader from './results/ResultHeader';
import PropertyDetailsCard from './results/PropertyDetailsCard';
import ActionButtons from './results/ActionButtons';

interface ROIAnalysisResult {
  id?: string;
  condominio: string;
  tipo_investimento: string;
  localizacao: string;
  modelo: string;
  quartos: number;
  piscina: boolean;
  valor_imovel: number;
  entrada_valor?: number;
  entrada_percentual?: number;
  resultado_texto?: string;
  criado_em?: string;
}

interface TomROIResultsProps {
  result: ROIAnalysisResult;
  onRecalculate: () => void;
  onReset: () => void;
  onExportPDF: () => void;
  onExportJPEG: () => void;
  onViewHistory: () => void;
  resultRef: React.RefObject<HTMLDivElement>;
  showBackButton?: boolean;
  backPath?: string;
  backText?: string;
}

const TomROIResults: React.FC<TomROIResultsProps> = ({
  result,
  onRecalculate,
  onReset,
  onExportPDF,
  onExportJPEG,
  onViewHistory,
  resultRef,
  showBackButton = false,
  backPath,
  backText,
}) => {
  return (
    <div className="space-y-6">
      <ResultHeader 
        condominioName={result.condominio} 
        location={result.localizacao}
        showBackButton={showBackButton}
        backPath={backPath}
        backText={backText}
      />

      <PropertyDetailsCard
        model={result.modelo}
        bedrooms={result.quartos}
        hasPiscina={result.piscina}
        propertyValue={result.valor_imovel}
        resultText={result.resultado_texto}
        cardRef={resultRef}
      />

      <ActionButtons
        onRecalculate={onRecalculate}
        onReset={onReset}
        onExportPDF={onExportPDF}
        onExportJPEG={onExportJPEG}
        onViewHistory={onViewHistory}
      />
    </div>
  );
};

export default TomROIResults;
