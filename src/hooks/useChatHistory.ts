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
import { useAuth } from './use-auth';

export interface ChatConversation {
  id: string;
  title: string;
  thread_id?: string;
  created_at: string;
  updated_at: string;
  is_archived: boolean;
  summary?: string;
  message_count?: number;
  last_message?: string;
}

export interface ChatMessage {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  created_at: string;
  metadata?: any;
}

export const useChatHistory = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<ChatConversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar conversas do usuário
  useEffect(() => {
    if (user) {
      loadConversations();
    } else {
      setConversations([]);
      setCurrentConversation(null);
      setMessages([]);
      setLoading(false);
    }
  }, [user]);

  const loadConversations = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('chat_conversations')
        .select(`
          *,
          chat_messages(count)
        `)
        .eq('user_id', user.id)
        .eq('is_archived', false)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      // Mapear dados com contagem de mensagens
      const conversationsWithCount = await Promise.all(
        (data || []).map(async (conv: any) => {
          // Buscar última mensagem
          const { data: lastMessage } = await supabase
            .from('chat_messages')
            .select('content, created_at')
            .eq('conversation_id', conv.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          // Buscar contagem de mensagens
          const { count } = await supabase
            .from('chat_messages')
            .select('id', { count: 'exact' })
            .eq('conversation_id', conv.id);

          return {
            ...conv,
            message_count: count || 0,
            last_message: lastMessage?.content || '',
          };
        })
      );

      setConversations(conversationsWithCount);
      setError(null);
    } catch (err) {
      console.error('Erro ao carregar conversas:', err);
      setError('Erro ao carregar histórico de conversas');
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (conversationId: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      setMessages(data || []);
      setError(null);
    } catch (err) {
      console.error('Erro ao carregar mensagens:', err);
      setError('Erro ao carregar mensagens');
    }
  };

  const createConversation = async (title: string, threadId?: string): Promise<ChatConversation | null> => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('chat_conversations')
        .insert([
          {
            user_id: user.id,
            title,
            thread_id: threadId,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      const newConversation = {
        ...data,
        message_count: 0,
        last_message: '',
      };

      setConversations(prev => [newConversation, ...prev]);
      setCurrentConversation(newConversation);
      setMessages([]);
      
      return newConversation;
    } catch (err) {
      console.error('Erro ao criar conversa:', err);
      setError('Erro ao criar nova conversa');
      return null;
    }
  };

  const addMessage = async (
    conversationId: string,
    role: 'user' | 'assistant' | 'system',
    content: string,
    metadata?: any
  ): Promise<ChatMessage | null> => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .insert([
          {
            conversation_id: conversationId,
            role,
            content,
            metadata,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      setMessages(prev => [...prev, data]);

      // Atualizar timestamp da conversa
      await supabase
        .from('chat_conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', conversationId);

      // Recarregar conversas para atualizar a ordem
      await loadConversations();

      return data;
    } catch (err) {
      console.error('Erro ao adicionar mensagem:', err);
      setError('Erro ao salvar mensagem');
      return null;
    }
  };

  const updateConversationTitle = async (conversationId: string, title: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('chat_conversations')
        .update({ title })
        .eq('id', conversationId);

      if (error) throw error;

      setConversations(prev =>
        prev.map(conv =>
          conv.id === conversationId ? { ...conv, title } : conv
        )
      );

      if (currentConversation?.id === conversationId) {
        setCurrentConversation(prev => prev ? { ...prev, title } : null);
      }
    } catch (err) {
      console.error('Erro ao atualizar título:', err);
      setError('Erro ao atualizar título da conversa');
    }
  };

  const archiveConversation = async (conversationId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('chat_conversations')
        .update({ is_archived: true })
        .eq('id', conversationId);

      if (error) throw error;

      setConversations(prev => prev.filter(conv => conv.id !== conversationId));

      if (currentConversation?.id === conversationId) {
        setCurrentConversation(null);
        setMessages([]);
      }
    } catch (err) {
      console.error('Erro ao arquivar conversa:', err);
      setError('Erro ao arquivar conversa');
    }
  };

  const selectConversation = async (conversation: ChatConversation) => {
    setCurrentConversation(conversation);
    await loadMessages(conversation.id);
  };

  const generateTitle = (content: string): string => {
    // Gerar título baseado no primeiro prompt do usuário
    const words = content.split(' ').slice(0, 6);
    let title = words.join(' ');
    
    if (content.length > 50) {
      title += '...';
    }

    // Se for muito genérico, usar templates
    if (title.length < 10) {
      const templates = [
        'Nova análise de ROI',
        'Consulta sobre investimento',
        'Análise de propriedade',
        'Cálculo financeiro',
        'Avaliação imobiliária'
      ];
      title = templates[Math.floor(Math.random() * templates.length)];
    }

    return title;
  };

  return {
    conversations,
    currentConversation,
    messages,
    loading,
    error,
    createConversation,
    addMessage,
    updateConversationTitle,
    archiveConversation,
    selectConversation,
    generateTitle,
    refresh: loadConversations,
  };
}; 