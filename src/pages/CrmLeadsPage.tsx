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
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Filter, Download, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

// Dados mocados para a tabela de leads por enquanto
const mockLeads = [
  { id: '1', nome: 'Empresa Alpha', status: 'Novo', etapaFunil: 'Prospecção', responsavel: 'João Silva', dataCriacao: '2024-07-28' },
  { id: '2', nome: 'Soluções Beta', status: 'Qualificado', etapaFunil: 'Qualificação', responsavel: 'Maria Oliveira', dataCriacao: '2024-07-27' },
  { id: '3', nome: 'Tecnologias Gamma', status: 'Proposta Enviada', etapaFunil: 'Proposta', responsavel: 'João Silva', dataCriacao: '2024-07-26' },
  { id: '4', nome: 'Consultoria Delta', status: 'Em Negociação', etapaFunil: 'Negociação', responsavel: 'Carlos Pereira', dataCriacao: '2024-07-25' },
  { id: '5', nome: 'Serviços Epsilon', status: 'Novo', etapaFunil: 'Prospecção', responsavel: 'Ana Costa', dataCriacao: '2024-07-29' },
];

const CrmLeadsPage: React.FC = () => {
  const getStatusColor = (status: string) => {
    const colors = {
      'Novo': 'bg-blue-100 text-blue-800',
      'Qualificado': 'bg-purple-100 text-purple-800',
      'Proposta Enviada': 'bg-orange-100 text-orange-800',
      'Em Negociação': 'bg-indigo-100 text-indigo-800',
      'Fechado': 'bg-green-100 text-green-800',
      'Perdido': 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestão de Leads</h1>
            <p className="text-gray-600">Visualize e gerencie todos os seus leads.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="bg-white">
              <Filter className="mr-2 h-4 w-4" /> Filtros
            </Button>
            <Button variant="outline" className="bg-white">
              <Download className="mr-2 h-4 w-4" /> Exportar
            </Button>
            <Button className="bg-arca-main hover:bg-arca-dark">
              <Plus className="h-4 w-4 mr-2" />
              Novo Lead
            </Button>
          </div>
        </header>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Lista de Leads</CardTitle>
            <CardDescription>Total de {mockLeads.length} leads encontrados.</CardDescription>
            {/* TODO: Adicionar input de busca aqui */}
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Etapa do Funil</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Responsável</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data de Criação</th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Ações</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {mockLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{lead.nome}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <Badge className={getStatusColor(lead.status)}>
                          {lead.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lead.etapaFunil}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lead.responsavel}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(lead.dataCriacao).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button variant="link" size="sm" className="text-blue-600 hover:text-blue-800">
                          Detalhes
                        </Button>
                        {/* TODO: Adicionar mais ações como Editar, Excluir */}
                      </td>
                    </tr>
                  ))}
                  {mockLeads.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-sm text-gray-500">
                        Nenhum lead encontrado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {/* TODO: Adicionar paginação */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CrmLeadsPage; 