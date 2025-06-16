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

import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Logo from './Logo';
import { Home, Settings, LogOut, MessageSquare, GraduationCap, DollarSign, History, Wrench, Users, HelpCircle, Crown, Zap, Shield, BarChart3, UserCheck, ArrowLeft, Headphones } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/lib/auth';
import { useUserPlan } from '@/hooks/useUserPlan';
import { useAdmin } from '@/hooks/useAdmin';
import { useAnalysisLimits } from '@/hooks/useAnalysisLimits';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from '@/integrations/supabase/client';

interface SidebarProps {
  className?: string;
}

interface UserProfile {
  nome_completo: string | null;
  avatar_url: string | null;
}

interface NavItem {
  icon: React.ComponentType<any>;
  label: string;
  path: string;
  id: string;
  isNew?: boolean;
  isUpgrade?: boolean;
  isPro?: boolean;
  isAdmin?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { signOut, user } = useAuth();
  const { isPro, isFree, isLoading } = useUserPlan();
  const { isAdmin } = useAdmin();
  const { used, totalLimit, remaining, percentage, isUnlimited } = useAnalysisLimits();
  
  // Estado para o perfil do usuário
  const [userProfile, setUserProfile] = useState<UserProfile>({ nome_completo: null, avatar_url: null });
  
  // Buscar perfil do usuário
  useEffect(() => {
    if (!user) return;
    
    // Usar dados do user_metadata diretamente
    setUserProfile({
      nome_completo: user.user_metadata?.full_name || user.user_metadata?.name || null,
      avatar_url: user.user_metadata?.avatar_url || null
    });
  }, [user]);
  
  // Verificar se está em área administrativa
  const isAdminArea = location.pathname.startsWith('/admin');

  const baseNavItems: NavItem[] = [
    { icon: Home, label: 'Home', path: '/', id: 'home' },
    { icon: Wrench, label: 'Ferramentas', path: '/ferramentas', id: 'tools' }, 
    { icon: MessageSquare, label: 'Arca AI Chat', path: '/chat', id: 'chat', isNew: true },
    { icon: Headphones, label: 'Chat ao Vivo', path: '/chat-live', id: 'chat-live', isNew: true },
    { icon: GraduationCap, label: 'Academy', path: '/academy', id: 'academy', isNew: true },
    { icon: Users, label: 'CRM', path: '/crm', id: 'crm' },
    { icon: DollarSign, label: 'Financeiro', path: '/financeiro', id: 'finance' },
    { icon: History, label: 'Meus ROIs', path: '/meus-rois', id: 'myrois' },
    { icon: BarChart3, label: 'Uso e Limites', path: '/uso', id: 'usage' },
    { icon: HelpCircle, label: 'Suporte', path: '/suporte', id: 'help' },
    { icon: Settings, label: 'Configurações', path: '/configuracoes', id: 'settings' },
  ];

  // Menu administrativo
  const adminNavItems: NavItem[] = [
    { icon: ArrowLeft, label: 'Voltar ao Dashboard', path: '/dashboard?user=true', id: 'back-to-dashboard' },
    { icon: Shield, label: 'Dashboard Admin', path: '/admin', id: 'admin-dashboard', isAdmin: true },
    { icon: UserCheck, label: 'Gerenciar Usuários', path: '/admin/users', id: 'admin-users', isAdmin: true },
    { icon: BarChart3, label: 'Análises ROI', path: '/admin/analytics', id: 'admin-analytics', isAdmin: true },
    { icon: Headphones, label: 'Chat ao Vivo', path: '/admin/live-chat', id: 'admin-live-chat', isAdmin: true },
    { icon: HelpCircle, label: 'Suporte', path: '/admin/support', id: 'admin-support', isAdmin: true },
  ];

  // Escolher o menu baseado na área atual
  let navItems: NavItem[];
  
  if (isAdminArea && isAdmin) {
    navItems = adminNavItems;
  } else {
    // Menu normal com item de admin se for admin
    const adminItem: NavItem[] = isAdmin ? [
      { icon: Shield, label: 'Painel Admin', path: '/admin', id: 'admin-access', isAdmin: true }
    ] : [];
    
    // Adicionar item de planos apenas para usuários gratuitos
    const planItems: NavItem[] = isFree ? [
      { icon: Crown, label: 'Planos', path: '/plans', id: 'plans', isUpgrade: true }
    ] : [];

    navItems = [...baseNavItems, ...adminItem, ...planItems];
  }

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const displayName = userProfile.nome_completo || user?.email?.split('@')[0] || 'Usuário';
  
  // Gerar iniciais corretas
  const getInitials = () => {
    if (userProfile.nome_completo) {
      // Se tem nome completo, pegar primeira letra de cada palavra (máximo 2)
      const nameParts = userProfile.nome_completo.trim().split(' ').filter(part => part.length > 0);
      if (nameParts.length >= 2) {
        return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
      } else {
        return nameParts[0].charAt(0).toUpperCase();
      }
    } else if (user?.email) {
      // Fallback para primeira letra do email
      return user.email.charAt(0).toUpperCase();
    }
    return 'U';
  };
  
