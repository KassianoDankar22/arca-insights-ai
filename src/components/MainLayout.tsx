
import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { HoverButton } from './ui/hover-button';
import { MessageSquare, Menu, X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from './ui/button';

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Only show the chat button if we're not already on the chat page, tools page, or roi calculator pages
  const showChatButton = location.pathname !== '/chat' && 
                          location.pathname !== '/ferramentas' &&
                          location.pathname !== '/roi-curto-prazo' &&
                          location.pathname !== '/roi-longo-prazo';
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-50 relative">
      {isMobile && (
        <Button 
          variant="ghost" 
          size="icon" 
          className="fixed top-4 left-4 z-50" 
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

      <main className={`flex-1 overflow-auto ${isMobile ? 'pt-14' : ''}`}>
        {showChatButton && (
          <div className={`${isMobile ? 'fixed bottom-8 right-8' : 'fixed top-8 right-12'} z-10`}>
            <HoverButton 
              onClick={() => navigate('/chat')}
              className="flex items-center gap-2"
            >
              {!isMobile && <span>Abrir Chat</span>}
              <MessageSquare size={isMobile ? 20 : 16} />
            </HoverButton>
          </div>
        )}
        {isMobile && sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30"
            onClick={toggleSidebar}
          />
        )}
        <div className={isMobile ? 'px-4' : ''}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
