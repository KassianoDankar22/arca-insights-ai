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
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Search, 
  MoreHorizontal, 
  Plus, 
  Download,
  Edit,
  Ban,
  CheckCircle,
  Mail,
  TrendingUp,
  Loader2,
  Users,
  CreditCard,
  UserCheck,
  Crown,
  DollarSign,
  Shield,
  Save,
  UserPlus
} from 'lucide-react';
import { useUsers } from '@/hooks/useRealData';
import { toast } from 'sonner';

interface NewUser {
  name: string;
  email: string;
  password: string;
  plan: 'free' | 'pro' | 'enterprise';
  isAdmin: boolean;
  isSuperAdmin: boolean;
  status: 'active' | 'inactive';
}

const AdminUsers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [planFilter, setPlanFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('all');
  const [isCreatingUser, setIsCreatingUser] = useState(false);

  // Estado do formulário de novo usuário
  const [newUser, setNewUser] = useState<NewUser>({
    name: '',
    email: '',
    password: '',
    plan: 'free',
    isAdmin: false,
    isSuperAdmin: false,
    status: 'active'
  });

  // Usar dados reais do Supabase
  const { users, stats, loading, error, makeAdmin, promoteToPro, toggleUserStatus, exportUsers, sendEmail, resetUserPassword, createUser, refetch } = useUsers();

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newUser.name || !newUser.email || !newUser.password) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    if (newUser.password.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newUser.email)) {
      toast.error('Digite um email válido');
      return;
    }

    setIsCreatingUser(true);

    try {
      const role: 'user' | 'admin' | 'super_admin' = newUser.isSuperAdmin ? 'super_admin' : newUser.isAdmin ? 'admin' : 'user';
      
      const userData = {
        name: newUser.name,
        email: newUser.email,
        password: newUser.password,
        plan: newUser.plan,
        status: newUser.status,
        role: role
      };

      await createUser(userData);
      
      toast.success(`Usuário ${newUser.name} criado com sucesso!`);
      
      // Resetar formulário
      setNewUser({
        name: '',
        email: '',
        password: '',
        plan: 'free',
        isAdmin: false,
        isSuperAdmin: false,
        status: 'active'
      });
      
      refetch();
    } catch (err) {
      toast.error('Falha ao criar usuário', { 
        description: (err as Error).message 
      });
    } finally {
      setIsCreatingUser(false);
    }
  };

  const handleMakeAdminClick = async (userId: string, userName: string) => {
    const confirmation = confirm(`Você tem certeza que deseja tornar ${userName} um administrador? Essa ação não pode ser desfeita facilmente.`);
    if (confirmation) {
      try {
        await makeAdmin(userId);
        toast.success(`${userName} agora é um administrador!`);
        refetch();
      } catch (err) {
        toast.error(`Falha ao atualizar o usuário.`, { description: (err as Error).message });
      }
    }
  };

  const handlePromoteToProClick = async (userId: string, userName: string) => {
    const confirmation = confirm(`Você tem certeza que deseja promover ${userName} para o plano Pro?`);
    if (confirmation) {
      try {
        await promoteToPro(userId);
        toast.success(`${userName} foi promovido para o plano Pro!`);
        refetch();
      } catch (err) {
        toast.error(`Falha ao promover usuário.`, { description: (err as Error).message });
      }
    }
  };

  const handleToggleUserStatus = async (userId: string, userName: string, currentStatus: string) => {
    const action = currentStatus === 'active' ? 'bloquear' : 'ativar';
    const confirmation = confirm(`Você tem certeza que deseja ${action} ${userName}?`);
    if (confirmation) {
      try {
        await toggleUserStatus(userId);
        toast.success(`${userName} foi ${action === 'bloquear' ? 'bloqueado' : 'ativado'} com sucesso!`);
        refetch();
      } catch (err) {
        toast.error(`Falha ao ${action} usuário.`, { description: (err as Error).message });
      }
    }
  };

  const handleExportUsers = () => {
    try {
      exportUsers();
      toast.success('Dados dos usuários exportados com sucesso!');
    } catch (err) {
      toast.error('Falha ao exportar dados.', { description: (err as Error).message });
    }
  };

  const handleSendEmail = async (userId: string, userEmail: string, userName: string) => {
    try {
      await sendEmail(userId, userEmail);
      toast.success(`Cliente de email aberto para ${userName}`);
    } catch (err) {
      toast.error('Falha ao abrir cliente de email.', { description: (err as Error).message });
    }
  };

  const handleResetPasswordClick = async (userId: string, userName: string) => {
    const newPassword = prompt(`Digite a nova senha para ${userName} (mínimo 6 caracteres):`);
    if (newPassword && newPassword.length >= 6) {
      const confirmation = confirm(`Você tem certeza que deseja resetar a senha de ${userName}?`);
      if (confirmation) {
        try {
          await resetUserPassword(userId, newPassword);
          toast.success(`Senha de ${userName} foi resetada com sucesso!`);
        } catch (err) {
          toast.error(`Falha ao resetar senha.`, { description: (err as Error).message });
        }
      }
    } else if (newPassword !== null) {
      toast.error('A senha deve ter pelo menos 6 caracteres');
    }
  };

  const handleNewUser = () => {
    setActiveTab('create');
  };

  const handleEditUser = (userId: string, userName: string) => {
    toast.info(`Edição de ${userName} em desenvolvimento`);
  };

  // Filtrar usuários baseado na aba ativa
  const getFilteredUsers = () => {
    let filtered = users;

    // Filtrar por aba
    if (activeTab === 'free') {
      filtered = filtered.filter(user => user.plan === 'free');
    } else if (activeTab === 'paid') {
      filtered = filtered.filter(user => user.plan === 'pro' || user.plan === 'enterprise');
    }

    // Aplicar outros filtros
    return filtered.filter(user => {
      const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
      const matchesPlan = planFilter === 'all' || user.plan === planFilter;
      
      return matchesSearch && matchesStatus && matchesPlan;
    });
  };

  const filteredUsers = getFilteredUsers();

  // Calcular estatísticas específicas
  const freeUsers = users.filter(user => user.plan === 'free');
  const paidUsers = users.filter(user => user.plan === 'pro' || user.plan === 'enterprise');
  const proUsers = users.filter(user => user.plan === 'pro');
  const enterpriseUsers = users.filter(user => user.plan === 'enterprise');
  
  const totalRevenue = users.reduce((sum, user) => sum + user.revenue, 0);
  const avgRevenuePerUser = paidUsers.length > 0 ? totalRevenue / paidUsers.length : 0;

  const allStatsData = [
    {
      title: 'Total de Usuários',
      value: stats.total.toString(),
      change: `+${stats.newThisMonth} este mês`,
      trend: 'up',
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Usuários Gratuitos',
      value: freeUsers.length.toString(),
      change: `${((freeUsers.length / stats.total) * 100).toFixed(1)}% do total`,
      trend: 'neutral',
      icon: UserCheck,
      color: 'gray'
    },
    {
      title: 'Usuários Pagos',
      value: paidUsers.length.toString(),
      change: `${((paidUsers.length / stats.total) * 100).toFixed(1)}% do total`,
      trend: 'up',
      icon: Crown,
      color: 'yellow'
    },
    {
      title: 'Receita Total',
      value: `R$ ${totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      change: `R$ ${avgRevenuePerUser.toFixed(2)} por usuário pago`,
      trend: 'up',
      icon: DollarSign,
      color: 'green'
    }
  ];

  const freeStatsData = [
    {
      title: 'Usuários Gratuitos',
      value: freeUsers.length.toString(),
      change: `${((freeUsers.length / stats.total) * 100).toFixed(1)}% do total`,
      trend: 'neutral',
      icon: UserCheck,
      color: 'gray'
    },
    {
      title: 'Usuários Ativos',
      value: freeUsers.filter(u => u.status === 'active').length.toString(),
      change: `${((freeUsers.filter(u => u.status === 'active').length / freeUsers.length) * 100).toFixed(1)}% ativo`,
      trend: 'up',
      icon: TrendingUp,
      color: 'green'
    },
    {
      title: 'Total de Análises',
      value: freeUsers.reduce((sum, user) => sum + user.total_analyses, 0).toString(),
      change: `${(freeUsers.reduce((sum, user) => sum + user.total_analyses, 0) / freeUsers.length).toFixed(1)} por usuário`,
      trend: 'neutral',
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Potencial de Conversão',
      value: freeUsers.filter(u => u.total_analyses >= 5).length.toString(),
      change: 'usuários com 5+ análises',
      trend: 'up',
      icon: Crown,
      color: 'yellow'
    }
  ];

  const paidStatsData = [
    {
      title: 'Usuários Pagos',
      value: paidUsers.length.toString(),
      change: `${proUsers.length} Pro + ${enterpriseUsers.length} Enterprise`,
      trend: 'up',
      icon: Crown,
      color: 'yellow'
    },
    {
      title: 'Receita Total',
      value: `R$ ${totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      change: `R$ ${avgRevenuePerUser.toFixed(2)} por usuário`,
      trend: 'up',
      icon: DollarSign,
      color: 'green'
    },
    {
      title: 'Receita Mensal Recorrente',
      value: `R$ ${(totalRevenue * 0.1).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      change: '+12.5% vs mês anterior',
      trend: 'up',
      icon: CreditCard,
      color: 'green'
    },
    {
      title: 'Análises Realizadas',
      value: paidUsers.reduce((sum, user) => sum + user.total_analyses, 0).toString(),
      change: `${(paidUsers.reduce((sum, user) => sum + user.total_analyses, 0) / paidUsers.length).toFixed(1)} por usuário`,
      trend: 'up',
      icon: TrendingUp,
      color: 'blue'
    }
  ];

  const getPlanBadge = (plan: string) => {
    const variants = {
      free: 'bg-gray-100 text-gray-800',
      pro: 'bg-blue-100 text-blue-800',
      enterprise: 'bg-purple-100 text-purple-800'
    };
    return variants[plan as keyof typeof variants] || variants.free;
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-yellow-100 text-yellow-800',
      blocked: 'bg-red-100 text-red-800'
    };
    return variants[status as keyof typeof variants] || variants.active;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getStatusText = (status: string) => {
    const texts = {
      active: 'Ativo',
      inactive: 'Inativo',
      blocked: 'Bloqueado'
    };
    return texts[status as keyof typeof texts] || status;
  };

  const getPlanText = (plan: string) => {
    const texts = {
      free: 'Gratuito',
      pro: 'Pro',
      enterprise: 'Enterprise'
    };
    return texts[plan as keyof typeof texts] || plan;
  };

  const renderStatsCards = (statsData: typeof allStatsData) => (
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
                  <div className="flex items-center mt-1">
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600 font-medium">
                      {stat.change}
                    </span>
                  </div>
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
  );

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className="ml-2">Carregando usuários...</span>
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
          <h1 className="text-3xl font-bold text-gray-900">Gerenciar Usuários</h1>
          <p className="text-gray-600 mt-1">
            Gerencie contas de usuários, planos e atividades
          </p>
        </div>
        <div className="mt-4 lg:mt-0 flex items-center gap-3">
          <Button variant="outline" onClick={handleExportUsers}>
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          <Button variant="arca" onClick={handleNewUser}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Usuário
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">Todos os Usuários</TabsTrigger>
          <TabsTrigger value="free">Usuários Gratuitos</TabsTrigger>
          <TabsTrigger value="paid">Usuários Pagos</TabsTrigger>
          <TabsTrigger value="create" className="text-green-600 font-medium">
            <UserPlus className="w-4 h-4 mr-2" />
            Criar Usuário
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          {/* Stats - Todos os usuários */}
          {renderStatsCards(allStatsData)}
        </TabsContent>

        <TabsContent value="free" className="space-y-6">
          {/* Stats - Usuários gratuitos */}
          {renderStatsCards(freeStatsData)}
        </TabsContent>

        <TabsContent value="paid" className="space-y-6">
          {/* Stats - Usuários pagos */}
          {renderStatsCards(paidStatsData)}
        </TabsContent>

        {/* Nova aba de criação de usuário */}
        <TabsContent value="create" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-green-600" />
                Criar Novo Usuário
              </CardTitle>
              <p className="text-sm text-gray-600">
                Crie uma nova conta de usuário com permissões específicas
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateUser} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Informações Básicas */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Informações Básicas</h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome Completo *</Label>
                      <Input
                        id="name"
                        type="text"
                        value={newUser.name}
                        onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                        placeholder="Digite o nome completo"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newUser.email}
                        onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                        placeholder="exemplo@email.com"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">Senha *</Label>
                      <Input
                        id="password"
                        type="password"
                        value={newUser.password}
                        onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                        placeholder="Mínimo 6 caracteres"
                        minLength={6}
                        required
                      />
                    </div>
                  </div>

                  {/* Configurações de Conta */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Configurações de Conta</h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor="plan">Plano</Label>
                      <Select 
                        value={newUser.plan} 
                        onValueChange={(value: 'free' | 'pro' | 'enterprise') => 
                          setNewUser({...newUser, plan: value})
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o plano" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="free">Gratuito</SelectItem>
                          <SelectItem value="pro">Pro</SelectItem>
                          <SelectItem value="enterprise">Enterprise</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select 
                        value={newUser.status} 
                        onValueChange={(value: 'active' | 'inactive') => 
                          setNewUser({...newUser, status: value})
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Ativo</SelectItem>
                          <SelectItem value="inactive">Inativo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Permissões Administrativas */}
                    <div className="space-y-4 pt-4 border-t">
                      <h4 className="font-medium text-gray-900 flex items-center gap-2">
                        <Shield className="w-4 h-4 text-red-600" />
                        Permissões Administrativas
                      </h4>
                      
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="isAdmin"
                            checked={newUser.isAdmin}
                            onCheckedChange={(checked) => {
                              setNewUser({
                                ...newUser, 
                                isAdmin: checked as boolean,
                                isSuperAdmin: checked ? newUser.isSuperAdmin : false
                              });
                            }}
                          />
                          <Label htmlFor="isAdmin" className="text-sm cursor-pointer">
                            <span className="font-medium">Administrador</span>
                            <p className="text-xs text-gray-500">
                              Acesso ao painel administrativo e gerenciamento de usuários
                            </p>
                          </Label>
                        </div>

                        {newUser.isAdmin && (
                          <div className="flex items-center space-x-2 ml-6">
                            <Checkbox
                              id="isSuperAdmin"
                              checked={newUser.isSuperAdmin}
                              onCheckedChange={(checked) => 
                                setNewUser({...newUser, isSuperAdmin: checked as boolean})
                              }
                            />
                            <Label htmlFor="isSuperAdmin" className="text-sm cursor-pointer">
                              <span className="font-medium text-red-600">Super Administrador</span>
                              <p className="text-xs text-gray-500">
                                Acesso total ao sistema, incluindo configurações críticas
                              </p>
                            </Label>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Preview da Conta */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3">Preview da Conta</h4>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>
                        {newUser.name ? newUser.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium">{newUser.name || 'Nome não informado'}</p>
                      <p className="text-sm text-gray-500">{newUser.email || 'email@exemplo.com'}</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={`${getPlanBadge(newUser.plan)} border-0`}>
                        {getPlanText(newUser.plan)}
                      </Badge>
                      {newUser.isSuperAdmin && (
                        <Badge className="bg-red-600 text-white border-0">SUPER ADMIN</Badge>
                      )}
                      {newUser.isAdmin && !newUser.isSuperAdmin && (
                        <Badge className="bg-orange-600 text-white border-0">ADMIN</Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* Botões de Ação */}
                <div className="flex justify-end gap-3 pt-6 border-t">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => {
                      setNewUser({
                        name: '',
                        email: '',
                        password: '',
                        plan: 'free',
                        isAdmin: false,
                        isSuperAdmin: false,
                        status: 'active'
                      });
                    }}
                  >
                    Limpar Formulário
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isCreatingUser}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {isCreatingUser ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Criando...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Criar Usuário
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Mostrar lista de usuários apenas nas abas que não são de criação */}
      {activeTab !== 'create' && (
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle>
              Lista de Usuários ({filteredUsers.length} 
              {activeTab === 'free' && ' gratuitos'}
              {activeTab === 'paid' && ' pagos'}
              {activeTab === 'all' && ' total'})
            </CardTitle>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar usuários..."
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
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="inactive">Inativo</SelectItem>
                  <SelectItem value="blocked">Bloqueado</SelectItem>
                </SelectContent>
              </Select>
              {activeTab === 'all' && (
                <Select value={planFilter} onValueChange={setPlanFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Plano" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="free">Gratuito</SelectItem>
                    <SelectItem value="pro">Pro</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Plano</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Cadastro</TableHead>
                  <TableHead>Último Acesso</TableHead>
                  <TableHead>Análises</TableHead>
                  <TableHead>Receita</TableHead>
                  <TableHead className="w-[70px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatar_url} />
                          <AvatarFallback>
                            {user.name ? user.name.split(' ').map(n => n[0]).join('') : user.email.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.name || 'Nome não informado'}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getPlanBadge(user.plan)} border-0`}>
                        {getPlanText(user.plan)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getStatusBadge(user.status)} border-0`}>
                        {getStatusText(user.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(user.created_at)}</TableCell>
                    <TableCell>{formatDate(user.last_access)}</TableCell>
                    <TableCell>
                      <span className="font-medium">{user.total_analyses}</span>
                      {user.plan === 'free' && user.total_analyses >= 5 && (
                        <span className="ml-2 px-1.5 py-0.5 text-xs bg-yellow-100 text-yellow-800 rounded">
                          Potencial
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className={user.revenue > 0 ? 'font-medium text-green-600' : 'text-gray-500'}>
                        {formatCurrency(user.revenue)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditUser(user.id, user.name || user.email)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleSendEmail(user.id, user.email, user.name || user.email)}>
                            <Mail className="mr-2 h-4 w-4" />
                            Enviar Email
                          </DropdownMenuItem>
                            {user.plan !== 'enterprise' && (
                              <DropdownMenuItem 
                                className="text-amber-600 focus:text-amber-700 focus:bg-amber-50"
                                onClick={() => handleMakeAdminClick(user.id, user.name || user.email)}
                              >
                                <Crown className="mr-2 h-4 w-4" />
                                Tornar Admin
                              </DropdownMenuItem>
                            )}
                          {user.plan === 'free' && (
                              <DropdownMenuItem className="text-blue-600" onClick={() => handlePromoteToProClick(user.id, user.name || user.email)}>
                                <TrendingUp className="mr-2 h-4 w-4" />
                              Promover para Pro
                            </DropdownMenuItem>
                          )}
                            <DropdownMenuItem onClick={() => handleResetPasswordClick(user.id, user.name || user.email)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Resetar Senha
                            </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {user.status === 'active' ? (
                              <DropdownMenuItem className="text-red-600" onClick={() => handleToggleUserStatus(user.id, user.name || user.email, user.status)}>
                              <Ban className="mr-2 h-4 w-4" />
                              Bloquear
                            </DropdownMenuItem>
                          ) : (
                              <DropdownMenuItem className="text-green-600" onClick={() => handleToggleUserStatus(user.id, user.name || user.email, user.status)}>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Ativar
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {filteredUsers.length === 0 && !loading && (
            <div className="text-center py-12">
              <p className="text-gray-500">
                {users.length === 0 ? 'Nenhum usuário cadastrado' : 'Nenhum usuário encontrado com os filtros aplicados'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      )}
    </div>
  );
};

export default AdminUsers;