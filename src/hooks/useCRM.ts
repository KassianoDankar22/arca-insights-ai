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
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { toast } from 'sonner';

export interface CRMLead {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  source: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'won' | 'lost';
  value?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CRMStats {
  totalLeads: number;
  newLeads: number;
  qualifiedLeads: number;
  convertedLeads: number;
  totalValue: number;
  conversionRate: number;
}

export const useCRM = () => {
  const { user } = useAuth();
  const [leads, setLeads] = useState<CRMLead[]>([]);
  const [stats, setStats] = useState<CRMStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUsingMockData, setIsUsingMockData] = useState(false);

  useEffect(() => {
    if (user) {
      fetchCRMData();
    }
  }, [user]);

  const getMockLeads = (): CRMLead[] => [
    {
      id: '1',
      name: 'João Silva',
      email: 'joao@email.com',
      phone: '(11) 99999-9999',
      company: 'Silva Investimentos',
      source: 'website',
      status: 'qualified',
      value: 350000,
      notes: 'Interessado em apartamento no centro',
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '2',
      name: 'Maria Santos',
      email: 'maria@empresa.com',
      phone: '(11) 88888-8888',
      company: 'Santos & Cia',
      source: 'referral',
      status: 'proposal',
      value: 280000,
      notes: 'Procura casa com jardim',
      created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '3',
      name: 'Pedro Costa',
      email: 'pedro@email.com',
      phone: '(11) 77777-7777',
      source: 'social',
      status: 'new',
      value: 420000,
      notes: 'Primeiro contato via Instagram',
      created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  const getMockStats = (): CRMStats => ({
    totalLeads: 47,
    newLeads: 12,
    qualifiedLeads: 8,
    convertedLeads: 5,
    totalValue: 1250000,
    conversionRate: 15.8
  });

  const fetchCRMData = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Buscar dados reais da tabela crm_leads (ignorando tipos TS temporariamente)
      const { data: leadsData, error: leadsError } = await supabase
        .from('crm_leads' as any)
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (leadsError) {
        console.error('Error fetching CRM leads:', leadsError);
        // Fallback para dados mock se houver erro
        setLeads(getMockLeads());
        setStats(getMockStats());
        setIsUsingMockData(true);
      } else {
        // Converter dados do banco para o formato esperado
        const convertedLeads: CRMLead[] = (leadsData || []).map((lead: any) => ({
          id: lead.id,
          name: lead.name,
          email: lead.email,
          phone: lead.phone,
          company: lead.company,
          source: lead.source,
          status: lead.status,
          value: lead.value,
          notes: lead.notes,
          created_at: lead.created_at,
          updated_at: lead.updated_at
        }));
        
        setLeads(convertedLeads);
        calculateStats(convertedLeads);
        setIsUsingMockData(false);
        console.log('✅ CRM usando dados reais do Supabase');
      }
    } catch (error: any) {
      console.error('Error fetching CRM data:', error);
      setLeads(getMockLeads());
      setStats(getMockStats());
      setIsUsingMockData(true);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (leadsData: CRMLead[]) => {
    const total = leadsData.length;
    const newLeads = leadsData.filter(l => l.status === 'new').length;
    const qualified = leadsData.filter(l => l.status === 'qualified').length;
    const converted = leadsData.filter(l => l.status === 'won').length;
    const totalValue = leadsData.reduce((sum, lead) => sum + (lead.value || 0), 0);
    const conversionRate = total > 0 ? (converted / total) * 100 : 0;

    setStats({
      totalLeads: total,
      newLeads,
      qualifiedLeads: qualified,
      convertedLeads: converted,
      totalValue,
      conversionRate: Math.round(conversionRate * 100) / 100
    });
  };

  const createLead = async (leadData: Omit<CRMLead, 'id' | 'created_at' | 'updated_at'>) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const newLead = {
        ...leadData,
        user_id: user.id,
      };

      const { data, error } = await supabase
        .from('crm_leads' as any)
        .insert([newLead])
        .select()
        .single();

      if (error) {
        console.error('Error creating lead:', error);
        throw error;
      }

      await fetchCRMData(); // Refresh data
      toast.success('Lead criado com sucesso!');
      console.log('✅ Lead criado no Supabase:', data);
      return data;
    } catch (error) {
      console.error('Error creating lead:', error);
      toast.error('Erro ao criar lead');
      throw error;
    }
  };

  const updateLead = async (id: string, updates: Partial<CRMLead>) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { data, error } = await supabase
        .from('crm_leads' as any)
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating lead:', error);
        throw error;
      }

      await fetchCRMData(); // Refresh data
      toast.success('Lead atualizado com sucesso!');
      console.log('✅ Lead atualizado no Supabase:', data);
      return data;
    } catch (error) {
      console.error('Error updating lead:', error);
      toast.error('Erro ao atualizar lead');
      throw error;
    }
  };

  const deleteLead = async (id: string) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { error } = await supabase
        .from('crm_leads' as any)
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting lead:', error);
        throw error;
      }

      await fetchCRMData(); // Refresh data
      toast.success('Lead excluído com sucesso!');
      console.log('✅ Lead excluído do Supabase');
    } catch (error) {
      console.error('Error deleting lead:', error);
      toast.error('Erro ao excluir lead');
      throw error;
    }
  };

  return {
    leads,
    stats,
    loading,
    error,
    isUsingMockData,
    createLead,
    updateLead,
    deleteLead,
    refreshData: fetchCRMData
  };
}; 