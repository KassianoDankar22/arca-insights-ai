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
import Sidebar from '../Sidebar';
import { HoverButton } from '../ui/hover-button';
import { MessageSquare, Menu, X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '../ui/button';
import { useAuth } from '@/lib/auth';
import { useNavigate, useLocation } from 'react-router-dom';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();
  
  // Only show the chat button if we're not already on the chat page, tools page, or roi calculator pages
  const showChatButton = location.pathname !== '/chat' && 
                          location.pathname !== '/ferramentas' &&
                          location.pathname !== '/roi-curto-prazo' &&
                          location.pathname !== '/roi-longo-prazo';
  
  // Close sidebar when changing routes on mobile
  useEffect(() => {
    if (isMobile && sidebarOpen) {
      setSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-[100dvh] bg-gray-50 relative overflow-hidden">
      {user && (
        <>
          {isMobile && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="fixed top-4 left-4 z-50 bg-white bg-opacity-80 shadow-sm" 
              onClick={toggleSidebar}
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          )}

          <div className={`${isMobile ? 'fixed inset-y-0 left-0 z-40 transition-transform duration-300 transform' : ''} ${
            isMobile && !sidebarOpen ? '-translate-x-full' : ''
          }`}>
            <Sidebar />
          </div>
        </>
      )}

      <main className={`flex-1 overflow-auto ${isMobile ? 'pt-16 pb-20' : ''}`}>
        {user && showChatButton && (
          <div className={`${isMobile ? 'fixed bottom-8 right-8 z-30' : 'fixed bottom-8 right-12'} z-10`}>
            <HoverButton 
              onClick={() => navigate('/chat')}
              className="flex items-center gap-2 shadow-md"
            >
              {!isMobile && <span>Abrir Chat</span>}
              <MessageSquare size={isMobile ? 20 : 16} />
            </HoverButton>
          </div>
        )}
        {user && isMobile && sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30"
            onClick={toggleSidebar}
            aria-hidden="true"
          />
        )}
        <div className="h-full">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout; 