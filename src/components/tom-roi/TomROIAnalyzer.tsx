
import React, { useState, useRef } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useIsMobile } from '@/hooks/use-mobile';
import TomROIForm from './TomROIForm';
import TomROIResults from './TomROIResults';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface FormValues {
  condominio: string;
  tipo_investimento: string;
  localizacao: string;
  modelo: string;
  quartos: string;
  piscina: boolean;
  valor_imovel: string;
  entrada_valor: string;
  entrada_percentual: string;
}

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

const TomROIAnalyzer: React.FC = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ROIAnalysisResult | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  
  const methods = useForm<FormValues>({
    defaultValues: {
      condominio: '',
      tipo_investimento: '',
      localizacao: '',
      modelo: '',
      quartos: '',
      piscina: false,
      valor_imovel: '',
      entrada_valor: '',
      entrada_percentual: '',
    }
  });

  const handleSubmit = async (data: FormValues) => {
    setIsLoading(true);
    
    try {
      // Call our OpenAI edge function
      const response = await fetch('https://dkykekkdjqajqfyrgqhi.functions.supabase.co/analyze-roi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          condominio: data.condominio,
          tipo_investimento: data.tipo_investimento,
          localizacao: data.localizacao,
          modelo: data.modelo,
          quartos: data.quartos,
          piscina: data.piscina,
          valor_imovel: data.valor_imovel,
          entrada_valor: data.entrada_valor || null,
          entrada_percentual: data.entrada_percentual || null,
        }),
      });

      const responseData = await response.json();
      
      if (!responseData.success) {
        throw new Error(responseData.error || 'Erro ao analisar ROI');
      }

      // Create analysis object
      const analysis: ROIAnalysisResult = {
        condominio: data.condominio,
        tipo_investimento: data.tipo_investimento,
        localizacao: data.localizacao,
        modelo: data.modelo,
        quartos: parseInt(data.quartos),
        piscina: data.piscina,
        valor_imovel: parseFloat(data.valor_imovel),
        entrada_valor: data.entrada_valor ? parseFloat(data.entrada_valor) : undefined,
        entrada_percentual: data.entrada_percentual ? parseFloat(data.entrada_percentual) : undefined,
        resultado_texto: responseData.resultado,
      };

      // Save to Supabase
      const { data: savedData, error } = await supabase
        .from('roi_analises')
        .insert([analysis])
        .select()
        .single();

      if (error) {
        console.error('Error saving ROI analysis:', error);
        toast({
          title: 'Erro ao salvar análise',
          description: 'A análise foi gerada mas não pôde ser salva.',
          variant: 'destructive',
        });
      } else {
        analysis.id = savedData.id;
        analysis.criado_em = savedData.criado_em;
      }

      setResult(analysis);
      
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Erro na análise',
        description: error instanceof Error ? error.message : 'Ocorreu um erro ao processar sua análise',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    methods.reset();
  };

  const handleRecalculate = () => {
    setResult(null);
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
      
      pdf.save(`ROI_Analise_${result?.condominio.replace(/\s+/g, '_')}.pdf`);
      
      toast({
        title: 'PDF exportado',
        description: 'Sua análise foi exportada com sucesso.',
      });
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      toast({
        title: 'Erro ao exportar',
        description: 'Não foi possível exportar a análise para PDF.',
        variant: 'destructive',
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
      link.download = `ROI_Analise_${result?.condominio.replace(/\s+/g, '_')}.jpeg`;
      link.href = canvas.toDataURL('image/jpeg', 0.9);
      link.click();
      
      toast({
        title: 'Imagem exportada',
        description: 'Sua análise foi exportada como imagem com sucesso.',
      });
    } catch (error) {
      console.error('Error exporting to JPEG:', error);
      toast({
        title: 'Erro ao exportar',
        description: 'Não foi possível exportar a análise como imagem.',
        variant: 'destructive',
      });
    }
  };

  // Function to navigate to the history page
  const handleViewHistory = () => {
    navigate('/meus-rois');
  };

  return (
    <div className={`p-4 max-w-6xl mx-auto min-h-[calc(100vh-80px)] ${isMobile ? 'pt-16 px-3' : 'py-8'}`}>
      <FormProvider {...methods}>
        {!result ? (
          <TomROIForm 
            onSubmit={handleSubmit} 
            isLoading={isLoading} 
          />
        ) : (
          <TomROIResults 
            result={result}
            onRecalculate={handleRecalculate}
            onReset={handleReset}
            onExportPDF={handleExportPDF}
            onExportJPEG={handleExportJPEG}
            onViewHistory={handleViewHistory}
            resultRef={resultRef}
          />
        )}
      </FormProvider>
    </div>
  );
};

export default TomROIAnalyzer;
