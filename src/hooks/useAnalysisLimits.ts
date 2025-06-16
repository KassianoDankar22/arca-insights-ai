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
import { useAuth } from '@/lib/auth';
import { useUserPlan } from './useUserPlan';
import { useAdmin } from './useAdmin';
import { supabase } from '@/integrations/supabase/client';

export interface AnalysisLimits {
  totalLimit: number;
  used: number;
  remaining: number;
  percentage: number;
  isUnlimited: boolean;
  canCreateAnalysis: boolean;
  isLoading: boolean;
  resetDate?: string;
  planType: 'free' | 'pro' | 'admin';
  refetchUsage: () => Promise<void>;
}

export const useAnalysisLimits = (): AnalysisLimits => {
  const { user } = useAuth();
  const { plan } = useUserPlan();
  const { isAdmin } = useAdmin();
  const [used, setUsed] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [monthlyUsed, setMonthlyUsed] = useState(0);

  // Definir limites baseado no plano
  let totalLimit = 5; // Free: 5 análises totais
  let isUnlimited = false;
  let planType: 'free' | 'pro' | 'admin' = 'free';
  let resetDate: string | undefined;

  // Determinar o tipo de plano e limites
  if (isAdmin) {
    // Administradores têm análises infinitas
    totalLimit = 9999999;
    isUnlimited = true;
    planType = 'admin';
  } else if (plan === 'pro') {
    // Plano Pro: 40 análises por mês
    totalLimit = 40;
    isUnlimited = false;
    planType = 'pro';
    // Data de reset é no primeiro dia do próximo mês
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    resetDate = nextMonth.toLocaleDateString('pt-BR');
  } else if (plan === 'enterprise') {
    // Plano Enterprise: análises ilimitadas
    totalLimit = 9999999;
    isUnlimited = true;
    planType = 'pro'; // Mantido como 'pro' para usar a lógica mensal
  } else {
    // Plano Free: 5 análises totais (lifetime)
    totalLimit = 5;
    isUnlimited = false;
    planType = 'free';
  }

  const fetchUsageData = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);

      if (planType === 'pro') {
        // Para plano Pro, contar análises do mês atual
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        
        const { count, error } = await supabase
          .from('roi_analises')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .gte('criado_em', startOfMonth.toISOString());

        if (error) {
          console.error('Erro ao buscar análises mensais:', error);
          setMonthlyUsed(0);
        } else {
          setMonthlyUsed(count || 0);
        }
      } else {
        // Para plano Free, contar total de análises
        const { count, error } = await supabase
          .from('roi_analises')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);

        if (error) {
          console.error('Erro ao buscar total de análises:', error);
          setUsed(0);
        } else {
          setUsed(count || 0);
        }
      }
    } catch (error) {
      console.error('Erro ao verificar limites de análise:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsageData();
  }, [user?.id, plan]);

  // Usar dados mensais para Pro, dados totais para Free
  const currentUsed = planType === 'pro' ? monthlyUsed : used;
  const remaining = isUnlimited ? 999999 : Math.max(0, totalLimit - currentUsed);
  const percentage = isUnlimited ? 0 : Math.min(100, (currentUsed / totalLimit) * 100);
  const canCreateAnalysis = isUnlimited || remaining > 0;

  return {
    totalLimit,
    used: currentUsed,
    remaining,
    percentage,
    isUnlimited,
    canCreateAnalysis,
    isLoading,
    resetDate,
    planType,
    refetchUsage: fetchUsageData
  };
}; 