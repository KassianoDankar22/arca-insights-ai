import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ArrowLeft, FileText, FileImage } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import ReactMarkdown from 'react-markdown';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface ROIAnalysis {
  id: string;
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
  criado_em: string;
}

const TomROIDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [analysis, setAnalysis] = useState<ROIAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (id) {
      fetchAnalysis(id);
    }
  }, [id]);

  const fetchAnalysis = async (analysisId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('roi_analises')
        .select('*')
        .eq('id', analysisId)
        .single();

      if (error) {
        throw error;
      }

      setAnalysis(data);
    } catch (error) {
      console.error('Error fetching ROI analysis:', error);
      toast.error('Erro', {
        description: 'Não foi possível carregar a análise de ROI.'
      });
      navigate('/meus-rois');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/meus-rois');
  };

  // Function to format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Function to export the analysis as PDF
  const handleExportPDF = async () => {
    if (!resultRef.current) return;
    
    try {
      const canvas = await html2canvas(resultRef.current, {
        scale: 2,
        logging: false,
        useCORS: true,
        backgroundColor: '#ffffff',
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });
      
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      pdf.save(`ROI_Analise_${analysis?.condominio.replace(/\s+/g, '_')}.pdf`);
      
      toast.success('PDF exportado', {
        description: 'Sua análise foi exportada com sucesso.'
      });
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      toast.error('Erro ao exportar', {
        description: 'Não foi possível exportar a análise para PDF.'
      });
    }
  };

  // Function to export the analysis as JPEG
  const handleExportJPEG = async () => {
    if (!resultRef.current) return;
    
    try {
      const canvas = await html2canvas(resultRef.current, {
        scale: 2,
        logging: false,
        useCORS: true,
        backgroundColor: '#ffffff',
      });
      
      const link = document.createElement('a');
      link.download = `ROI_Analise_${analysis?.condominio.replace(/\s+/g, '_')}.jpeg`;
      link.href = canvas.toDataURL('image/jpeg', 0.9);
      link.click();
      
      toast.success('Imagem exportada', {
        description: 'Sua análise foi exportada como imagem com sucesso.'
      });
    } catch (error) {
      console.error('Error exporting to JPEG:', error);
      toast.error('Erro ao exportar', {
        description: 'Não foi possível exportar a análise como imagem.'
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-white to-blue-50 p-4"
    >
      <div className="max-w-4xl mx-auto">
        <Button
          variant="outline"
          className="mb-6 gap-2"
          onClick={handleBack}
        >
          <ArrowLeft size={16} />
          Voltar para Histórico
        </Button>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin w-8 h-8 border-4 border-arca-blue border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>Carregando análise...</p>
          </div>
        ) : analysis ? (
          <>
            <div className="text-center mb-6">
              <h2 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-semibold text-gray-800 mb-3`}>
                Análise de ROI para {analysis.condominio}
              </h2>
              <p className="text-gray-600">
                Análise detalhada para o imóvel em {analysis.localizacao}
              </p>
            </div>

            <div ref={resultRef}>
              <Card className="bg-white/80 backdrop-blur-lg border border-gray-200 shadow-lg mb-6">
                <CardHeader>
                  <div className="flex flex-col gap-1">
                    <h3 className="text-xl font-semibold text-gray-800">Detalhes da Propriedade</h3>
                    <p className="text-sm text-gray-500">
                      {analysis.modelo} • {analysis.quartos} quartos • {analysis.piscina ? 'Com piscina' : 'Sem piscina'} • {formatCurrency(analysis.valor_imovel)}
                    </p>
                  </div>
                </CardHeader>
                <CardContent className="prose prose-blue max-w-none">
                  {analysis.resultado_texto ? (
                    <ReactMarkdown>{analysis.resultado_texto}</ReactMarkdown>
                  ) : (
                    <p className="text-gray-600">Não foi possível carregar o resultado da análise.</p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Export Buttons */}
            <div className={`flex ${isMobile ? 'flex-col space-y-3' : 'flex-row gap-3'} justify-center mt-8`}>
              <Button
                variant="outline"
                className="gap-2"
                onClick={handleExportPDF}
              >
                <FileText size={18} />
                Exportar PDF
              </Button>
              
              <Button
                variant="outline"
                className="gap-2"
                onClick={handleExportJPEG}
              >
                <FileImage size={18} />
                Exportar JPEG
              </Button>
            </div>
          </>
        ) : (
          <Card className="bg-white/70 backdrop-blur-lg">
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-medium mb-2">Análise não encontrada</h3>
              <p className="text-gray-600 mb-4">
                A análise de ROI que você está procurando não existe ou foi excluída.
              </p>
              <Button onClick={handleBack}>
                Voltar para o Histórico
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </motion.div>
  );
};

export default TomROIDetailPage;
