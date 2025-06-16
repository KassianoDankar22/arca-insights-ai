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
import type { Ticket, NovoTicketData, MensagemChat, NovaMensagemData } from '../../app/suporte/types';

/**
 * Cria um novo ticket de suporte para o usuário logado.
 * @param ticketData Dados do novo ticket, incluindo a primeira mensagem.
 */
export const criarTicket = async (ticketData: NovoTicketData): Promise<Ticket> => {
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  if (sessionError || !session?.user) {
    console.error('Erro ao buscar sessão ou usuário não logado:', sessionError);
    throw new Error(sessionError?.message || 'Usuário não autenticado para criar ticket.');
  }
  const userId = session.user.id;

  // 1. Criar o ticket na tabela 'tickets'
  const ticketParaInserir = {
    user_id: userId,
    assunto: ticketData.assunto,
    status: ticketData.status || 'Aberto', // Default para 'Aberto'
    prioridade: ticketData.prioridade || 'Média', // Default para 'Média'
    data_abertura: new Date().toISOString(),
    ultima_atualizacao: new Date().toISOString(),
  };

  const { data: novoTicket, error: ticketError } = await supabase
    .from('tickets')
    .insert(ticketParaInserir)
    .select()
    .single();

  if (ticketError) {
    console.error('Erro ao criar ticket:', ticketError);
    throw ticketError;
  }

  // 2. Adicionar a primeira mensagem na tabela 'ticket_mensagens'
  const primeiraMensagemParaInserir = {
    ticket_id: novoTicket.id,
    remetente_id: userId,
    tipo_remetente: 'cliente' as const,
    conteudo: ticketData.primeiraMensagem,
    timestamp: new Date().toISOString(),
    lida: false,
  };

  const { data: novaMensagem, error: mensagemError } = await supabase
    .from('ticket_mensagens')
    .insert(primeiraMensagemParaInserir)
    .select()
    .single();

  if (mensagemError) {
    console.error('Erro ao adicionar primeira mensagem:', mensagemError);
    // Aqui poderíamos tentar deletar o ticket criado se a mensagem falhar,
    // mas por simplicidade, vamos apenas logar e lançar o erro.
    throw mensagemError;
  }

  // Retornar o ticket completo com a primeira mensagem
  return {
    id: novoTicket.id,
    userId: novoTicket.user_id,
    assunto: novoTicket.assunto,
    status: novoTicket.status as Ticket['status'],
    prioridade: novoTicket.prioridade as Ticket['prioridade'],
    dataAbertura: novoTicket.data_abertura,
    ultimaAtualizacao: novoTicket.ultima_atualizacao,
    mensagens: [{
      id: novaMensagem.id,
      ticketId: novaMensagem.ticket_id,
      remetenteId: novaMensagem.remetente_id,
      tipoRemetente: novaMensagem.tipo_remetente as MensagemChat['tipoRemetente'],
      conteudo: novaMensagem.conteudo,
      timestamp: novaMensagem.timestamp,
      lida: novaMensagem.lida,
    }],
  };
};

/**
 * Busca todos os tickets do usuário logado.
 */
export const getTicketsDoUsuario = async (): Promise<Ticket[]> => {
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  if (sessionError || !session?.user) {
    console.error('Erro ao buscar sessão ou usuário não logado:', sessionError);
    throw new Error(sessionError?.message || 'Usuário não autenticado.');
  }
  const userId = session.user.id;

  const { data: tickets, error } = await supabase
    .from('tickets')
    .select(`
      id,
      user_id,
      assunto,
      status,
      prioridade,
      data_abertura,
      ultima_atualizacao,
      ticket_mensagens (*)
    `)
    .eq('user_id', userId)
    .order('ultima_atualizacao', { ascending: false });

  if (error) {
    console.error('Erro ao buscar tickets do usuário:', error);
    throw error;
  }

  return tickets.map(ticket => ({
    id: ticket.id,
    userId: ticket.user_id,
    assunto: ticket.assunto,
    status: ticket.status as Ticket['status'],
    prioridade: ticket.prioridade as Ticket['prioridade'],
    dataAbertura: ticket.data_abertura,
    ultimaAtualizacao: ticket.ultima_atualizacao,
    // @ts-ignore Supabase pode retornar ticket_mensagens aqui, vamos mapear para mensagens
    mensagens: ticket.ticket_mensagens ? ticket.ticket_mensagens.map((msg: any) => ({
      id: msg.id,
      ticketId: msg.ticket_id,
      remetenteId: msg.remetente_id,
      tipoRemetente: msg.tipo_remetente as MensagemChat['tipoRemetente'],
      conteudo: msg.conteudo,
      timestamp: msg.timestamp,
      lida: msg.lida,
    })).sort((a: MensagemChat, b: MensagemChat) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()) : [], // Ordena mensagens e garante que seja um array
  }));
};

/**
 * Adiciona uma nova mensagem a um ticket existente.
 * @param ticketId ID do ticket.
 * @param mensagemData Dados da nova mensagem.
 */
export const adicionarMensagemAoTicket = async (ticketId: string, mensagemData: NovaMensagemData): Promise<MensagemChat> => {
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  if (sessionError || !session?.user) {
    console.error('Erro ao buscar sessão ou usuário não logado:', sessionError);
    throw new Error(sessionError?.message || 'Usuário não autenticado para enviar mensagem.');
  }
  const userId = session.user.id;

  const mensagemParaInserir = {
    ticket_id: ticketId,
    remetente_id: userId, // Assumindo que quem chama esta função é o usuário logado
    tipo_remetente: mensagemData.tipoRemetente || 'cliente' as const, // Default para cliente se não especificado
    conteudo: mensagemData.conteudo,
    timestamp: new Date().toISOString(),
    lida: false, // Mensagem nova ainda não foi lida (pelo suporte, neste caso)
  };

  const { data: novaMensagem, error } = await supabase
    .from('ticket_mensagens')
    .insert(mensagemParaInserir)
    .select()
    .single();

  if (error) {
    console.error('Erro ao adicionar mensagem ao ticket:', error);
    throw error;
  }

  // Atualizar ultima_atualizacao do ticket
  await supabase
    .from('tickets')
    .update({ ultima_atualizacao: new Date().toISOString() })
    .eq('id', ticketId);

  return {
    id: novaMensagem.id,
    ticketId: novaMensagem.ticket_id,
    remetenteId: novaMensagem.remetente_id,
    tipoRemetente: novaMensagem.tipo_remetente as MensagemChat['tipoRemetente'],
    conteudo: novaMensagem.conteudo,
    timestamp: novaMensagem.timestamp,
    lida: novaMensagem.lida,
  };
};
 