  const initials = getInitials();

  const sidebarWidth = isMobile ? "w-[250px]" : "w-64";

  return (
    <aside className={cn(`flex flex-col h-full bg-white border-r border-gray-200 text-gray-800 ${sidebarWidth} py-4`, className)}>
      <div className="px-4 mb-6 flex-shrink-0">
        <Logo />
      </div>
      
      <div className="flex items-center px-4 pb-4 mb-4 border-b border-gray-100 flex-shrink-0">
        <Avatar className="h-9 w-9 mr-3 border border-gray-200">
          <AvatarImage src={userProfile.avatar_url || undefined} alt={displayName} />
          <AvatarFallback className="bg-arca-blue text-white text-sm">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate" title={displayName}>{displayName}</p>
          <div className="flex items-center gap-2">
          <p className="text-xs text-gray-500 truncate" title={user?.email || ''}>{user?.email}</p>
            {!isLoading && !isAdminArea && (
              <Badge 
                variant={isPro ? "default" : "secondary"} 
                className={`text-xs px-2 py-0 ${isPro ? 'bg-arca-main text-white' : 'bg-gray-200 text-gray-600'}`}
              >
                {isPro ? 'PRO' : 'FREE'}
              </Badge>
            )}
            {isAdmin && (
              <Badge className="text-xs px-2 py-0 bg-red-600 text-white">
                {isAdminArea ? 'ADMIN AREA' : 'ADMIN'}
              </Badge>
            )}
          </div>
        </div>
      </div>

      <nav className="flex-1 px-2 space-y-1 overflow-y-auto min-h-0 sidebar-scrollbar">
        {navItems.map((item) => {
          const isActive = item.path === '/dashboard' 
            ? location.pathname === '/' || location.pathname === '/dashboard'
            : location.pathname.startsWith(item.path);
                 
          return (
            <Link
              key={item.id}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md transition-colors relative text-sm",
                isActive
                  ? "bg-gradient-to-r from-blue-50 to-purple-50 text-arca-blue font-medium"
                  : item.isUpgrade
                  ? "text-blue-600 hover:bg-blue-50 hover:text-blue-700 font-medium"
                  : item.isAdmin
                  ? "text-red-600 hover:bg-red-50 hover:text-red-700 font-medium"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              )}
            >
              <item.icon size={18} className="opacity-80 flex-shrink-0" />
              <span className="flex-1 truncate">{item.label}</span>
              {item.isNew && (
                <span className="ml-auto px-1.5 py-0.5 text-xs font-medium bg-arca-blue text-white rounded flex-shrink-0">
                  NOVO
                </span>
              )}
              {item.isUpgrade && (
                <span className="ml-auto px-1.5 py-0.5 text-xs font-medium bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded flex-shrink-0">
                  UPGRADE
                </span>
              )}
              {item.isAdmin && (
                <span className="ml-auto px-1.5 py-0.5 text-xs font-medium bg-red-600 text-white rounded flex-shrink-0">
                  ADMIN
                </span>
              )}
            </Link>
          );
        })}
      </nav>
      
      <div className="px-3 pt-3 border-t border-gray-100 flex-shrink-0">
        {/* Mostrar progresso de uso apenas para usuários gratuitos e não em área admin */}
        {isFree && !isAdminArea && (
        <div className="mb-3">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Análises restantes</span>
            <span>{remaining}/{totalLimit}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div className="bg-arca-blue h-1.5 rounded-full" style={{ width: `${100 - percentage}%` }}></div>
          </div>
            <Link 
              to="/plans" 
              className="w-full mt-2 shadow-[0_4px_14px_0_rgb(0,118,255,39%)] hover:shadow-[0_6px_20px_rgba(0,118,255,23%)] hover:bg-[rgba(0,118,255,0.9)] px-8 py-2 bg-[#0070f3] rounded-md text-white font-light transition duration-200 ease-linear block text-center text-xs"
            >
              Fazer Upgrade para Pro
            </Link>
          </div>
        )}

        {/* Mostrar status pro para usuários pagos e não em área admin */}
        {(isPro || isUnlimited) && !isAdminArea && (
          <div className="mb-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <Crown className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-700">
                {isPro ? 'Plano Pro Ativo' : 'Acesso Ilimitado'}
              </span>
            </div>
            <p className="text-xs text-green-600">
              {isUnlimited ? 'Análises ilimitadas' : `${remaining} análises restantes este mês`}
            </p>
        </div>
        )}

        <button 
          className="w-full justify-start shadow-[0_4px_14px_0_rgb(0,118,255,39%)] hover:shadow-[0_6px_20px_rgba(0,118,255,23%)] hover:bg-[rgba(0,118,255,0.9)] px-8 py-2 bg-[#0070f3] rounded-md text-white font-light transition duration-200 ease-linear flex items-center" 
          onClick={handleLogout}
        >
          <LogOut size={16} className="mr-2" />
          Sair
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
