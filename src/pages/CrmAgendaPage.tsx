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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CalendarDays, ListChecks, AlertTriangle } from 'lucide-react';

const CrmAgendaPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <header>
          <h1 className="text-3xl font-bold text-gray-900">Agenda e Tarefas</h1>
          <p className="text-gray-600">Organize seus compromissos e acompanhe suas atividades pendentes.</p>
        </header>

        <div className="grid gap-6 lg:grid-cols-5">
          {/* Coluna do Calendário */}
          <div className="lg:col-span-3">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CalendarDays className="mr-2 h-6 w-6 text-blue-600" /> Calendário
                </CardTitle>
                <CardDescription>
                  Visualize seus eventos e compromissos agendados.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Placeholder para o Calendário */}
                <div className="min-h-[400px] flex flex-col items-center justify-center bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <CalendarDays className="h-16 w-16 text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">Componente de Calendário (Em Breve)</h3>
                  <p className="text-gray-500 max-w-md">
                    Aqui será exibido um calendário interativo com seus agendamentos, possivelmente com integração ao Google Calendar.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Coluna da Lista de Tarefas */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ListChecks className="mr-2 h-6 w-6 text-blue-600" /> Lista de Tarefas
                </CardTitle>
                <CardDescription>
                  Suas atividades e pendências importantes.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Placeholder para a Lista de Tarefas */}
                <div className="min-h-[400px] flex flex-col items-center justify-center bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <ListChecks className="h-16 w-16 text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">Gerenciador de Tarefas (Em Breve)</h3>
                  <p className="text-gray-500 max-w-md">
                    Listagem de tarefas com filtros por status (pendente, concluída), prioridade e data de vencimento.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md text-sm text-yellow-700">
          <AlertTriangle className="inline h-5 w-5 mr-2" />
          <strong>Nota:</strong> As funcionalidades de calendário e lista de tarefas interativas serão implementadas em etapas futuras.
        </div>
      </div>
    </div>
  );
};

export default CrmAgendaPage; 