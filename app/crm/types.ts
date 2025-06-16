export interface Lead {
  id: string;
  nome: string;
  email?: string;
  telefone?: string;
  status: 'Novo' | 'Contatado' | 'Qualificado' | 'Proposta Enviada' | 'Negociação' | 'Fechado' | 'Perdido';
  fonte?: string;
  dataCriacao: string;
} 