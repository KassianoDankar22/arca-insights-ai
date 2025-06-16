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
import { ArrowDownRight } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface ExpenseItem {
  name: string;
  value: number;
}

interface MonthlyExpensesSectionProps {
  expenses: {
    total: number;
    breakdown: ExpenseItem[];
  };
  formatCurrency: (value: number) => string;
}

const MonthlyExpensesSection: React.FC<MonthlyExpensesSectionProps> = ({
  expenses,
  formatCurrency
}) => {
  return (
    <Card className="p-4">
      <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
        <ArrowDownRight size={18} className="text-red-500" />
        DESPESAS MENSAIS
      </h3>
      <div className="grid grid-cols-3 gap-3">
        {expenses.breakdown.map((expense, index) => (
          <div key={index}>
            <p className="text-xs text-gray-500">{expense.name.toUpperCase()}</p>
            <p className="text-sm font-medium">{formatCurrency(expense.value)}</p>
          </div>
        ))}
      </div>
      <div className="border-t pt-3 mt-3">
        <p className="text-sm text-gray-600">TOTAL DESPESAS OPERACIONAIS</p>
        <p className="text-xl font-bold text-red-500">-{formatCurrency(expenses.total)}</p>
      </div>
    </Card>
  );
};

export default MonthlyExpensesSection; 