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
import type { Comissao } from '@/app/financeiro/types'; // Usando o tipo que definimos

// Interface para os dados que vêm do formulário, antes de adicionar user_id
export interface NovaComissaoData extends Omit<Comissao, 'id' | 'data' | 'user_id'> {
  data?: string; // Data é opcional aqui, pois pode ser preenchida no backend ou default
}

/**
 * Busca todas as comissões do usuário logado.
 */
export const getComissoes = async (): Promise<Comissao[]> => {
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  if (sessionError || !session?.user) {
    console.error('Erro ao buscar sessão ou usuário não logado:', sessionError);
    throw new Error(sessionError?.message || 'Usuário não autenticado.');
  }
  const userId = session.user.id;

  const { data, error } = await supabase
    .from('comissoes')
    .select('*')
    .eq('user_id', userId)
    .order('data', { ascending: false });

  if (error) {
    console.error('Erro ao buscar comissões:', error);
    throw error;
  }

  // Mapear de snake_case (DB) para camelCase (App)
  return data.map(item => ({
    id: item.id,
    data: item.data,
    descricao: item.descricao,
    clienteNome: item.cliente_nome,
    imovelEndereco: item.imovel_endereco,
    valor: item.valor,
    status: item.status as Comissao['status'], // Cast para o tipo de status
    dataPagamento: item.data_pagamento,
    observacoes: item.observacoes,
    // user_id não precisa ser exposto no frontend diretamente na lista de comissões
  }));
};

/**
 * Adiciona uma nova comissão para o usuário logado.
 * @param comissaoInput Dados da comissão a ser adicionada.
 */
export const addComissao = async (comissaoInput: Partial<Omit<Comissao, 'id'>>): Promise<Comissao> => {
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  if (sessionError || !session?.user) {
    console.error('Erro ao buscar sessão ou usuário não logado:', sessionError);
    throw new Error(sessionError?.message || 'Usuário não autenticado.');
  }
  const userId = session.user.id;

  // Mapear de camelCase (App) para snake_case (DB)
  const comissaoToInsert = {
    user_id: userId,
    data: comissaoInput.data ? new Date(comissaoInput.data).toISOString() : new Date().toISOString(),
    descricao: comissaoInput.descricao,
    cliente_nome: comissaoInput.clienteNome,
    imovel_endereco: comissaoInput.imovelEndereco,
    valor: comissaoInput.valor,
    status: comissaoInput.status,
    data_pagamento: comissaoInput.dataPagamento ? new Date(comissaoInput.dataPagamento).toISOString() : undefined,
    observacoes: comissaoInput.observacoes,
  };

  const { data, error } = await supabase
    .from('comissoes')
    .insert(comissaoToInsert)
    .select()
    .single(); // Retorna o objeto inserido

  if (error) {
    console.error('Erro ao adicionar comissão:', error);
    throw error;
  }
  
  // Mapear a resposta de volta para camelCase
  return {
    id: data.id,
    data: data.data,
    descricao: data.descricao,
    clienteNome: data.cliente_nome,
    imovelEndereco: data.imovel_endereco,
    valor: data.valor,
    status: data.status as Comissao['status'],
    dataPagamento: data.data_pagamento,
    observacoes: data.observacoes,
  };
}; 