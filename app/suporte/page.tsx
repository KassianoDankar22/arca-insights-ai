'use client';

import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, MessageSquareText, AlertTriangle } from 'lucide-react';

const SuportePage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <header className='mb-8'>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-arca-dark flex items-center">
                <MessageSquareText className="mr-3 h-8 w-8 text-arca-blue" /> Central de Suporte
              </h1>
              <p className="text-gray-600 mt-1 ml-11">Precisa de ajuda? Abra um ticket ou acompanhe suas solicitações.</p>
            </div>
            <Button className="bg-arca-blue hover:bg-arca-dark-blue">
              <PlusCircle className="mr-2 h-5 w-5" />
              Abrir Novo Ticket
            </Button>
          </div>
        </header>

        {/* Placeholder para lista de tickets */}
        <Card>
          <CardHeader>
            <CardTitle>Meus Tickets de Suporte</CardTitle>
            <CardDescription>Acompanhe o status das suas solicitações.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-10 text-center text-gray-400 border-2 border-dashed border-gray-300 rounded-lg">
              <AlertTriangle className="mx-auto h-12 w-12 text-gray-300 mb-3" />
              <p className="font-medium">Nenhum ticket de suporte encontrado.</p>
              <p className="text-sm mt-1">Clique em "Abrir Novo Ticket" para criar sua primeira solicitação.</p>
            </div>
            {/* Futuramente, aqui virá uma tabela ou lista de tickets */}
          </CardContent>
        </Card>

      </div>
    </DashboardLayout>
  );
};

export default SuportePage; 