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
import { Card } from '@/components/ui/card';
import { Users, DollarSign } from 'lucide-react';

interface LeadsMetricsProps {
  totalLeads: number;
  closedLeads: number;
  revenue: number;
  loading?: boolean;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

export default function LeadsMetrics({ 
  totalLeads, 
  closedLeads, 
  revenue,
  loading = false 
}: LeadsMetricsProps) {
  const conversionRate = totalLeads > 0 ? ((closedLeads / totalLeads) * 100).toFixed(1) : '0';

  return (
    <Card className="p-6">
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-xl font-semibold">Performance de Vendas</h2>
        <span className="text-sm text-gray-500">Este mês</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total de Leads */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <span className="text-gray-600">Total de Leads</span>
          </div>
          <p className="text-2xl font-bold">
            {loading ? "..." : totalLeads}
          </p>
          <p className="text-sm text-gray-500">
            Taxa de conversão: {conversionRate}%
          </p>
        </div>

        {/* Leads Fechados */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <Users className="h-5 w-5 text-green-600" />
            </div>
            <span className="text-gray-600">Leads Fechados</span>
          </div>
          <p className="text-2xl font-bold">
            {loading ? "..." : closedLeads}
          </p>
          <p className="text-sm text-green-600">
            +{((closedLeads / totalLeads) * 100).toFixed(1)}% de conversão
          </p>
        </div>

        {/* Receita */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <DollarSign className="h-5 w-5 text-purple-600" />
            </div>
            <span className="text-gray-600">Receita</span>
          </div>
          <p className="text-2xl font-bold">
            {loading ? "..." : formatCurrency(revenue)}
          </p>
          <p className="text-sm text-purple-600">
            Ticket médio: {formatCurrency(revenue / closedLeads)}
          </p>
        </div>
      </div>
    </Card>
  );
} 