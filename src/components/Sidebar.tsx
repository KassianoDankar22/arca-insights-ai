
import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import { Home, BarChart2, TrendingUp, Calendar, Settings, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const navItems = [
    { icon: Home, label: 'Início', path: '/' },
    { icon: BarChart2, label: 'ROI Curto Prazo', path: '/roi-curto-prazo' },
    { icon: TrendingUp, label: 'ROI Longo Prazo', path: '/roi-longo-prazo' },
    { icon: Calendar, label: 'Tendências', path: '/tendencias' },
    { icon: Settings, label: 'Configurações', path: '/configuracoes' },
  ];

  return (
    <div className={cn("flex flex-col h-full bg-white border-r border-gray-200 w-64 py-6 px-3", className)}>
      <div className="px-3 mb-8">
        <Logo />
      </div>

      <div className="flex-1">
        <nav className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-600 hover:bg-arca-soft-purple hover:text-arca-purple transition-colors"
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      <div className="mt-auto px-3">
        <button className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-600 hover:bg-red-50 hover:text-red-500 w-full transition-colors">
          <LogOut size={20} />
          <span>Sair</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
