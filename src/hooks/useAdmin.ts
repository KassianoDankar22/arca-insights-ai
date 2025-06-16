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
import { supabase } from '@/integrations/supabase/client';

export type AdminLevel = 'super_admin' | 'admin' | 'moderador';

export interface AdminData {
  isAdmin: boolean;
  isLoading: boolean;
  adminLevel?: AdminLevel;
  permissions: string[];
  canAccess: (permission: string) => boolean;
}

export const useAdmin = (): AdminData => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [adminLevel, setAdminLevel] = useState<AdminLevel>();
  const [permissions, setPermissions] = useState<string[]>([]);

  const fetchAdminData = async () => {
    if (!user) {
      setIsAdmin(false);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      
      const adminEmails = [
        'admin@teste.com',
        'admin@arcaai.com', 
        'suporte@arcaai.com',
        'kassianomarketing@gmail.com',
        'teste3@teste.com',
        'jimmychagass@gmail.com',
        'jimbotoficial@gmail.com',
        'kelseycarvalho.realtor@gmail.com'
      ];

      const superAdminEmails = [
        'admin@teste.com',
        'kelseycarvalho.realtor@gmail.com',
        'kassianomarketing@gmail.com'
      ];

      const tempAdminEmails = JSON.parse(localStorage.getItem('temp_admin_emails') || '[]');
      const allAdminEmails = [...adminEmails, ...tempAdminEmails];
      
      if (user.email && allAdminEmails.includes(user.email)) {
        const isSuperAdmin = superAdminEmails.includes(user.email);
        const adminLevel = isSuperAdmin ? 'super_admin' : 'admin';
        
        setIsAdmin(true);
        setAdminLevel(adminLevel);
        setPermissions(['all']);
        setIsLoading(false);
        
        if (isSuperAdmin) {
          localStorage.setItem(`admin_level_${user.id}`, 'super_admin');
        }
        
        return;
      }

      const { data: userData, error } = await supabase.auth.getUser();
      
      if (!error && userData.user?.app_metadata?.role === 'admin') {
        setIsAdmin(true);
        setAdminLevel('super_admin');
        setPermissions(['all']);
        setIsLoading(false);
        return;
      }

      const storedAdminLevel = localStorage.getItem(`admin_level_${user.id}`);
      
      if (storedAdminLevel && ['super_admin', 'admin', 'moderador'].includes(storedAdminLevel)) {
        setIsAdmin(true);
        setAdminLevel(storedAdminLevel as AdminLevel);
        
        let userPermissions: string[] = [];
        switch (storedAdminLevel) {
          case 'super_admin':
            userPermissions = ['all'];
            break;
          case 'admin':
            userPermissions = ['users', 'analytics', 'support', 'settings'];
            break;
          case 'moderador':
            userPermissions = ['support', 'users:read'];
            break;
        }
        
        setPermissions(userPermissions);
        setIsLoading(false);
        return;
      }

      setIsAdmin(false);
      setAdminLevel(undefined);
      setPermissions([]);

    } catch (error) {
      console.error('❌ [useAdmin] Erro ao verificar admin:', error);
      setIsAdmin(false);
    } finally {
      setIsLoading(false);
    }
  };

  const canAccess = (permission: string): boolean => {
    if (!isAdmin) return false;
    if (permissions.includes('all')) return true;
    return permissions.includes(permission);
  };

  const simulateAdminLevel = (level: AdminLevel | null) => {
    if (user) {
      if (level) {
        localStorage.setItem(`admin_level_${user.id}`, level);
      } else {
        localStorage.removeItem(`admin_level_${user.id}`);
      }
      fetchAdminData();
    }
  };

  const forceAdmin = () => {
    if (user) {
      setIsAdmin(true);
      setAdminLevel('super_admin');
      setPermissions(['all']);
      localStorage.setItem(`admin_level_${user.id}`, 'super_admin');
    }
  };

  const forceSuperAdminForTestUser = () => {
    if (user?.email === 'admin@teste.com') {
      setIsAdmin(true);
      setAdminLevel('super_admin');
      setPermissions(['all']);
      localStorage.setItem(`admin_level_${user.id}`, 'super_admin');
      const tempAdminEmails = JSON.parse(localStorage.getItem('temp_admin_emails') || '[]');
      if (!tempAdminEmails.includes(user.email)) {
        tempAdminEmails.push(user.email);
        localStorage.setItem('temp_admin_emails', JSON.stringify(tempAdminEmails));
      }
      return true;
    }
    return false;
  };

  useEffect(() => {
    (window as any).simulateAdminLevel = simulateAdminLevel;
    (window as any).forceAdmin = forceAdmin;
    (window as any).forceSuperAdminForTestUser = forceSuperAdminForTestUser;
    (window as any).checkAdminStatus = () => {
      // Silencioso por padrão, mas pode ser reativado para depuração
    };
  }, [user, isAdmin, adminLevel, permissions]);

  useEffect(() => {
    fetchAdminData();
  }, [user]);

  useEffect(() => {
    if (user?.email === 'admin@teste.com' && !isLoading) {
      if (!isAdmin || adminLevel !== 'super_admin') {
        forceSuperAdminForTestUser();
      }
    }
  }, [user, isAdmin, adminLevel, isLoading]);
  
  useEffect(() => {
    // Log silencioso, pode ser reativado para depuração se necessário
  }, [isAdmin, isLoading, adminLevel, permissions, user?.email]);

  return {
    isAdmin,
    isLoading,
    adminLevel,
    permissions,
    canAccess
  };
}; 