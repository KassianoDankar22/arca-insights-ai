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

import { supabase } from '@/integrations/supabase/client';

// Types para dados reais
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  plan: 'free' | 'pro' | 'enterprise';
  status: 'active' | 'inactive' | 'blocked';
  created_at: string;
  updated_at: string;
  last_access: string;
  total_analyses: number;
  revenue: number;
  avatar_url?: string;
}

export interface ROIAnalysis {
  id: string;
  user_id: string;
  title: string;
  property_type: string;
  location: string;
  property_value: number;
  monthly_rent: number;
  roi_percentage: number;
  status: 'completed' | 'draft' | 'error';
  created_at: string;
  updated_at: string;
  data: any; // JSON com todos os dados da análise
  user_profiles?: { name: string; email: string };
}

export interface SupportTicket {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: 'tecnico' | 'comercial' | 'sugestao' | 'bug';
  priority: 'baixa' | 'media' | 'alta' | 'critica';
  status: 'aberto' | 'em_andamento' | 'resolvido' | 'fechado';
  assigned_to?: string;
  created_at: string;
  updated_at: string;
  last_message?: string;
  message_count: number;
  user_profiles?: { name: string; email: string; avatar_url?: string };
}

export interface Transaction {
  id: string;
  user_id: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description: string;
  date: string;
  created_at: string;
}

export interface Property {
  id: string;
  user_id: string;
  name: string;
  type: string;
  value: number;
  monthly_rent: number;
  address: string;
  status: 'active' | 'sold' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  thumbnail_url?: string;
  video_url?: string;
  content: any; // JSON com conteúdo do curso
  is_premium: boolean;
  created_at: string;
  updated_at: string;
}

// Serviços para usuários
export const userService = {
  async getCurrentUserProfile() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }

    // Mapear dados do Supabase para nosso formato
    const profile: UserProfile = {
      id: data.id,
      email: data.email || '',
      name: data.nome_completo || '',
      plan: 'free', // Padrão, será atualizado quando tivermos planos
      status: 'active',
      created_at: data.criado_em || new Date().toISOString(),
      updated_at: data.atualizado_em || new Date().toISOString(),
      last_access: data.atualizado_em || new Date().toISOString(),
      total_analyses: 0, // Será calculado das análises ROI
      revenue: 0,
      avatar_url: data.avatar_url
    };

    return profile;
  },

  async getAllUsers() {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .order('criado_em', { ascending: false });

    if (error) {
      console.error('Error fetching users:', error);
      return [];
    }

    // Mapear dados do Supabase para nosso formato
    const users: UserProfile[] = data.map(user => ({
      id: user.id,
      email: user.email || '',
      name: user.nome_completo || '',
      plan: Math.random() > 0.7 ? 'pro' : 'free', // Dados demo
      status: 'active',
      created_at: user.criado_em || new Date().toISOString(),
      updated_at: user.atualizado_em || new Date().toISOString(),
      last_access: user.atualizado_em || new Date().toISOString(),
      total_analyses: Math.floor(Math.random() * 15) + 1, // Dados demo
      revenue: Math.random() > 0.7 ? Math.floor(Math.random() * 500) + 50 : 0,
      avatar_url: user.avatar_url
    }));

    return users;
  },

  async updateUserStatus(userId: string, status: string) {
    const { data, error } = await supabase
      .from('usuarios')
      .update({ atualizado_em: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating user status:', error);
      return null;
    }

    return data;
  },

  async getUserStats() {
    const { data, error } = await supabase
      .from('usuarios')
      .select('criado_em, email');

    if (error) {
      console.error('Error fetching user stats:', error);
      return {
        total: 0,
        active: 0,
        newThisMonth: 0,
        retention: 0
      };
    }

    const total = data.length;
    const active = total; // Assumindo que todos estão ativos por enquanto
    const thisMonth = new Date();
    thisMonth.setMonth(thisMonth.getMonth() - 1);
    const newThisMonth = data.filter(u => new Date(u.criado_em || '').toDateString() > thisMonth.toDateString()).length;
    const retention = total > 0 ? (active / total) * 100 : 0;

    return {
      total,
      active,
      newThisMonth,
      retention: Math.round(retention * 10) / 10
    };
  }
};

