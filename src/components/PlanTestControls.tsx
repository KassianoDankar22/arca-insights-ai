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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Crown, Zap, Building2, Settings } from 'lucide-react';
import { useUserPlan } from '@/hooks/useUserPlan';

const PlanTestControls = () => {
  const { plan, refreshPlan } = useUserPlan();

  const simulateUpgrade = (newPlan: 'free' | 'pro' | 'enterprise') => {
    // Usar a função global que foi exposta no hook
    (window as any).simulateUpgrade?.(newPlan);
    setTimeout(() => refreshPlan(), 100);
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle className="text-center">
          <Settings className="inline w-4 h-4 mr-2" /> Controles de Teste - Planos
        </CardTitle>
        <p className="text-sm text-gray-600 text-center">
          Plano atual: <strong>{plan.toUpperCase()}</strong>
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        <button 
          onClick={() => simulateUpgrade('free')}
          className={`w-full justify-start shadow-[0_4px_14px_0_rgb(0,118,255,39%)] hover:shadow-[0_6px_20px_rgba(0,118,255,23%)] hover:bg-[rgba(0,118,255,0.9)] px-8 py-2 bg-[#0070f3] rounded-md text-white font-light transition duration-200 ease-linear flex items-center ${plan === 'free' ? 'opacity-50' : ''}`}
          disabled={plan === 'free'}
        >
          <Zap className="w-4 h-4 mr-2" />
          Simular Gratuito
        </button>
        
        <button 
          onClick={() => simulateUpgrade('pro')}
          className={`w-full justify-start shadow-[0_4px_14px_0_rgb(0,118,255,39%)] hover:shadow-[0_6px_20px_rgba(0,118,255,23%)] hover:bg-[rgba(0,118,255,0.9)] px-8 py-2 bg-[#0070f3] rounded-md text-white font-light transition duration-200 ease-linear flex items-center ${plan === 'pro' ? 'opacity-50' : ''}`}
          disabled={plan === 'pro'}
        >
          <Crown className="w-4 h-4 mr-2" />
          Simular Pro
        </button>
        
        <button 
          onClick={() => simulateUpgrade('enterprise')}
          className={`w-full justify-start shadow-[0_4px_14px_0_rgb(0,118,255,39%)] hover:shadow-[0_6px_20px_rgba(0,118,255,23%)] hover:bg-[rgba(0,118,255,0.9)] px-8 py-2 bg-[#0070f3] rounded-md text-white font-light transition duration-200 ease-linear flex items-center ${plan === 'enterprise' ? 'opacity-50' : ''}`}
          disabled={plan === 'enterprise'}
        >
          <Building2 className="w-4 h-4 mr-2" />
          Simular Enterprise
        </button>
        
        <div className="pt-3 border-t text-xs text-gray-500 text-center">
          Apenas para desenvolvimento. Recarregue a página para resetar.
        </div>
      </CardContent>
    </Card>
  );
};

export default PlanTestControls; 