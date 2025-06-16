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
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Search, 
  MoreHorizontal, 
  Eye, 
  MessageSquare,
  Clock,
  CheckCircle,
  AlertTriangle,
  Mail,
  User,
  TrendingUp,
  Send,
  Loader2
} from 'lucide-react';
import { useSupportTickets } from '@/hooks/useRealData';

const AdminSupport = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [response, setResponse] = useState('');

  // Usar dados reais do Supabase
  const { tickets, stats, loading, error } = useSupportTickets();

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.user_profiles.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.user_profiles.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
    const matchesCategory = categoryFilter === 'all' || ticket.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  const statsData = [
    {
      title: 'Tickets Abertos',
      value: stats.open.toString(),
      change: '+3 hoje',
      icon: AlertTriangle,
      color: 'red'
    },
    {
      title: 'Em Andamento',
      value: stats.inProgress.toString(),
      change: '+2 hoje',
      icon: Clock,
      color: 'yellow'
    },
    {
      title: 'Resolvidos',
      value: stats.resolved.toString(),
      change: '+8 hoje',
      icon: CheckCircle,
      color: 'green'
    },
    {
      title: 'Tempo Médio',
      value: stats.avgTime,
      change: '-0.3h',
      icon: TrendingUp,
      color: 'blue'
    }
  ];

  const getCategoryBadge = (category: string) => {
    const variants = {
      tecnico: 'bg-blue-100 text-blue-800',
      comercial: 'bg-green-100 text-green-800',
      sugestao: 'bg-purple-100 text-purple-800',
      bug: 'bg-red-100 text-red-800'
    };
    return variants[category as keyof typeof variants] || variants.tecnico;
  };

  const getPriorityBadge = (priority: string) => {
    const variants = {
      baixa: 'bg-gray-100 text-gray-800',
      media: 'bg-yellow-100 text-yellow-800',
      alta: 'bg-orange-100 text-orange-800',
      critica: 'bg-red-100 text-red-800'
    };
    return variants[priority as keyof typeof variants] || variants.media;
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      aberto: 'bg-red-100 text-red-800',
      em_andamento: 'bg-yellow-100 text-yellow-800',
      resolvido: 'bg-green-100 text-green-800',
      fechado: 'bg-gray-100 text-gray-800'
    };
    return variants[status as keyof typeof variants] || variants.aberto;
  };

  const getCategoryText = (category: string) => {
    const texts = {
      tecnico: 'Técnico',
      comercial: 'Comercial',
      sugestao: 'Sugestão',
      bug: 'Bug'
    };
    return texts[category as keyof typeof texts] || category;
  };

  const getPriorityText = (priority: string) => {
    const texts = {
      baixa: 'Baixa',
      media: 'Média',
      alta: 'Alta',
      critica: 'Crítica'
    };
    return texts[priority as keyof typeof texts] || priority;
  };

  const getStatusText = (status: string) => {
    const texts = {
      aberto: 'Aberto',
      em_andamento: 'Em Andamento',
      resolvido: 'Resolvido',
      fechado: 'Fechado'
    };
    return texts[status as keyof typeof texts] || status;
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

  const handleSendResponse = () => {
    console.log('Enviando resposta:', response);
    setResponse('');
    setSelectedTicket(null);
  };

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className="ml-2">Carregando tickets...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="text-center text-red-600">
          <p>{error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Tentar Novamente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Suporte</h1>
          <p className="text-gray-600 mt-1">
            Gerencie tickets de suporte e atendimento aos usuários
          </p>
        </div>
        <div className="mt-4 lg:mt-0 flex items-center gap-3">
          <Button variant="outline">
            <Mail className="w-4 h-4 mr-2" />
            Enviar Email
          </Button>
          <Button variant="arca">
            <MessageSquare className="w-4 h-4 mr-2" />
            Novo Ticket
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {stat.change}
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                    <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Filters and Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle>Tickets de Suporte ({filteredTickets.length} total)</CardTitle>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar tickets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="aberto">Aberto</SelectItem>
                  <SelectItem value="em_andamento">Em Andamento</SelectItem>
                  <SelectItem value="resolvido">Resolvido</SelectItem>
                  <SelectItem value="fechado">Fechado</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Prioridade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="baixa">Baixa</SelectItem>
                  <SelectItem value="media">Média</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
                  <SelectItem value="critica">Crítica</SelectItem>
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="tecnico">Técnico</SelectItem>
                  <SelectItem value="comercial">Comercial</SelectItem>
                  <SelectItem value="sugestao">Sugestão</SelectItem>
                  <SelectItem value="bug">Bug</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ticket</TableHead>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Prioridade</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Responsável</TableHead>
                  <TableHead>Atualizado</TableHead>
                  <TableHead className="w-[70px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTickets.map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{ticket.title}</p>
                        <p className="text-sm text-gray-500">
                          ID: {ticket.id} • {ticket.message_count} mensagens
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={ticket.user_profiles.avatar_url} />
                          <AvatarFallback>
                            {ticket.user_profiles.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{ticket.user_profiles.name}</p>
                          <p className="text-sm text-gray-500">{ticket.user_profiles.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getCategoryBadge(ticket.category)} border-0`}>
                        {getCategoryText(ticket.category)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getPriorityBadge(ticket.priority)} border-0`}>
                        {getPriorityText(ticket.priority)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getStatusBadge(ticket.status)} border-0`}>
                        {getStatusText(ticket.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">
                        {ticket.assigned_to || 'Não atribuído'}
                      </span>
                    </TableCell>
                    <TableCell>{formatDate(ticket.updated_at)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <Dialog>
                            <DialogTrigger asChild>
                              <DropdownMenuItem onSelect={(e) => {
                                e.preventDefault();
                                setSelectedTicket(ticket);
                              }}>
                                <Eye className="mr-2 h-4 w-4" />
                                Ver Detalhes
                              </DropdownMenuItem>
                            </DialogTrigger>
                          </Dialog>
                          <DropdownMenuItem>
                            <User className="mr-2 h-4 w-4" />
                            Atribuir
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Mail className="mr-2 h-4 w-4" />
                            Enviar Email
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {filteredTickets.length === 0 && !loading && (
            <div className="text-center py-12">
              <p className="text-gray-500">
                {tickets.length === 0 ? 'Nenhum ticket de suporte' : 'Nenhum ticket encontrado com os filtros aplicados'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog para detalhes do ticket */}
      {selectedTicket && (
        <Dialog open={!!selectedTicket} onOpenChange={() => setSelectedTicket(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedTicket.title}</DialogTitle>
              <DialogDescription>
                Ticket #{selectedTicket.id} • {formatDate(selectedTicket.created_at)}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge className={`${getCategoryBadge(selectedTicket.category)} border-0`}>
                  {getCategoryText(selectedTicket.category)}
                </Badge>
                <Badge className={`${getPriorityBadge(selectedTicket.priority)} border-0`}>
                  {getPriorityText(selectedTicket.priority)}
                </Badge>
                <Badge className={`${getStatusBadge(selectedTicket.status)} border-0`}>
                  {getStatusText(selectedTicket.status)}
                </Badge>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Descrição:</h4>
                <p className="text-gray-600">{selectedTicket.description}</p>
              </div>

              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={selectedTicket.user_profiles.avatar_url} />
                  <AvatarFallback>
                    {selectedTicket.user_profiles.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{selectedTicket.user_profiles.name}</p>
                  <p className="text-sm text-gray-500">{selectedTicket.user_profiles.email}</p>
                </div>
              </div>

              {selectedTicket.last_message && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Última mensagem:</h4>
                  <p className="text-gray-600">{selectedTicket.last_message}</p>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium">Responder:</label>
                <Textarea
                  placeholder="Digite sua resposta..."
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  rows={4}
                />
                <div className="flex gap-2">
                  <Button variant="arca" onClick={handleSendResponse} disabled={!response.trim()}>
                    <Send className="w-4 h-4 mr-2" />
                    Enviar Resposta
                  </Button>
                  <Button variant="outline">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Resolver Ticket
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default AdminSupport; 