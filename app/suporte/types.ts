// Tipos para a funcionalidade de Suporte e Tickets

export interface Ticket {
  id: string;                 // ID único do ticket (gerado pelo Supabase)
  userId: string;             // ID do usuário que criou o ticket
  assunto: string;            // Assunto breve do ticket
  status: 'Aberto' | 'Em Andamento' | 'Resolvido' | 'Fechado'; // Status do ticket
  prioridade: 'Baixa' | 'Média' | 'Alta' | 'Urgente';   // Prioridade do ticket
  dataAbertura: string;       // Data e hora da criação (ISO string)
  ultimaAtualizacao?: string; // Data da última interação (ISO string)
  mensagens: MensagemChat[];  // Histórico de mensagens do chat
}

export interface MensagemChat {
  id: string;                 // ID único da mensagem
  ticketId: string;           // ID do ticket ao qual a mensagem pertence
  remetenteId: string;        // ID do usuário que enviou (pode ser o cliente ou suporte)
  tipoRemetente: 'cliente' | 'suporte'; // Para diferenciar quem enviou
  conteudo: string;           // Conteúdo da mensagem (texto)
  timestamp: string;          // Data e hora do envio (ISO string)
  lida: boolean;              // Se a mensagem foi lida pelo destinatário
}

// Para criar um novo ticket (sem ID, dataAbertura ou mensagens inicialmente)
export interface NovoTicketData extends Omit<Ticket, 'id' | 'userId' | 'dataAbertura' | 'ultimaAtualizacao' | 'mensagens'> {
  primeiraMensagem: string; // Conteúdo da primeira mensagem do usuário ao abrir o ticket
}

// Para adicionar uma nova mensagem a um ticket existente
export interface NovaMensagemData extends Omit<MensagemChat, 'id' | 'ticketId' | 'timestamp' | 'lida'> {
  // ticketId será adicionado no service, baseado no contexto da conversa
} 