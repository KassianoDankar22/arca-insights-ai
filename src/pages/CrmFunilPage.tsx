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
import { Trello, Columns, AlertTriangle } from 'lucide-react';

const CrmFunilPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <header>
          <h1 className="text-3xl font-bold text-gray-900">Funil de Vendas (Pipeline)</h1>
          <p className="text-gray-600">Visualize e gerencie o progresso dos seus negócios etapa por etapa.</p>
        </header>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Columns className="mr-2 h-6 w-6 text-blue-600" /> Pipeline Visual
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
    </div>
  );
};

export default CrmFunilPage; 