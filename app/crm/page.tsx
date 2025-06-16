'use client';

import React, { useState } from 'react';
import { Lead } from './types'; // Importando o tipo Lead
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Activity, BarChart3, Users2, DollarSignIcon, Target } from 'lucide-react';

// Exemplo de dados para o dashboard do CRM
const crmOverviewData = {
  novosLeads: 25,
  taxaConversao: 15.5,
  negociosEmAndamento: 7,
  valorTotalEmNegociacao: 45800.00,
  atividadesRecentes: [
    { id: 1, descricao: 'Lead "Empresa X" contatado.', data: 'Há 2 horas' },
    { id: 2, descricao: 'Proposta enviada para "Soluções Y".', data: 'Ontem' },
    { id: 3, descricao: 'Reunião agendada com "Consultoria Z".', data: 'Amanhã' },
  ]
};

// Componente da Página CRM
const CRMPage = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [novoLead, setNovoLead] = useState<Partial<Lead>>({
    nome: '',
    email: '',
    telefone: '',
    status: 'Novo',
    fonte: ''
  });
  const [isFormVisible, setIsFormVisible] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNovoLead(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitLead = (e: React.FormEvent) => {
    e.preventDefault();
    const leadParaAdicionar: Lead = {
      id: String(Date.now()), // ID simples baseado no timestamp
      nome: novoLead.nome || 'Lead Anônimo',
      email: novoLead.email,
      telefone: novoLead.telefone,
      status: novoLead.status || 'Novo',
      fonte: novoLead.fonte,
      dataCriacao: new Date().toISOString(),
    };
    setLeads(prevLeads => [leadParaAdicionar, ...prevLeads]);
    setNovoLead({ nome: '', email: '', telefone: '', status: 'Novo', fonte: '' });
    setIsFormVisible(false); // Esconde o formulário após submeter
    // Aqui, futuramente, você chamaria uma API para salvar o lead no backend
    console.log('Novo Lead Adicionado:', leadParaAdicionar);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <header>
          <h1 className="text-3xl font-bold text-arca-dark">Visão Geral do CRM</h1>
          <p className="text-gray-600">Seu painel central de atividades e métricas de relacionamento com o cliente.</p>
        </header>

        {/* Seção de Métricas Principais */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Novos Leads (Últ. 30d)</CardTitle>
              <Users2 className="h-5 w-5 text-arca-blue" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-arca-dark">+{crmOverviewData.novosLeads}</div>
              <p className="text-xs text-gray-500">+5.2% em relação ao mês anterior</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
              <Target className="h-5 w-5 text-arca-blue" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-arca-dark">{crmOverviewData.taxaConversao.toFixed(1)}%</div>
              <p className="text-xs text-gray-500">Meta: 20%</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Negócios em Andamento</CardTitle>
              <Activity className="h-5 w-5 text-arca-blue" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-arca-dark">{crmOverviewData.negociosEmAndamento}</div>
              <p className="text-xs text-gray-500">Totalizando R$ {crmOverviewData.valorTotalEmNegociacao.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receita Prevista (Mês)</CardTitle>
              <DollarSignIcon className="h-5 w-5 text-arca-blue" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-arca-dark">R$ 12.350,00</div> 
              <p className="text-xs text-gray-500">Baseado em negócios com alta probabilidade</p>
            </CardContent>
          </Card>
        </div>

        {/* Seção de Atividades Recentes e Gráfico (placeholder) */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle>Atividades Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {crmOverviewData.atividadesRecentes.map(activity => (
                  <li key={activity.id} className="flex items-start space-x-3">
                    <Activity className="h-5 w-5 text-arca-main flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-sm text-gray-700">{activity.descricao}</p>
                      <p className="text-xs text-gray-500">{activity.data}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Funil de Vendas (Simplificado)</CardTitle>
              <CardDescription>Distribuição de leads por etapa.</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              {/* Placeholder para gráfico - pode usar Recharts aqui */}
              <div className="h-[300px] flex items-center justify-center bg-gray-100 rounded-md">
                <BarChart3 className="h-16 w-16 text-gray-400" />
                <p className="ml-2 text-gray-500">Gráfico do Funil de Vendas (Em breve)</p>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default CRMPage; 