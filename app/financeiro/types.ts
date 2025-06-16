export interface Comissao {
  id: string;
  data: string; // Data da transação ou registro
  descricao: string; // Descrição da venda/locação, ex: "Venda Apto. Ed. Sol Nascente, Unid 101"
  clienteNome?: string;
  imovelEndereco?: string;
  valor: number;
  status: 'Pendente' | 'Recebida' | 'Parcialmente Recebida' | 'Cancelada';
  dataPagamento?: string; // Data em que a comissão foi efetivamente paga
  observacoes?: string;
} 