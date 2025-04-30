
import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { ButtonColorful } from './ui/button-colorful';
import { MessageSquare } from 'lucide-react';

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Only show the chat button if we're not already on the chat page
  const showChatButton = location.pathname !== '/chat';
  
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        {showChatButton && (
          <div className="absolute top-4 right-4 z-10">
            <ButtonColorful 
              onClick={() => navigate('/chat')} 
              label="Abrir Chat"
            />
          </div>
        )}
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
