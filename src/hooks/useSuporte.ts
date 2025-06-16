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

interface SupportTicket {
  id: string;
  title: string;
  description: string;
  category: 'technical' | 'billing' | 'feature' | 'bug' | 'other';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  created_at: string;
  updated_at: string;
}

interface SupportStats {
  openTickets: number;
  inProgressTickets: number;
  resolvedTickets: number;
  averageResponseTime: number;
}

export const useSuporte = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [stats, setStats] = useState<SupportStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchSupportData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      // Dados de exemplo até aplicar a migração
      const mockTickets: SupportTicket[] = [
        {
          id: '1',
          title: 'Erro ao exportar PDF',
          description: 'Não consigo exportar minha análise ROI em PDF',
          category: 'technical',
          priority: 'medium',
          status: 'open',
          created_at: '2024-01-15T10:00:00Z',
          updated_at: '2024-01-15T10:00:00Z'
        },
        {
          id: '2',
          title: 'Dúvida sobre plano Pro',
          description: 'Gostaria de saber mais sobre os benefícios do plano Pro',
          category: 'billing',
          priority: 'low',
          status: 'in_progress',
          created_at: '2024-01-14T14:30:00Z',
          updated_at: '2024-01-15T09:15:00Z'
        },
        {
          id: '3',
          title: 'Sugestão de nova funcionalidade',
          description: 'Seria interessante ter comparação entre propriedades',
          category: 'feature',
          priority: 'low',
          status: 'resolved',
          created_at: '2024-01-12T16:45:00Z',
          updated_at: '2024-01-14T11:20:00Z'
        }
      ];

      setTickets(mockTickets);

      // Calcular estatísticas
      const openTickets = mockTickets.filter(t => t.status === 'open').length;
      const inProgressTickets = mockTickets.filter(t => t.status === 'in_progress').length;
      const resolvedTickets = mockTickets.filter(t => t.status === 'resolved').length;

      setStats({
        openTickets,
        inProgressTickets,
        resolvedTickets,
        averageResponseTime: 4.5 // horas
      });

    } catch (err) {
      console.error('Erro ao buscar dados de suporte:', err);
      setError('Erro ao carregar tickets de suporte');
    } finally {
      setLoading(false);
    }
  };

  const createTicket = async (ticketData: Omit<SupportTicket, 'id' | 'created_at' | 'updated_at' | 'status'>) => {
    // Por enquanto, apenas adicionar localmente
    const newTicket: SupportTicket = {
      ...ticketData,
      id: Date.now().toString(),
      status: 'open',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    setTickets(prev => [newTicket, ...prev]);
    await fetchSupportData(); // Recalcular stats
    
    return newTicket;
  };

  const updateTicketStatus = async (id: string, status: SupportTicket['status']) => {
    setTickets(prev => prev.map(ticket => 
      ticket.id === id 
        ? { ...ticket, status, updated_at: new Date().toISOString() }
        : ticket
    ));
    await fetchSupportData(); // Recalcular stats
  };

  useEffect(() => {
    fetchSupportData();
  }, [user]);

  return {
    tickets,
    stats,
    loading,
    error,
    createTicket,
    updateTicketStatus,
    refetch: fetchSupportData
  };
}; 