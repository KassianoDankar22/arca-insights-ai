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
import { Shield, Crown, Users, Settings, X } from 'lucide-react';
import { useAdmin } from '@/hooks/useAdmin';

const AdminTestControls = () => {
  const { adminLevel } = useAdmin();

  const simulateAdminLevel = (level: 'super_admin' | 'admin' | 'moderador' | null) => {
    // Usar a função global que foi exposta no hook
    (window as any).simulateAdminLevel?.(level);
    if (level === null) {
      window.location.reload();
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle className="text-center">
          <Settings className="inline w-4 h-4 mr-2" /> Controles de Teste - Admin
        </CardTitle>
        <p className="text-sm text-gray-600 text-center">
          Nível atual: <strong>{adminLevel?.replace('_', ' ').toUpperCase() || 'NONE'}</strong>
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        <button 
          onClick={() => simulateAdminLevel('super_admin')}
          className={`w-full justify-start shadow-[0_4px_14px_0_rgb(0,118,255,39%)] hover:shadow-[0_6px_20px_rgba(0,118,255,23%)] hover:bg-[rgba(0,118,255,0.9)] px-8 py-2 bg-[#0070f3] rounded-md text-white font-light transition duration-200 ease-linear flex items-center ${adminLevel === 'super_admin' ? 'opacity-50' : ''}`}
          disabled={adminLevel === 'super_admin'}
        >
          <Crown className="w-4 h-4 mr-2" />
          Super Admin (Acesso Total)
        </button>
        
        <button 
          onClick={() => simulateAdminLevel('admin')}
          className={`w-full justify-start shadow-[0_4px_14px_0_rgb(0,118,255,39%)] hover:shadow-[0_6px_20px_rgba(0,118,255,23%)] hover:bg-[rgba(0,118,255,0.9)] px-8 py-2 bg-[#0070f3] rounded-md text-white font-light transition duration-200 ease-linear flex items-center ${adminLevel === 'admin' ? 'opacity-50' : ''}`}
          disabled={adminLevel === 'admin'}
        >
          <Shield className="w-4 h-4 mr-2" />
          Admin (Maioria dos Recursos)
        </button>
        
        <button 
          onClick={() => simulateAdminLevel('moderador')}
          className={`w-full justify-start shadow-[0_4px_14px_0_rgb(0,118,255,39%)] hover:shadow-[0_6px_20px_rgba(0,118,255,23%)] hover:bg-[rgba(0,118,255,0.9)] px-8 py-2 bg-[#0070f3] rounded-md text-white font-light transition duration-200 ease-linear flex items-center ${adminLevel === 'moderador' ? 'opacity-50' : ''}`}
          disabled={adminLevel === 'moderador'}
        >
          <Users className="w-4 h-4 mr-2" />
          Moderador (Suporte e Usuários)
        </button>
        
        <button 
          onClick={() => simulateAdminLevel(null)}
          className="w-full justify-start shadow-[0_4px_14px_0_rgb(239,68,68,39%)] hover:shadow-[0_6px_20px_rgba(239,68,68,23%)] hover:bg-[rgba(239,68,68,0.9)] px-8 py-2 bg-red-500 rounded-md text-white font-light transition duration-200 ease-linear flex items-center"
        >
          <X className="inline w-4 h-4 mr-1" /> Remover Acesso Admin
        </button>
        
        <div className="pt-3 border-t text-xs text-gray-500 text-center">
          Apenas para desenvolvimento. Para testar o acesso às páginas administrativas.
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminTestControls; 