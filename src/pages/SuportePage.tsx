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

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  HelpCircle, 
  MessageSquare, 
  Mail, 
  Phone, 
  Clock,
  CheckCircle,
  AlertCircle,
  Search,
  BookOpen,
  Video,
  FileText,
  ExternalLink,
  Users,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';
import { toast } from 'sonner';
import { useRealSupportData } from '@/hooks/useRealSupportData';
import { TestTicketCreator } from '@/components/TestTicketCreator';

const SuportePage = () => {
  const { tickets, stats, faqs, loading, error, createTicket } = useRealSupportData();
  const [selectedCategory, setSelectedCategory] = useState('Geral');
  const [searchTerm, setSearchTerm] = useState('');
  const [ticketForm, setTicketForm] = useState({
    subject: '',
    category: 'Geral',
    priority: 'Media',
    description: ''
  });

  const categories = [
    'Geral',
    'Análise ROI',
    'Academy',
    'CRM',
    'Pagamentos',
    'Técnico'
  ];

  const priorities = [
    { value: 'Baixa', color: 'bg-green-500' },
    { value: 'Media', color: 'bg-yellow-500' },
    { value: 'Alta', color: 'bg-red-500' }
  ];

  const quickLinks = [
    {
      title: 'Guia de Primeiros Passos',
      description: 'Aprenda a usar a plataforma em 5 minutos',
      icon: BookOpen,
      link: '/academy/getting-started'
    },
    {
      title: 'Vídeos Tutoriais',
      description: 'Assista nossos tutoriais em vídeo',
      icon: Video,
      link: '/academy/videos'
    },
    {
      title: 'Documentação',
      description: 'Documentação completa da API',
      icon: FileText,
      link: '/docs'
    }
  ];

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'Geral' || faq.category === selectedCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleTicketSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = await createTicket(ticketForm);
    
    if (result.success) {
      toast.success('Ticket criado com sucesso!', {
        description: 'Nossa equipe entrará em contato em até 24 horas.'
      });
      setTicketForm({
        subject: '',
        category: 'Geral',
        priority: 'Media',
        description: '' 
      });
    } else {
      toast.error('Erro ao criar ticket', {
        description: result.error || 'Tente novamente em alguns minutos.'
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critica': return 'bg-red-100 text-red-800';
      case 'Alta': return 'bg-red-100 text-red-800';
      case 'Media': return 'bg-yellow-100 text-yellow-800';
      case 'Baixa': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Fechado': return 'bg-green-100 text-green-800';
      case 'Resolvido': return 'bg-green-100 text-green-800';
      case 'Em Andamento': return 'bg-yellow-100 text-yellow-800';
      case 'Aberto': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="p-6 max-w-[1200px] mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando dados de suporte...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-[1200px] mx-auto">
      {/* Test Tools - Only show in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mb-6">
          <TestTicketCreator />
        </div>
      )}
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <HelpCircle className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">
              Central de Suporte
            </h1>
          </div>
          <p className="text-gray-600">
            Gerencie tickets de suporte e atendimento aos usuários
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline">
            <Mail className="w-4 h-4 mr-2" />
            Enviar Email
          </Button>
          <Button>
            <MessageSquare className="w-4 h-4 mr-2" />
            Novo Ticket
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Tickets Abertos</p>
                  <p className="text-2xl font-bold text-red-600">{stats.openTickets}</p>
                  <p className="text-sm text-gray-500">+{stats.todayTickets} hoje</p>
                </div>
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Em Andamento</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.inProgressTickets}</p>
                  <p className="text-sm text-gray-500">+{Math.floor(stats.todayTickets * 0.5)} hoje</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Resolvidos</p>
                  <p className="text-2xl font-bold text-green-600">{stats.resolvedTickets}</p>
                  <p className="text-sm text-gray-500">+{Math.floor(stats.todayTickets * 0.8)} hoje</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Tempo Médio</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.averageResponseTime}h</p>
                  <p className="text-sm text-gray-500">-0.3h hoje</p>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Contact Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6 text-center">
            <MessageSquare className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Chat ao Vivo</h3>
            <p className="text-gray-600 text-sm mb-4">
              Suporte instantâneo com nossa equipe
            </p>
            <Button className="w-full">Iniciar Chat</Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Mail className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Email</h3>
            <p className="text-gray-600 text-sm mb-4">
              support@arca-ai.com
            </p>
            <Button variant="outline" className="w-full">Enviar Email</Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Clock className="w-12 h-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Horário de Atendimento</h3>
            <p className="text-gray-600 text-sm mb-4">
              Seg-Sex: 9h às 18h
            </p>
            <Badge variant="outline">Horário de Brasília</Badge>
          </CardContent>
        </Card>
      </div>

      {/* Recent Tickets */}
      {tickets && tickets.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Tickets Recentes ({tickets.length} total)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tickets.slice(0, 5).map((ticket) => (
                <div key={ticket.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{ticket.subject}</h4>
                      <Badge variant="outline" className={getPriorityColor(ticket.priority)}>
                        {ticket.priority}
                      </Badge>
                      <Badge className={getStatusColor(ticket.status)}>
                        {ticket.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{ticket.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>ID: {ticket.id.slice(0, 8)}</span>
                      <span>Usuário: {ticket.user_name}</span>
                      <span>Criado: {formatDate(ticket.created_at)}</span>
                      {ticket.assigned_to && <span>Atribuído: {ticket.assigned_to}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {ticket.category && (
                      <Badge variant="outline" className="text-xs">
                        {ticket.category}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Links */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Links Úteis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickLinks.map((link, index) => (
              <div key={index} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <link.icon className="w-8 h-8 text-blue-600" />
                <div className="flex-1">
                  <h4 className="font-medium">{link.title}</h4>
                  <p className="text-sm text-gray-600">{link.description}</p>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* FAQ Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Perguntas Frequentes</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Search */}
              <div className="relative mb-4">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Buscar nas perguntas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              {/* Categories */}
              <div className="flex flex-wrap gap-2 mb-6">
                {categories.map(category => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>

              {/* FAQ List */}
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {filteredFaqs.map(faq => (
                  <div key={faq.id} className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">{faq.question}</h4>
                    <p className="text-sm text-gray-600 mb-2">{faq.answer}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {faq.category}
                      </Badge>
                      {faq.views && (
                        <span className="text-xs text-gray-500">{faq.views} visualizações</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {filteredFaqs.length === 0 && (
                <div className="text-center py-8">
                  <HelpCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Nenhuma pergunta encontrada</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Create Ticket */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Criar Ticket de Suporte</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleTicketSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Assunto</label>
                  <Input
                    value={ticketForm.subject}
                    onChange={(e) => setTicketForm({...ticketForm, subject: e.target.value})}
                    placeholder="Descreva brevemente o problema"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Categoria</label>
                    <select
                      value={ticketForm.category}
                      onChange={(e) => setTicketForm({...ticketForm, category: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Prioridade</label>
                    <select
                      value={ticketForm.priority}
                      onChange={(e) => setTicketForm({...ticketForm, priority: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      {priorities.map(priority => (
                        <option key={priority.value} value={priority.value}>
                          {priority.value}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Descrição</label>
                  <Textarea
                    value={ticketForm.description}
                    onChange={(e) => setTicketForm({...ticketForm, description: e.target.value})}
                    placeholder="Descreva detalhadamente o problema ou dúvida"
                    rows={4}
                    required
                  />
                </div>
                
                <Button type="submit" className="w-full">
                  Criar Ticket
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Status */}
      <Card>
        <CardHeader>
          <CardTitle>Status do Sistema</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-4 border rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-500" />
              <div>
                <h4 className="font-medium">Plataforma</h4>
                <p className="text-sm text-gray-600">Operacional</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 border rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-500" />
              <div>
                <h4 className="font-medium">API</h4>
                <p className="text-sm text-gray-600">Operacional</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 border rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-500" />
              <div>
                <h4 className="font-medium">Análise IA</h4>
                <p className="text-sm text-gray-600">Operacional</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SuportePage; 