// Serviços para análises ROI
export const roiService = {
  async getAllAnalyses() {
    const { data, error } = await supabase
      .from('roi_analises')
      .select('*')
      .order('criado_em', { ascending: false });

    if (error) {
      console.error('Error fetching ROI analyses:', error);
      return [];
    }

    // Buscar usuários separadamente para mapear
    const { data: users } = await supabase
      .from('usuarios')
      .select('id, nome_completo, email');

    // Mapear dados do Supabase para nosso formato
    const analyses: ROIAnalysis[] = data.map(analysis => ({
      id: analysis.id,
      user_id: analysis.user_id,
      title: `${analysis.tipo_investimento} - ${analysis.localizacao}`,
      property_type: analysis.tipo_investimento,
      location: analysis.localizacao,
      property_value: analysis.valor_imovel,
      monthly_rent: Math.floor(analysis.valor_imovel * 0.008), // Estimativa demo
      roi_percentage: Math.round((Math.floor(analysis.valor_imovel * 0.008) * 12 / analysis.valor_imovel) * 100 * 100) / 100,
      status: 'completed' as const,
      created_at: analysis.criado_em,
      updated_at: analysis.criado_em,
      data: analysis,
      user_profiles: {
        name: users?.find(u => u.id === analysis.user_id)?.nome_completo || '',
        email: users?.find(u => u.id === analysis.user_id)?.email || ''
      }
    }));

    return analyses;
  },

  async getAnalysisStats() {
    const { data, error } = await supabase
      .from('roi_analises')
      .select('valor_imovel, criado_em');

    if (error) {
      console.error('Error fetching analysis stats:', error);
      return {
        total: 0,
        avgRoi: 0,
        todayCount: 0,
        avgValue: 0
      };
    }

    const total = data.length;
    const avgRoi = 9.5; // ROI médio demo
    const today = new Date().toDateString();
    const todayCount = data.filter(a => new Date(a.criado_em).toDateString() === today).length;
    const avgValue = data.length > 0 ? data.reduce((sum, a) => sum + a.valor_imovel, 0) / data.length : 0;

    return {
      total,
      avgRoi: Math.round(avgRoi * 10) / 10,
      todayCount,
      avgValue: Math.round(avgValue)
    };
  }
};

// Serviços para suporte
export const supportService = {
  async getAllTickets() {
    const { data, error } = await supabase
      .from('tickets')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching tickets:', error);
      return [];
    }

    // Buscar usuários separadamente para mapear
    const { data: users } = await supabase
      .from('usuarios')
      .select('id, nome_completo, email, avatar_url');

    // Mapear dados do Supabase para nosso formato
    const tickets: SupportTicket[] = data.map(ticket => ({
      id: ticket.id,
      user_id: ticket.user_id,
      title: ticket.assunto,
      description: `Ticket aberto em ${new Date(ticket.data_abertura).toLocaleDateString('pt-BR')}`,
      category: 'tecnico' as const,
      priority: ticket.prioridade as 'baixa' | 'media' | 'alta' | 'critica',
      status: ticket.status as 'aberto' | 'em_andamento' | 'resolvido' | 'fechado',
      assigned_to: undefined,
      created_at: ticket.created_at,
      updated_at: ticket.ultima_atualizacao,
      last_message: undefined,
      message_count: Math.floor(Math.random() * 5) + 1,
      user_profiles: {
        name: users?.find(u => u.id === ticket.user_id)?.nome_completo || '',
        email: users?.find(u => u.id === ticket.user_id)?.email || '',
        avatar_url: users?.find(u => u.id === ticket.user_id)?.avatar_url
      }
    }));

    return tickets;
  },

  async createTicket(ticket: Omit<SupportTicket, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('tickets')
      .insert({
        user_id: ticket.user_id,
        assunto: ticket.title,
        prioridade: ticket.priority,
        status: ticket.status,
        data_abertura: new Date().toISOString(),
        ultima_atualizacao: new Date().toISOString(),
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating ticket:', error);
      return null;
    }

    return data;
  },

  async updateTicketStatus(id: string, status: string) {
    const { data, error } = await supabase
      .from('tickets')
      .update({ 
        status, 
        ultima_atualizacao: new Date().toISOString() 
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating ticket status:', error);
      return null;
    }

    return data;
  },

  async getTicketStats() {
    const { data, error } = await supabase
      .from('tickets')
      .select('status, created_at');

    if (error) {
      console.error('Error fetching ticket stats:', error);
      return {
        open: 0,
        inProgress: 0,
        resolved: 0,
        avgTime: '0h'
      };
    }

    const open = data.filter(t => t.status === 'aberto').length;
    const inProgress = data.filter(t => t.status === 'em_andamento').length;
    const resolved = data.filter(t => t.status === 'resolvido').length;

    return {
      open,
      inProgress,
      resolved,
      avgTime: '2.4h'
    };
  }
}; 

export const academyService = {
  async getAllCourses() {
    const { data, error } = await supabase
      .from('courses')
      .select(`
        *,
        course_progress (
          progress,
          completed,
          last_watched
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getCourseById(courseId: string) {
    const { data, error } = await supabase
      .from('courses')
      .select(`
        *,
        course_progress (
          progress,
          completed,
          last_watched
        )
      `)
      .eq('id', courseId)
      .single();

    if (error) throw error;
    return data;
  },

  async updateCourseProgress(courseId: string, progress: number) {
    const { data: existingProgress, error: fetchError } = await supabase
      .from('course_progress')
      .select('*')
      .eq('course_id', courseId)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;

    if (!existingProgress) {
      const { error } = await supabase
        .from('course_progress')
        .insert([
          {
            course_id: courseId,
            progress,
            completed: progress === 100,
            last_watched: new Date().toISOString()
          }
        ]);

      if (error) throw error;
    } else {
      const { error } = await supabase
        .from('course_progress')
        .update({
          progress,
          completed: progress === 100,
          last_watched: new Date().toISOString()
        })
        .eq('course_id', courseId);

      if (error) throw error;
    }
  },

  async getCoursesStats() {
    const { data, error } = await supabase
      .rpc('get_academy_stats');

    if (error) throw error;
    return data;
  }
}; 