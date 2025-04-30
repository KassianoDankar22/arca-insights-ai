
import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Button } from './ui/button';
import { MessageSquare } from 'lucide-react';

const MainLayout = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto relative">
        <div className="absolute top-4 right-4 z-10">
          <Button 
            onClick={() => navigate('/chat')} 
            className="bg-arca-blue hover:bg-arca-blue/80"
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            Abrir Chat
          </Button>
        </div>
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
