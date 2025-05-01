
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, FileImage, BarChart2, ArrowLeft, ListRestart } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import ReactMarkdown from 'react-markdown';

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
}

const TomROIResults: React.FC<TomROIResultsProps> = ({
  result,
  onRecalculate,
  onReset,
  onExportPDF,
  onExportJPEG,
  onViewHistory,
  resultRef,
}) => {
  const isMobile = useIsMobile();
  
  // Function to format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-semibold text-gray-800 mb-3`}>
          Análise de ROI para {result.condominio}
        </h2>
        <p className="text-gray-600">
          Aqui está a análise detalhada para seu imóvel em {result.localizacao}
        </p>
      </div>

      {/* Results Card */}
      <div ref={resultRef}>
        <Card className="bg-white/80 backdrop-blur-lg border border-gray-200 shadow-lg">
          <CardHeader>
            <div className="flex flex-col gap-1">
              <h3 className="text-xl font-semibold text-gray-800">Detalhes da Propriedade</h3>
              <p className="text-sm text-gray-500">
                {result.modelo} • {result.quartos} quartos • {result.piscina ? 'Com piscina' : 'Sem piscina'} • {formatCurrency(result.valor_imovel)}
              </p>
            </div>
          </CardHeader>
          <CardContent className="prose prose-blue max-w-none">
            {result.resultado_texto ? (
              <ReactMarkdown>{result.resultado_texto}</ReactMarkdown>
            ) : (
              <p className="text-gray-600">Não foi possível carregar o resultado da análise.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
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
    </div>
  );
};

export default TomROIResults;
