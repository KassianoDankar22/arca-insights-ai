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
import type { UserProfile, ROIAnalysis, SupportTicket } from '@/lib/supabase-service';

// Dados demo estruturados baseados em usuários reais
const generateDemoData = (realUsers: any[]) => {
  const users: UserProfile[] = realUsers.map((user, index) => ({
    id: user.id,
    email: user.email || `usuario${index + 1}@email.com`,
    name: user.nome_completo || `Usuário ${index + 1}`,
    plan: Math.random() > 0.7 ? (Math.random() > 0.5 ? 'pro' : 'enterprise') : 'free',
    status: Math.random() > 0.9 ? 'inactive' : 'active',
    created_at: user.criado_em || new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: user.atualizado_em || new Date().toISOString(),
    last_access: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    total_analyses: Math.floor(Math.random() * 20) + 1,
    revenue: Math.random() > 0.7 ? Math.floor(Math.random() * 800) + 50 : 0,
    avatar_url: user.avatar_url
  }));

  // Adicionar usuários demo se não houver suficientes
  while (users.length < 20) {
    const index = users.length;
    users.push({
      id: `demo-${index}`,
      email: `demo${index}@arcaai.com`,
      name: `Demo User ${index}`,
      plan: Math.random() > 0.7 ? 'pro' : 'free',
      status: 'active',
      created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date().toISOString(),
      last_access: new Date(Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000).toISOString(),
      total_analyses: Math.floor(Math.random() * 15) + 1,
      revenue: Math.random() > 0.6 ? Math.floor(Math.random() * 500) + 100 : 0,
      avatar_url: undefined
    });
  }

  return users;
};

