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


import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface RoiAnalise {
  id: string;
  condominio: string;
  localizacao: string;
  criado_em: string;
  expira_em: string;
}

export const useAnalysisHistory = () => {
  const navigate = useNavigate();
  const [analyses, setAnalyses] = useState<RoiAnalise[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  useEffect(() => {
    fetchAnalyses();
  }, []);

  const fetchAnalyses = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('roi_analises')
        .select('*')
        .order('criado_em', { ascending: false });

      if (error) {
        throw error;
      }

      setAnalyses(data || []);
    } catch (error) {
      console.error('Error fetching ROI analyses:', error);
      toast.error('Erro', {
        description: 'Não foi possível carregar as análises de ROI.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeleteId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;

    try {
      const { error } = await supabase
        .from('roi_analises')
        .delete()
        .eq('id', deleteId);

      if (error) {
        throw error;
      }

      setAnalyses(analyses.filter(analysis => analysis.id !== deleteId));
      toast.success('Análise excluída', {
        description: 'A análise de ROI foi excluída com sucesso.'
      });
    } catch (error) {
      console.error('Error deleting ROI analysis:', error);
      toast.error('Erro', {
        description: 'Não foi possível excluir a análise de ROI.'
      });
    } finally {
      setDeleteDialogOpen(false);
      setDeleteId(null);
    }
  };

  const handleView = (id: string) => {
    navigate(`/analise/tom/${id}`);
  };

  const handleBack = () => {
    navigate('/analise/tom');
  };

  return {
    analyses,
    loading,
    deleteDialogOpen,
    setDeleteDialogOpen,
    handleDelete,
    confirmDelete,
    handleView,
    handleBack
  };
};
