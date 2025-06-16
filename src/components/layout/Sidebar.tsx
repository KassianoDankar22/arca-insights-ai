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

'use client';

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, Users, BarChart2, DollarSign, Settings, 
  LifeBuoy, Briefcase, Columns, MessageSquare, 
  Calculator, ListChecksIcon, Wrench, Zap // Alterado Tool para Wrench
} from 'lucide-react';

// Defina aqui os itens da sua sidebar
const navItems = [
  { href: '/dashboard', label: 'Painel Geral', icon: Home }, // Link para um dashboard geral da aplicação, se houver
  { href: '/crm', label: 'CRM', icon: Briefcase, subItems: [
    { href: '/crm/dashboard', label: 'Visão Geral CRM', icon: Home },
    { href: '/crm/leads', label: 'Leads', icon: Users },
    { href: '/crm/funil', label: 'Funil de Vendas', icon: Columns },
    { href: '/crm/agenda', label: 'Agenda/Tarefas', icon: ListChecksIcon }, 
  ]},
  { href: '/calculator', label: 'Calculadora ROI', icon: Calculator },
  { href: '/meus-rois', label: 'Meus ROIs', icon: BarChart2 }, // Reutilizando BarChart2 ou pode ser outro
  { href: '/ferramentas', label: 'Ferramentas IA', icon: Zap }, // Usando Zap para Ferramentas IA
  { href: '/chat', label: 'Chat IA', icon: MessageSquare },
  { href: '/financeiro', label: 'Financeiro', icon: DollarSign },
  { href: '/configuracoes', label: 'Configurações', icon: Settings },
  { href: '/pricing', label: 'Planos', icon: Wrench }, // Alterado Tool para Wrench
  { href: '/suporte', label: 'Suporte', icon: LifeBuoy },
];

const Sidebar = () => {
  const location = useLocation();

  const isActive = (href: string) => location.pathname.startsWith(href);

  return (
    <aside className="w-64 bg-arca-dark text-white h-screen p-4 flex flex-col fixed top-0 left-0">
      <div className="text-2xl font-bold text-arca-light mb-10">
        ARCA Insights
      </div>
      <nav className="flex-grow">
        <ul>
          {navItems.map((item) => (
            <li key={item.href} className="mb-2">
              <Link
                to={item.href}
                className={`flex items-center p-2 rounded-md hover:bg-arca-main transition-colors ${
                  isActive(item.href) && !item.subItems ? 'bg-arca-main' : ''
                }`}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.label}
              </Link>
              {item.subItems && isActive(item.href) && (
                <ul className="ml-4 mt-1">
                  {item.subItems.map((subItem) => (
                    <li key={subItem.href} className="mb-1">
                      <Link
                        to={subItem.href}
                        className={`flex items-center p-2 rounded-md hover:bg-arca-blue text-sm transition-colors ${
                          isActive(subItem.href) ? 'bg-arca-blue font-semibold' : 'text-gray-300 hover:text-white'
                        }`}
                      >
                        <subItem.icon className="mr-3 h-4 w-4" />
                        {subItem.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-auto">
        {/* Poderia adicionar informações do usuário ou um link de logout aqui */}
        <p className="text-xs text-arca-cool-gray text-center">© ARCA Insights</p>
      </div>
    </aside>
  );
};

export default Sidebar; 