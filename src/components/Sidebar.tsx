
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Logo from './Logo';
import { Home, Settings, LogOut, MessageSquare, BookOpen, Wrench, GraduationCap, DollarSign, BarChart2, History } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useIsMobile } from '@/hooks/use-mobile';

interface SidebarProps {
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Wrench, label: 'Ferramentas', path: '/ferramentas' },
    { icon: MessageSquare, label: 'Arca AI Chat', path: '/chat', isNew: true },
    { icon: BarChart2, label: 'Tom - Análise de ROI', path: '/analise/tom', isNew: true },
    { icon: History, label: 'Meus ROIs', path: '/meus-rois' },
    { icon: GraduationCap, label: 'Academy', path: '/academy' },
    { icon: DollarSign, label: 'Financeiro', path: '/financeiro' },
    { icon: Settings, label: 'Integrações', path: '/integracoes' },
  ];

  const handleLogout = () => {
    // In a real application with Supabase, you would call supabase.auth.signOut() here
    // For this application, we'll just redirect to the login page
    navigate('/');
    // Setting isAuthenticated to false in App component
    window.location.reload();
  };

  const sidebarWidth = isMobile ? "w-[250px]" : "w-64";

  return (
    <div className={cn(`flex flex-col h-full bg-white border-r border-gray-200 ${sidebarWidth} py-6 px-3`, className)}>
      <div className="px-3 mb-8">
        <Logo />
      </div>
      
      <div className="flex items-center p-4 border-b border-gray-200 mb-4">
        <Avatar className="h-10 w-10 mr-3">
          <AvatarImage src="/lovable-uploads/695ed016-2dd6-49b3-97f0-bdbdabc3e04d.png" alt="Juliana Lengler" />
          <AvatarFallback>JL</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-medium text-gray-900">Juliana Lengler</p>
          <p className="text-xs text-gray-500">Conta Gratuita</p>
        </div>
      </div>

      <div className="flex-1">
        <nav className="space-y-1">
          {navItems.map((item) => {
            // Check if this is the active path
            const isActive = item.path === '/' 
              ? location.pathname === '/' 
              : location.pathname.startsWith(item.path);
                
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md transition-colors relative",
                  isActive
                    ? "bg-blue-50 text-arca-blue" 
                    : "text-gray-600 hover:bg-gray-50"
                )}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
                {item.isNew && (
                  <span className="absolute right-2 px-1.5 py-0.5 text-xs font-medium bg-arca-blue text-white rounded">
                    NOVO
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
      
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-600">Análises restantes</span>
          <span className="text-sm font-medium">15/20</span>
        </div>
        <div className="w-full h-2 mb-4 bg-gray-200 rounded-full">
          <div className="h-2 rounded-full bg-arca-blue" style={{ width: '75%' }}></div>
        </div>
        
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
              <BookOpen size={18} className="mr-3" />
              <span>Ajuda & Suporte</span>
            </Link>
          </li>
        </ul>
      </div>

      <div className="mt-auto px-3">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-600 hover:bg-red-50 hover:text-red-500 w-full transition-colors"
        >
          <LogOut size={20} />
          <span>Sair</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
