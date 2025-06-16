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

import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { toast } from 'sonner';

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description: string;
  date: string;
  created_at: string;
}

interface FinanceiroStats {
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
  monthlyIncome: number;
  pendingTransactions: number;
}

export const useFinanceiro = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<FinanceiroStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUsingMockData, setIsUsingMockData] = useState(false);
  const { user } = useAuth();

  const getMockTransactions = (): Transaction[] => [
    {
      id: '1',
      type: 'income',
      category: 'Aluguel',
      amount: 2500,
      description: 'Aluguel Apartamento Centro',
      date: '2024-01-15',
      created_at: '2024-01-15T10:00:00Z'
    },
    {
      id: '2',
      type: 'expense',
      category: 'Manutenção',
      amount: 450,
      description: 'Reparo elétrico',
      date: '2024-01-10',
      created_at: '2024-01-10T14:00:00Z'
    },
    {
      id: '3',
      type: 'income',
      category: 'Aluguel',
      amount: 1800,
      description: 'Aluguel Casa Vila Nova',
      date: '2024-01-12',
      created_at: '2024-01-12T09:00:00Z'
    },
    {
      id: '4',
      type: 'expense',
      category: 'Impostos',
      amount: 320,
      description: 'IPTU',
      date: '2024-01-08',
      created_at: '2024-01-08T16:00:00Z'
    },
    {
      id: '5',
      type: 'income',
      category: 'Venda',
      amount: 15000,
      description: 'Comissão venda apartamento',
      date: '2024-01-20',
      created_at: '2024-01-20T11:00:00Z'
    }
  ];

  const fetchFinanceiroData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      // Buscar dados reais da tabela transactions (ignorando tipos TS temporariamente)
      const { data: transactionsData, error: transactionsError } = await supabase
        .from('transactions' as any)
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (transactionsError) {
        console.error('Error fetching transactions:', transactionsError);
        // Fallback para dados mock se houver erro
        const mockData = getMockTransactions();
        setTransactions(mockData);
        calculateStats(mockData);
        setIsUsingMockData(true);
      } else {
        // Converter dados do banco para o formato esperado
        const convertedTransactions: Transaction[] = (transactionsData || []).map((transaction: any) => ({
          id: transaction.id,
          type: transaction.type,
          category: transaction.category,
          amount: transaction.amount,
          description: transaction.description,
          date: transaction.date,
          created_at: transaction.created_at
        }));
        
        setTransactions(convertedTransactions);
        calculateStats(convertedTransactions);
        setIsUsingMockData(false);
        console.log('✅ Financeiro usando dados reais do Supabase');
      }

    } catch (err) {
      console.error('Erro ao buscar dados financeiros:', err);
      const mockData = getMockTransactions();
      setTransactions(mockData);
      calculateStats(mockData);
      setIsUsingMockData(true);
      setError('Erro ao carregar dados financeiros');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (transactionsData: Transaction[]) => {
    const totalIncome = transactionsData
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactionsData
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    setStats({
      totalIncome,
      totalExpenses,
      netProfit: totalIncome - totalExpenses,
      monthlyIncome: totalIncome,
      pendingTransactions: 0
    });
  };

  const addTransaction = async (transaction: Omit<Transaction, 'id' | 'created_at'>) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const newTransaction = {
        ...transaction,
        user_id: user.id,
      };

      const { data, error } = await supabase
        .from('transactions' as any)
        .insert([newTransaction])
        .select()
        .single();

      if (error) {
        console.error('Error creating transaction:', error);
        throw error;
      }

      await fetchFinanceiroData(); // Refresh data
      toast.success('Transação criada com sucesso!');
      console.log('✅ Transação criada no Supabase:', data);
      return data;
    } catch (error) {
      console.error('Error creating transaction:', error);
      toast.error('Erro ao criar transação');
      throw error;
    }
  };

  useEffect(() => {
    fetchFinanceiroData();
  }, [user]);

  return {
    transactions,
    stats,
    loading,
    error,
    isUsingMockData,
    addTransaction,
    refetch: fetchFinanceiroData
  };
}; 