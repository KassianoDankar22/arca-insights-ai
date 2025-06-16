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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/auth';
import { useAdmin } from '@/hooks/useAdmin';
import { Shield, Bug, Settings, Crown, Zap, AlertTriangle, CheckCircle, X } from 'lucide-react';

const AdminDebugPanel: React.FC = () => {
  const { user } = useAuth();
  const { isAdmin, isLoading, adminLevel, permissions } = useAdmin();

  const forceAdmin = () => {
    (window as any).forceAdmin?.();
    window.location.reload();
  };

  const forceSuperAdmin = () => {
    (window as any).forceSuperAdminForTestUser?.();
    window.location.reload();
  };

  const checkStatus = () => {
    (window as any).checkAdminStatus?.();
  };

  const clearAdmin = () => {
    if (user) {
      localStorage.removeItem(`admin_level_${user.id}`);
      localStorage.removeItem('temp_admin_emails');
      window.location.reload();
    }
  };

  const isTestAdmin = user?.email === 'admin@teste.com';
  const isSuperAdmin = adminLevel === 'super_admin';

  return (
    <Card className="fixed bottom-4 right-4 w-80 z-50 bg-white border-2 border-red-200 shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Bug className="w-4 h-4" />
          Debug Admin Panel
          <Badge variant="outline" className="ml-auto">DEV</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-xs space-y-1">
          <div><strong>Email:</strong> {user?.email}</div>
          <div><strong>Loading:</strong> {isLoading ? 'Sim' : 'Não'}</div>
          <div><strong>Is Admin:</strong> {isAdmin ? <><CheckCircle className="inline w-4 h-4 mr-1" /> Sim</> : <><X className="inline w-4 h-4 mr-1" /> Não</>}</div>
          <div><strong>Level:</strong> {adminLevel || 'Nenhum'}</div>
          <div><strong>Permissions:</strong> {permissions.join(', ') || 'Nenhuma'}</div>
          {isTestAdmin && (
            <div className="border-t pt-2">
              <div className="flex items-center gap-1">
                <Crown className="w-3 h-3 text-yellow-600" />
                <strong className="text-yellow-600">ADMIN TESTE:</strong>
              </div>
              <div className="text-xs">
                Status: {isSuperAdmin ? <><Crown className="inline w-4 h-4 mr-1" /> SUPER ADMIN</> : <><AlertTriangle className="inline w-4 h-4 mr-1" /> Admin Normal</>}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          {isTestAdmin && !isSuperAdmin && (
            <Button 
              onClick={forceSuperAdmin} 
              size="sm" 
              className="bg-yellow-600 hover:bg-yellow-700 text-xs text-white"
            >
              <Crown className="w-3 h-3 mr-1" />
              Forçar SUPER ADMIN
            </Button>
          )}
          
          {!isAdmin && (
            <Button 
              onClick={forceAdmin} 
              size="sm" 
              className="bg-red-600 hover:bg-red-700 text-xs"
            >
              <Shield className="w-3 h-3 mr-1" />
              Forçar Admin
            </Button>
          )}
          
          <Button 
            onClick={checkStatus} 
            size="sm" 
            variant="outline"
            className="text-xs"
          >
            <Settings className="w-3 h-3 mr-1" />
            Check Console
          </Button>
          
          <Button 
            onClick={clearAdmin} 
            size="sm" 
            variant="outline"
            className="text-xs"
          >
            Limpar Admin
          </Button>
        </div>

        <div className="text-xs text-gray-500 border-t pt-2">
          {isTestAdmin ? (
            <div>
              <div className="font-medium text-yellow-600">ADMIN TESTE DETECTADO</div>
              <div>Use o botão acima se não estiver como SUPER ADMIN</div>
            </div>
          ) : (
            <div>Verifique o console do navegador (F12) para logs detalhados.</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminDebugPanel; 