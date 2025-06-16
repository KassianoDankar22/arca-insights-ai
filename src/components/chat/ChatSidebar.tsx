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
import { Link } from 'react-router-dom';
import { Home, MessageSquare, FileText, Users, BookOpen, Settings, HelpCircle } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAnalysisLimits } from '@/hooks/useAnalysisLimits';
import { useUserPlan } from '@/hooks/useUserPlan';
import Logo from '../Logo';

const ChatSidebar = () => {
  const { remaining, totalLimit, percentage, isUnlimited } = useAnalysisLimits();
  const { isFree } = useUserPlan();

  const menuItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: FileText, label: 'Minhas Análises', path: '/analises' },
    { icon: MessageSquare, label: 'Arca AI Chat', path: '/chat', isActive: true, isNew: true },
    { icon: Users, label: 'Compartilhados comigo', path: '/compartilhados' },
    { icon: BookOpen, label: 'Minhas Notas', path: '/notas' },
    { icon: Settings, label: 'Integrações', path: '/integracoes' },
  ];

  return (
    <aside className="flex flex-col w-64 h-full bg-gray-50 border-r border-gray-200">
      <div className="flex items-center justify-center p-4 border-b border-gray-200">
        <Logo className="h-10" />
      </div>
      
      <div className="flex items-center p-4 border-b border-gray-200">
        <Avatar className="h-10 w-10 mr-3">
          <AvatarImage src="/placeholder.svg" alt="@usuário" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-medium text-gray-900">Amanda Silva</p>
          <p className="text-xs text-gray-500">
            {isFree ? 'Conta Gratuita' : isUnlimited ? 'Acesso Ilimitado' : 'Conta Pro'}
          </p>
        </div>
      </div>
      
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.label}>
              <Link
                to={item.path}
                className={`flex items-center px-3 py-2 rounded-md group ${
                  item.isActive 
                    ? 'bg-blue-50 text-arca-blue' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <item.icon size={18} className="mr-3" />
                <span>{item.label}</span>
                {item.isNew && (
                  <span className="ml-auto px-1.5 py-0.5 text-xs font-medium bg-arca-blue text-white rounded">
                    NOVO
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-gray-200">
        {!isUnlimited && (
          <>
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-600">Análises restantes</span>
              <span className="text-sm font-medium">{remaining}/{totalLimit}</span>
        </div>
        <div className="w-full h-2 mb-4 bg-gray-200 rounded-full">
              <div className="h-2 rounded-full bg-arca-blue" style={{ width: `${100 - percentage}%` }}></div>
        </div>
          </>
        )}
        
        <ul className="space-y-1">
          <li>
            <Link
              to="/configuracoes"
              className="flex items-center px-3 py-2 text-gray-700 rounded-md hover:bg-gray-100"
            >
              <Settings size={18} className="mr-3" />
              <span>Configurações</span>
            </Link>
          </li>
          <li>
            <Link
              to="/ajuda"
              className="flex items-center px-3 py-2 text-gray-700 rounded-md hover:bg-gray-100"
            >
              <HelpCircle size={18} className="mr-3" />
              <span>Ajuda & Suporte</span>
            </Link>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default ChatSidebar;
