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
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCRM } from '@/hooks/useCRM';
import { useFinanceiro } from '@/hooks/useFinanceiro';
import { useSuporte } from '@/hooks/useSuporte';
import { Activity, BarChart3, Users2, DollarSign, Target, Calendar, UserCheck, BarChart, Plus, Loader2, AlertCircle, TrendingUp, Mail, Phone, Building } from 'lucide-react';
import { toast } from 'sonner';

// Interface para atividades recentes
interface RecentActivity {
  id: string;
  description: string;
  date: string;
  type: 'lead' | 'ticket' | 'transaction';
}

// Componente da Página CRM com dados reais
const CrmPage: React.FC = () => {
  const { leads, stats: crmStats, loading: crmLoading, createLead, isUsingMockData } = useCRM();
  const { stats: financeStats, transactions } = useFinanceiro();
  const { stats: supportStats, tickets } = useSuporte();
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [newLead, setNewLead] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    source: 'website',
    status: 'new' as const,
    value: 0,
    notes: ''
  });

  // Combinar dados de diferentes fontes para criar atividades recentes
  const recentActivities: RecentActivity[] = [
    ...transactions.slice(0, 2).map(transaction => ({
      id: transaction.id,
      description: `Transação: ${transaction.description}`,
      date: new Date(transaction.created_at).toLocaleDateString('pt-BR'),
      type: 'transaction' as const
    })),
    ...tickets.slice(0, 2).map(ticket => ({
      id: ticket.id,
      description: `Ticket: ${ticket.title}`,
      date: new Date(ticket.created_at).toLocaleDateString('pt-BR'),
      type: 'ticket' as const
    })),
    ...leads.slice(0, 2).map(lead => ({
      id: lead.id,
      description: `Lead: ${lead.name} (${lead.status})`,
      date: new Date(lead.created_at).toLocaleDateString('pt-BR'),
      type: 'lead' as const
    }))
  ];

  const handleInputChange = (field: string, value: string | number) => {
    setNewLead(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newLead.name.trim()) {
      toast.error('Nome é obrigatório');
      return;
    }

    try {
      await createLead(newLead);
      setNewLead({
        name: '',
        email: '',
        phone: '',
        company: '',
        source: 'website',
        status: 'new' as const,
        value: 0,
        notes: ''
      });
      setIsFormVisible(false);
    } catch (error) {
      console.error('Erro ao criar lead:', error);
    }
  };

  if (crmLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Carregando dados do CRM...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">CRM Dashboard</h1>
            <p className="text-gray-600">
              Gerencie leads, prospects e relacionamentos com clientes
              {isUsingMockData && (
                <Badge variant="outline" className="ml-2 text-orange-600 border-orange-600">
                  Dados Simulados
                </Badge>
              )}
            </p>
          </div>
          <Button 
            variant="default"
            onClick={() => setIsFormVisible(true)}
            className="bg-arca-main hover:bg-arca-dark"
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Lead
          </Button>
        </div>

        {/* Navegação para Sub-páginas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Link to="/crm/leads">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <UserCheck className="h-8 w-8 text-blue-600 mr-3" />
                  <div>
                    <h3 className="text-lg font-semibold text-blue-900">Gestão de Leads</h3>
                    <p className="text-sm text-blue-700">Gerencie e acompanhe seus leads</p>
                    <Badge className="mt-1 bg-blue-200 text-blue-800">{crmStats.totalLeads} leads</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/crm/funil">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <BarChart className="h-8 w-8 text-purple-600 mr-3" />
                  <div>
                    <h3 className="text-lg font-semibold text-purple-900">Funil de Vendas</h3>
                    <p className="text-sm text-purple-700">Visualize seu pipeline</p>
                    <Badge className="mt-1 bg-purple-200 text-purple-800">{crmStats.conversionRate}% conversão</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/crm/agenda">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Calendar className="h-8 w-8 text-green-600 mr-3" />
                  <div>
                    <h3 className="text-lg font-semibold text-green-900">Agenda e Tarefas</h3>
                    <p className="text-sm text-green-700">Organize seus compromissos</p>
                    <Badge className="mt-1 bg-green-200 text-green-800">3 hoje</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Métricas Principais com Dados Reais */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-900">Novos Leads (30d)</CardTitle>
              <Users2 className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">{crmStats.newLeads}</div>
              <div className="flex items-center text-xs text-blue-700">
                <TrendingUp className="h-3 w-3 mr-1" />
                +23% vs mês anterior
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-900">Taxa de Conversão</CardTitle>
              <Target className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">{crmStats.conversionRate}%</div>
              <div className="flex items-center text-xs text-green-700">
                <TrendingUp className="h-3 w-3 mr-1" />
                Meta: 20%
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-900">Leads Qualificados</CardTitle>
              <Activity className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900">{crmStats.qualifiedLeads}</div>
              <div className="text-xs text-purple-700">
                {crmStats.convertedLeads} convertidos
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-900">Valor Total</CardTitle>
              <DollarSign className="h-5 w-5 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-900">
                R$ {(financeStats?.totalIncome || 0).toLocaleString('pt-BR')}
              </div>
              <div className="text-xs text-orange-700">
                Pipeline total
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Atividades Recentes e Estatísticas */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="h-5 w-5 mr-2 text-blue-600" />
                Atividades Recentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map(activity => (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className={`p-2 rounded-full ${
                      activity.type === 'lead' ? 'bg-blue-100 text-blue-600' :
                      activity.type === 'ticket' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-green-100 text-green-600'
                    }`}>
                      {activity.type === 'lead' ? <Users2 className="h-4 w-4" /> :
                       activity.type === 'ticket' ? <AlertCircle className="h-4 w-4" /> :
                       <DollarSign className="h-4 w-4" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-700">{activity.description}</p>
                      <p className="text-xs text-gray-500">{activity.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-purple-600" />
                Distribuição de Leads
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Novos</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-arca-main h-2 rounded-full"
                        style={{ width: `${(crmStats.newLeads / Math.max(crmStats.totalLeads, 1)) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{crmStats.newLeads}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Qualificados</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-arca-main h-2 rounded-full"
                        style={{ width: `${(crmStats.qualifiedLeads / Math.max(crmStats.totalLeads, 1)) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{crmStats.qualifiedLeads}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Convertidos</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-arca-main h-2 rounded-full"
                        style={{ width: `${(crmStats.convertedLeads / Math.max(crmStats.totalLeads, 1)) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{crmStats.convertedLeads}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Modal para Novo Lead */}
        {isFormVisible && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md mx-4">
              <CardHeader>
                <CardTitle>Adicionar Novo Lead</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitLead} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nome *</Label>
                    <Input
                      id="name"
                      value={newLead.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newLead.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      value={newLead.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="company">Empresa</Label>
                    <Input
                      id="company"
                      value={newLead.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="source">Fonte</Label>
                    <Select value={newLead.source} onValueChange={(value) => handleInputChange('source', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="website">Website</SelectItem>
                        <SelectItem value="referral">Indicação</SelectItem>
                        <SelectItem value="social">Redes Sociais</SelectItem>
                        <SelectItem value="email">Email Marketing</SelectItem>
                        <SelectItem value="phone">Telefone</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="value">Valor Potencial (R$)</Label>
                    <Input
                      id="value"
                      type="number"
                      value={newLead.value}
                      onChange={(e) => handleInputChange('value', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="notes">Observações</Label>
                    <Input
                      id="notes"
                      value={newLead.notes}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                      placeholder="Adicione notas sobre este lead..."
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsFormVisible(false)}
                    >
                      Cancelar
                    </Button>
                    <Button type="submit">
                      Adicionar Lead
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default CrmPage; 