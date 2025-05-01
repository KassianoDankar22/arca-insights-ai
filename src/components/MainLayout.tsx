
import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { HoverButton } from './ui/hover-button';
import { MessageSquare } from 'lucide-react';

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Only show the chat button if we're not already on the chat page, tools page, or roi calculator pages
  const showChatButton = location.pathname !== '/chat' && 
                          location.pathname !== '/ferramentas' &&
                          location.pathname !== '/roi-curto-prazo' &&
                          location.pathname !== '/roi-longo-prazo';
  
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        {showChatButton && (
          <div className="fixed top-8 right-12 z-10">
            <HoverButton 
              onClick={() => navigate('/chat')}
              className="flex items-center gap-2"
            >
              <span>Abrir Chat</span>
              <MessageSquare size={16} />
            </HoverButton>
          </div>
        )}
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
