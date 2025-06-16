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

import React from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Settings } from 'lucide-react';

export const TestTicketCreator = () => {
  const createTestTickets = async () => {
    try {
      console.log('Criando tickets de teste...');
      
      // Verificar se usuário está autenticado
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Usuário não autenticado');
        return;
      }

      // Tentar diferentes estruturas de dados para ver qual funciona
      const testTickets = [
        {
          assunto: 'Ticket de Teste 1',
          prioridade: 'Alta',
          status: 'Aberto',
          user_id: user.id
        },
        {
          assunto: 'Ticket de Teste 2',
          prioridade: 'Media',
          status: 'Em Andamento',
          user_id: user.id
        }
      ];

      console.log('Inserindo tickets:', testTickets);

      const { data, error } = await supabase
        .from('tickets')
        .insert(testTickets)
        .select();

      if (error) {
        console.error('Erro ao inserir tickets de teste:', error);
        toast.error('Erro ao criar tickets de teste: ' + error.message);
      } else {
        console.log('Tickets de teste criados:', data);
        toast.success(`${data.length} tickets de teste criados com sucesso!`);
      }
    } catch (err) {
      console.error('Erro crítico:', err);
      toast.error('Erro crítico: ' + (err as Error).message);
    }
  };

  const clearAllTickets = async () => {
    try {
      console.log('Removendo todos os tickets...');
      
      const { error } = await supabase
        .from('tickets')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all except impossible ID

      if (error) {
        console.error('Erro ao limpar tickets:', error);
        toast.error('Erro ao limpar tickets: ' + error.message);
      } else {
        console.log('Todos os tickets removidos');
        toast.success('Todos os tickets foram removidos!');
      }
    } catch (err) {
      console.error('Erro crítico:', err);
      toast.error('Erro crítico: ' + (err as Error).message);
    }
  };

  const checkTableStructure = async () => {
    try {
      console.log('Verificando estrutura da tabela...');
      
      // Tentar buscar com diferentes combinações de campos
      const queries = [
        { name: 'Estrutura 1', fields: 'id, assunto, prioridade, status, user_id, created_at' },
        { name: 'Estrutura 2', fields: 'id, subject, priority, status, user_id, created_at' },
        { name: 'Estrutura 3', fields: 'id, title, priority, status, user_id, created_at' },
        { name: 'Todos os campos', fields: '*' }
      ];

      for (const query of queries) {
        try {
          console.log(`Testando ${query.name}...`);
          
          const { data, error } = await supabase
            .from('tickets')
            .select(query.fields)
            .limit(1);

          if (!error) {
            console.log(`${query.name} funcionou:`, data);
            toast.success(`${query.name} funcionou! Check console.`);
          } else {
            console.log(`${query.name} falhou:`, error);
          }
        } catch (e) {
          console.log(`${query.name} erro crítico:`, e);
        }
      }
    } catch (err) {
      console.error('Erro ao verificar estrutura:', err);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-yellow-50 border-yellow-200">
      <h3 className="font-semibold text-yellow-800 mb-3"><Settings className="inline w-4 h-4 mr-1" /> Ferramentas de Teste - Tickets</h3>
      <div className="flex gap-2 flex-wrap">
        <Button onClick={createTestTickets} variant="outline" size="sm">
          Criar Tickets de Teste
        </Button>
        <Button onClick={clearAllTickets} variant="outline" size="sm" className="text-red-600">
          Limpar Todos
        </Button>
        <Button onClick={checkTableStructure} variant="outline" size="sm">
          Verificar Estrutura
        </Button>
      </div>
      <p className="text-xs text-yellow-700 mt-2">
        Use essas ferramentas para testar a tabela de tickets. Verifique o console do navegador para logs detalhados.
      </p>
    </div>
  );
}; 