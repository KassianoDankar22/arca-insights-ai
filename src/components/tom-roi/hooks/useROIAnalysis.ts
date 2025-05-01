
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { FormValues, ROIAnalysisResult } from '../types/analyzer-types';

export const useROIAnalysis = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ROIAnalysisResult | null>(null);

  const analyzeROI = async (data: FormValues) => {
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
        .insert([{
          ...analysis, 
          user_id: (await supabase.auth.getUser()).data.user?.id
        }])
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

  const resetAnalysis = () => {
    setResult(null);
  };

  const viewHistory = () => {
    navigate('/meus-rois');
  };

  return {
    isLoading,
    result,
    analyzeROI,
    resetAnalysis,
    viewHistory
  };
};
