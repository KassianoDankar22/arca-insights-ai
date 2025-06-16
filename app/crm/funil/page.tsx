'use client';

import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Trello, Columns, AlertTriangle } from 'lucide-react'; // Usando Columns ou Trello como ícone

const CrmFunilPage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <header>
          <h1 className="text-3xl font-bold text-arca-dark">Funil de Vendas (Pipeline)</h1>
          <p className="text-gray-600">Visualize e gerencie o progresso dos seus negócios etapa por etapa.</p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Columns className="mr-2 h-6 w-6 text-arca-blue" /> Pipeline Visual
            </CardTitle>
            <CardDescription>
              Arraste e solte os cards entre as colunas para atualizar o status dos seus negócios.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Placeholder para o Kanban Board */}
            <div className="min-h-[400px] flex flex-col items-center justify-center bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Trello className="h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Kanban Board (Em Breve)</h3>
              <p className="text-gray-500 max-w-md">
                Esta área exibirá um funil de vendas interativo no estilo Kanban, permitindo que você mova leads e negócios através de diferentes etapas personalizadas.
              </p>
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md text-sm text-blue-700">
                <AlertTriangle className="inline h-5 w-5 mr-2" />
                Funcionalidade de Drag & Drop e colunas customizáveis serão implementadas aqui.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CrmFunilPage; 