// Hook para dados de usuários (Admin)
export const useUsers = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    newThisMonth: 0,
    retention: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

    const fetchUsers = async () => {
      try {
        setLoading(true);
        
        // Buscar usuários reais do Supabase
        const { data: realUsers, error: supabaseError } = await supabase
          .from('usuarios')
          .select('*')
          .order('criado_em', { ascending: false });

        if (supabaseError) {
          console.error('Supabase error:', supabaseError);
        }

        // Gerar dados demo baseados nos usuários reais
        const demoUsers = generateDemoData(realUsers || []);
        
        const total = demoUsers.length;
        const active = demoUsers.filter(u => u.status === 'active').length;
        const thisMonth = new Date();
        thisMonth.setMonth(thisMonth.getMonth() - 1);
        const newThisMonth = demoUsers.filter(u => new Date(u.created_at) > thisMonth).length;
        const retention = total > 0 ? (active / total) * 100 : 0;
        
        setUsers(demoUsers);
        setStats({
          total,
          active,
          newThisMonth,
          retention: Math.round(retention * 10) / 10
        });
        setError(null);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Erro ao carregar usuários');
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchUsers();
  }, []);

  const makeAdmin = async (userId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('set-admin-role', {
        body: { userId },
      })

      if (error) {
        throw new Error(`Erro ao tornar usuário admin: ${error.message}`);
      }

      // Atualizar a UI localmente para refletir a mudança
      setUsers(currentUsers =>
        currentUsers.map(user =>
          user.id === userId ? { ...user, plan: 'enterprise' } : user
        )
      );

      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const promoteToPro = async (userId: string) => {
    try {
      // Atualizar localmente (simulação - em produção usaria Edge Function)
      setUsers(currentUsers =>
        currentUsers.map(user =>
          user.id === userId ? { ...user, plan: 'pro' } : user
        )
      );
      
      return { success: true };
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const toggleUserStatus = async (userId: string) => {
    try {
      // Atualizar localmente (simulação)
      setUsers(currentUsers =>
        currentUsers.map(user =>
          user.id === userId ? { 
            ...user, 
            status: user.status === 'active' ? 'blocked' : 'active' 
          } : user
        )
      );
      
      return { success: true };
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const exportUsers = () => {
    try {
      const csvContent = [
        ['Nome', 'Email', 'Plano', 'Status', 'Cadastro', 'Análises', 'Receita'].join(','),
        ...users.map(user => [
          user.name || '',
          user.email,
          user.plan,
          user.status,
          new Date(user.created_at).toLocaleDateString('pt-BR'),
          user.total_analyses,
          user.revenue.toFixed(2)
        ].join(','))
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `usuarios_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      return { success: true };
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const sendEmail = async (userId: string, userEmail: string) => {
    try {
      // Simulação - em produção integraria com serviço de email
      const subject = 'Mensagem da administração - Arca Insights';
      const body = 'Olá! Esta é uma mensagem da administração da Arca Insights.';
      
      // Abrir cliente de email do usuário
      window.location.href = `mailto:${userEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      
      return { success: true };
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const resetUserPassword = async (userId: string, newPassword: string) => {
    try {
      // Usar Edge Function para resetar senha
      const { data, error } = await supabase.functions.invoke('reset-user-password', {
        body: { userId, newPassword },
      })

      if (error) {
        throw new Error(`Erro ao resetar senha: ${error.message}`);
      }

      return { success: true, data };
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const createUser = async (userData: {
    name: string;
    email: string;
    password: string;
    plan: 'free' | 'pro' | 'enterprise';
    role: 'user' | 'admin' | 'super_admin';
    status: 'active' | 'inactive';
  }) => {
    try {
      console.log('🔧 [createUser] Criando usuário:', userData);

      // Verificar se email já existe
      const existingUser = users.find(u => u.email === userData.email);
      if (existingUser) {
        throw new Error('Este email já está em uso');
      }

      // Gerar ID único
      const newUserId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // Criar perfil do usuário
      const newUserProfile: UserProfile = {
        id: newUserId,
        email: userData.email,
        name: userData.name,
        plan: userData.plan,
        status: userData.status,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        last_access: new Date().toISOString(),
        total_analyses: 0,
        revenue: 0,
        avatar_url: undefined
      };

      // 1. Tentativa real no Supabase (pode falhar, mas não é crítico para demo)
      try {
        const { error: profileError } = await supabase
          .from('usuarios')
          .insert({
            id: newUserId,
            email: userData.email,
            nome_completo: userData.name,
            plano: userData.plan,
            status: userData.status,
            criado_em: new Date().toISOString(),
            atualizado_em: new Date().toISOString()
          });

        if (profileError) {
          console.warn('Aviso: Não foi possível inserir no banco real:', profileError);
        } else {
          console.log('✅ Usuário inserido no banco real');
        }
      } catch (realDbError) {
        console.warn('Aviso: Banco real indisponível, continuando com simulação:', realDbError);
      }

      // 2. Se for admin/super admin, salvar no localStorage para simulação
      if (userData.role === 'admin' || userData.role === 'super_admin') {
        localStorage.setItem(`admin_level_${newUserId}`, userData.role);
        console.log(`🔑 Admin role salvo no localStorage: ${userData.role}`);

        // Também adicionar à lista de emails admin (temporário)
        const adminEmails = JSON.parse(localStorage.getItem('temp_admin_emails') || '[]');
        if (!adminEmails.includes(userData.email)) {
          adminEmails.push(userData.email);
          localStorage.setItem('temp_admin_emails', JSON.stringify(adminEmails));
          console.log('📧 Email adicionado à lista de admins temporários');
        }
      }

      // 3. Atualizar estado local
      setUsers(currentUsers => [newUserProfile, ...currentUsers]);
      
      // 4. Atualizar stats
      setStats(currentStats => ({
        ...currentStats,
        total: currentStats.total + 1,
        active: userData.status === 'active' ? currentStats.active + 1 : currentStats.active,
        newThisMonth: currentStats.newThisMonth + 1
      }));

      console.log('✅ [createUser] Usuário criado com sucesso!');
      
      // 5. Mostrar dados criados para debug
      console.log('👤 Novo usuário:', {
        id: newUserId,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        plan: userData.plan,
        status: userData.status
      });

      return { success: true, user: newUserProfile };
    } catch (error) {
      console.error('❌ [createUser] Erro ao criar usuário:', error);
      throw error;
    }
  };

  return { users, stats, loading, error, makeAdmin, promoteToPro, toggleUserStatus, exportUsers, sendEmail, resetUserPassword, createUser, refetch: fetchUsers };
};

// Hook para dados de análises ROI (Admin)
export const useROIAnalyses = () => {
  const [analyses, setAnalyses] = useState<(ROIAnalysis & { user_profiles: { name: string; email: string } })[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    avgRoi: 0,
    todayCount: 0,
    avgValue: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalyses = async () => {
      try {
        setLoading(true);
        
        // Buscar análises reais do Supabase
        const { data: realAnalyses, error: supabaseError } = await supabase
          .from('roi_analises')
          .select('*')
          .order('criado_em', { ascending: false });

        if (supabaseError) {
          console.error('Supabase error:', supabaseError);
        }

        // Buscar usuários para mapear
        const { data: users } = await supabase
          .from('usuarios')
          .select('id, nome_completo, email');

        // Mapear dados reais + demo
        const analysesData = (realAnalyses || []).map(analysis => ({
          id: analysis.id,
          user_id: analysis.user_id,
          title: `${analysis.tipo_investimento} - ${analysis.localizacao}`,
          property_type: analysis.tipo_investimento,
          location: analysis.localizacao,
          property_value: analysis.valor_imovel,
          monthly_rent: Math.floor(analysis.valor_imovel * 0.008),
          roi_percentage: Math.round((Math.floor(analysis.valor_imovel * 0.008) * 12 / analysis.valor_imovel) * 100 * 100) / 100,
          status: 'completed' as const,
          created_at: analysis.criado_em,
          updated_at: analysis.criado_em,
          data: analysis,
          user_profiles: {
            name: users?.find(u => u.id === analysis.user_id)?.nome_completo || 'Usuário',
            email: users?.find(u => u.id === analysis.user_id)?.email || 'email@demo.com'
          }
        }));

        // Adicionar análises demo
        for (let i = 0; i < 15; i++) {
          const value = Math.floor(Math.random() * 800000) + 200000;
          const rent = Math.floor(value * (0.006 + Math.random() * 0.004));
          analysesData.push({
            id: `demo-${i}`,
            user_id: `demo-user-${i}`,
            title: `Apartamento ${i + 1} - ${['São Paulo', 'Rio de Janeiro', 'Belo Horizonte'][Math.floor(Math.random() * 3)]}`,
            property_type: ['Apartamento', 'Casa', 'Comercial'][Math.floor(Math.random() * 3)],
            location: ['São Paulo - SP', 'Rio de Janeiro - RJ', 'Belo Horizonte - MG'][Math.floor(Math.random() * 3)],
            property_value: value,
            monthly_rent: rent,
            roi_percentage: Math.round((rent * 12 / value) * 100 * 100) / 100,
            status: 'completed' as const,
            created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date().toISOString(),
            data: {
              entrada_percentual: 30,
              entrada_valor: Math.floor(value * 0.3),
              quartos: Math.floor(Math.random() * 3) + 1,
              piscina: Math.random() > 0.5,
              condominio: `Condomínio ${i + 1}`
            } as any,
            user_profiles: {
              name: `Demo User ${i + 1}`,
              email: `demo${i + 1}@arcaai.com`
            }
          });
        }

        const total = analysesData.length;
        const avgRoi = analysesData.length > 0 ? analysesData.reduce((sum, a) => sum + a.roi_percentage, 0) / analysesData.length : 0;
        const today = new Date().toDateString();
        const todayCount = analysesData.filter(a => new Date(a.created_at).toDateString() === today).length;
        const avgValue = analysesData.length > 0 ? analysesData.reduce((sum, a) => sum + a.property_value, 0) / analysesData.length : 0;
        
        setAnalyses(analysesData);
        setStats({
          total,
          avgRoi: Math.round(avgRoi * 10) / 10,
          todayCount,
          avgValue: Math.round(avgValue)
        });
        setError(null);
      } catch (err) {
        console.error('Error fetching analyses:', err);
        setError('Erro ao carregar análises');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyses();
  }, []);

  return { analyses, stats, loading, error, refetch: () => window.location.reload() };
};

// Hook para dados de suporte (Admin)
export const useSupportTickets = () => {
  const [tickets, setTickets] = useState<(SupportTicket & { user_profiles: { name: string; email: string; avatar_url?: string } })[]>([]);
  const [stats, setStats] = useState({
    open: 0,
    inProgress: 0,
    resolved: 0,
    avgTime: '0h'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        
        // Buscar tickets reais do Supabase
        const { data: realTickets, error: supabaseError } = await supabase
          .from('tickets')
          .select('*')
          .order('created_at', { ascending: false });

        if (supabaseError) {
          console.error('Supabase error:', supabaseError);
        }

        // Buscar usuários para mapear
        const { data: users } = await supabase
          .from('usuarios')
          .select('id, nome_completo, email, avatar_url');

        // Mapear tickets reais
        const ticketsData = (realTickets || []).map(ticket => ({
          id: ticket.id,
          user_id: ticket.user_id,
          title: ticket.assunto,
          description: `Ticket criado em ${new Date(ticket.data_abertura).toLocaleDateString('pt-BR')}`,
          category: 'tecnico' as const,
          priority: ticket.prioridade as 'baixa' | 'media' | 'alta' | 'critica',
          status: ticket.status as 'aberto' | 'em_andamento' | 'resolvido' | 'fechado',
          assigned_to: undefined,
          created_at: ticket.created_at,
          updated_at: ticket.ultima_atualizacao,
          last_message: undefined,
          message_count: Math.floor(Math.random() * 5) + 1,
          user_profiles: {
            name: users?.find(u => u.id === ticket.user_id)?.nome_completo || 'Usuário',
            email: users?.find(u => u.id === ticket.user_id)?.email || 'email@demo.com',
            avatar_url: users?.find(u => u.id === ticket.user_id)?.avatar_url
          }
        }));

        // Adicionar tickets demo
        const categories: ('tecnico' | 'comercial' | 'sugestao' | 'bug')[] = ['tecnico', 'comercial', 'sugestao', 'bug'];
        const priorities: ('baixa' | 'media' | 'alta' | 'critica')[] = ['baixa', 'media', 'alta', 'critica'];
        const statuses: ('aberto' | 'em_andamento' | 'resolvido' | 'fechado')[] = ['aberto', 'em_andamento', 'resolvido', 'fechado'];

        for (let i = 0; i < 12; i++) {
          ticketsData.push({
            id: `demo-ticket-${i}`,
            user_id: `demo-user-${i}`,
            title: `Ticket Demo ${i + 1}`,
            description: `Descrição do ticket demo ${i + 1}`,
            category: categories[Math.floor(Math.random() * categories.length)] as 'tecnico',
            priority: priorities[Math.floor(Math.random() * priorities.length)],
            status: statuses[Math.floor(Math.random() * statuses.length)],
            assigned_to: Math.random() > 0.5 ? 'Admin' : undefined,
            created_at: new Date(Date.now() - Math.random() * 15 * 24 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date(Date.now() - Math.random() * 5 * 24 * 60 * 60 * 1000).toISOString(),
            last_message: `Última mensagem do ticket ${i + 1}`,
            message_count: Math.floor(Math.random() * 8) + 1,
            user_profiles: {
              name: `Demo User ${i + 1}`,
              email: `demo${i + 1}@arcaai.com`,
              avatar_url: undefined
            }
          });
        }

        const open = ticketsData.filter(t => t.status === 'aberto').length;
        const inProgress = ticketsData.filter(t => t.status === 'em_andamento').length;
        const resolved = ticketsData.filter(t => t.status === 'resolvido').length;
        
        setTickets(ticketsData);
        setStats({
          open,
          inProgress,
          resolved,
          avgTime: '2.4h'
        });
        setError(null);
      } catch (err) {
        console.error('Error fetching tickets:', err);
        setError('Erro ao carregar tickets');
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  return { tickets, stats, loading, error, refetch: () => window.location.reload() };
};

// Hook genérico para dados em tempo real
export const useRealtimeData = <T>(
  tableName: string, 
  fetchFunction: () => Promise<T>,
  dependencies: any[] = []
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await fetchFunction();
        setData(result);
        setError(null);
      } catch (err) {
        console.error(`Error fetching ${tableName}:`, err);
        setError(`Erro ao carregar ${tableName}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, dependencies);

  return { data, loading, error, refetch: () => window.location.reload() };
};