'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Comissao } from './types';
import { getComissoes, addComissao } from '@/services/comissaoService';
import { toast } from 'sonner';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DollarSign, TrendingUp, ListChecks, PieChart, AlertTriangle } from 'lucide-react';

const FinanceiroPage = () => {
  const [comissoes, setComissoes] = useState<Comissao[]>([]);
  const [isFormularioComissaoVisivel, setIsFormularioComissaoVisivel] = useState(false);
  const [novaComissao, setNovaComissao] = useState<Partial<Omit<Comissao, 'id' | 'user_id'>>>({
    descricao: '',
    valor: 0,
    status: 'Pendente',
    data: new Date().toISOString().split('T')[0],
    clienteNome: '',
    imovelEndereco: '',
    observacoes: '',
    dataPagamento: undefined,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const carregarComissoes = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getComissoes();
      setComissoes(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Falha ao carregar comissões.');
      toast.error('Erro ao carregar comissões', { description: err.message });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarComissoes();
  }, [carregarComissoes]);

  const handleInputChangeComissao = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNovaComissao(prev => ({
      ...prev,
      [name]: name === 'valor' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmitComissao = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    const comissaoParaEnviar: Partial<Omit<Comissao, 'id'>> = {
        ...novaComissao,
        data: novaComissao.data ? new Date(novaComissao.data).toISOString() : new Date().toISOString(),
        dataPagamento: novaComissao.dataPagamento ? new Date(novaComissao.dataPagamento).toISOString() : undefined,
    };

    if (!comissaoParaEnviar.descricao || comissaoParaEnviar.valor === undefined || comissaoParaEnviar.valor <= 0) {
        toast.error('Erro de Validação', { description: 'Descrição e Valor são obrigatórios e o valor deve ser positivo.'});
        return;
    }

    try {
      setIsLoading(true);
      const comissaoAdicionada = await addComissao(comissaoParaEnviar);
      await carregarComissoes();
      toast.success('Comissão adicionada com sucesso!');
      setNovaComissao({ descricao: '', valor: 0, status: 'Pendente', data: new Date().toISOString().split('T')[0], clienteNome: '', imovelEndereco: '', observacoes: '', dataPagamento: undefined });
      setIsFormularioComissaoVisivel(false);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Falha ao adicionar comissão.');
      toast.error('Erro ao adicionar comissão', { description: err.message });
    } finally {
        setIsLoading(false);
    }
  };

  const totalRecebido = comissoes
    .filter(c => c.status === 'Recebida')
    .reduce((acc, c) => acc + c.valor, 0);
  const totalPendente = comissoes
    .filter(c => c.status === 'Pendente' || c.status === 'Parcialmente Recebida')
    .reduce((acc, c) => acc + c.valor, 0);
  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };
  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  if (isLoading && comissoes.length === 0) {
    return (
        <div className="container mx-auto p-4 md:p-8 bg-arca-base min-h-screen flex justify-center items-center">
            <p className="text-xl text-gray-500">Carregando comissões...</p>
        </div>
    );
  }

  if (error && comissoes.length === 0) {
     return (
        <div className="container mx-auto p-4 md:p-8 bg-arca-base min-h-screen flex flex-col justify-center items-center">
            <p className="text-xl text-red-500 mb-4">Erro ao carregar dados: {error}</p>
            <button 
                onClick={carregarComissoes} 
                className="bg-arca-main hover:bg-arca-dark text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-150"
            >
                Tentar Novamente
            </button>
        </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <header className='mb-8'>
          <h1 className="text-3xl font-bold text-arca-dark">ARCA Financeiro</h1>
          <p className="text-gray-600">Sua central de controle financeiro inteligente.</p>
        </header>

        {/* Seção de Métricas Rápidas */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Saldo Atual</CardTitle>
              <DollarSign className="h-5 w-5 text-arca-blue" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ 12.345,67</div>
              <p className="text-xs text-muted-foreground">
                +2.5% desde o último mês
              </p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Receitas do Mês</CardTitle>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ 5.876,00</div>
              <p className="text-xs text-muted-foreground">
                +15% comparado ao mês anterior
              </p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Despesas do Mês</CardTitle>
              <TrendingUp className="h-5 w-5 text-red-500 rotate-180" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ 2.123,40</div>
              <p className="text-xs text-muted-foreground">
                -5% comparado ao mês anterior
              </p>
            </CardContent>
          </Card>
           <Card className="hover:shadow-lg transition-shadow bg-arca-dark text-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Lucro Previsto</CardTitle>
              <PieChart className="h-5 w-5 text-arca-light-blue" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ 3.752,60</div>
              <p className="text-xs text-gray-300">
                Meta: R$ 4.000,00
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Seções de Conteúdo Principal */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className='flex items-center'><ListChecks className='mr-2 h-5 w-5 text-arca-blue' /> Contas a Pagar/Receber</CardTitle>
              <CardDescription>Gerencie seus lançamentos futuros e pendentes.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-6 text-center text-gray-500">
                <ListChecks className='mx-auto h-12 w-12 text-gray-300 mb-2' />
                <p className="text-sm">Funcionalidade de contas a pagar e receber em desenvolvimento.</p>
                 <p className="text-xs mt-1">Em breve você poderá adicionar, editar e acompanhar todos os seus compromissos financeiros.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className='flex items-center'><PieChart className='mr-2 h-5 w-5 text-arca-blue' /> Fluxo de Caixa</CardTitle>
              <CardDescription>Visualize suas entradas e saídas ao longo do tempo.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-6 text-center text-gray-500">
                <PieChart className='mx-auto h-12 w-12 text-gray-300 mb-2' />
                <p className="text-sm">Gráficos e relatórios de fluxo de caixa em desenvolvimento.</p>
                 <p className="text-xs mt-1">Acompanhe a saúde financeira do seu negócio de forma visual.</p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center'><TrendingUp className='mr-2 h-5 w-5 text-arca-blue' /> Relatórios Financeiros</CardTitle>
            <CardDescription>Acesse relatórios detalhados sobre suas finanças.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-6 text-center text-gray-500">
                <TrendingUp className='mx-auto h-12 w-12 text-gray-300 mb-2' />
                <p className="text-sm">Geração de relatórios financeiros detalhados em desenvolvimento.</p>
                <p className="text-xs mt-1">Obtenha insights poderosos com DRE, balancetes e mais.</p>
            </div>
          </CardContent>
        </Card>

      </div>
    </DashboardLayout>
  );
};

export default FinanceiroPage; 