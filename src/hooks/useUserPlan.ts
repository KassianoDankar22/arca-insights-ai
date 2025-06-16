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

export type UserPlan = 'free' | 'pro' | 'enterprise';

export interface UserPlanData {
  plan: UserPlan;
  isLoading: boolean;
  isPro: boolean;
  isFree: boolean;
  isEnterprise: boolean;
  upgradeToProAction: () => void;
  refreshPlan: () => Promise<void>;
}

export const useUserPlan = (): UserPlanData => {
  const { user } = useAuth();
  const [plan, setPlan] = useState<UserPlan>('free');
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserPlan = async () => {
    setIsLoading(true);
    
    try {
      if (!user) {
        setPlan('free');
        return;
      }

      // Por enquanto, verificar no localStorage ou metadata do usuário
      const storedPlan = localStorage.getItem(`user_plan_${user.id}`);
      
      if (storedPlan && ['pro', 'enterprise'].includes(storedPlan)) {
        setPlan(storedPlan as UserPlan);
      } else {
        // Verificar metadata do usuário
        const userMetadata = user.user_metadata;
        const planFromMetadata = userMetadata?.plan as UserPlan;
        
        if (planFromMetadata && ['pro', 'enterprise'].includes(planFromMetadata)) {
          setPlan(planFromMetadata);
        } else {
          setPlan('free');
        }
      }
    } catch (error) {
      console.error('Erro ao verificar plano:', error);
      setPlan('free');
    } finally {
      setIsLoading(false);
    }
  };

  const upgradeToProAction = () => {
    // Redirecionar para página de planos
    window.location.href = '/plans';
  };

  const refreshPlan = async () => {
    await fetchUserPlan();
  };

  // Função para simular upgrade (para demonstração)
  const simulateUpgrade = (newPlan: UserPlan) => {
    if (user) {
      localStorage.setItem(`user_plan_${user.id}`, newPlan);
      setPlan(newPlan);
    }
  };

  // Expor simulateUpgrade globalmente para teste
  useEffect(() => {
    (window as any).simulateUpgrade = simulateUpgrade;
  }, [user]);

  useEffect(() => {
    fetchUserPlan();
  }, [user]);

  return {
    plan,
    isLoading,
    isPro: plan === 'pro',
    isFree: plan === 'free',
    isEnterprise: plan === 'enterprise',
    upgradeToProAction,
    refreshPlan
  };
}; 