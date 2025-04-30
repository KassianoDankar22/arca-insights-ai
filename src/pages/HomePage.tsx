
import React from 'react';
import { BarChart2, TrendingUp, Calendar, Settings, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BackgroundBeams } from '@/components/ui/background-beams';
import WelcomeSection from '@/components/dashboard/WelcomeSection';
import ActionCard from '@/components/dashboard/ActionCard';
import RecentActivities from '@/components/dashboard/RecentActivities';

const HomePage = () => {
  const navigate = useNavigate();
  
  const actionCards = [
    {
      title: 'ROI Curto Prazo',
      description: 'Análise de retorno sobre investimento em curto prazo',
      icon: BarChart2,
      onClick: () => navigate('/roi-curto-prazo')
    },
    {
      title: 'ROI Longo Prazo',
      description: 'Análise de retorno sobre investimento em longo prazo',
      icon: TrendingUp,
      onClick: () => navigate('/roi-longo-prazo')
    },
    {
      title: 'Tendências',
      description: 'Visualize as últimas tendências de mercado',
      icon: Calendar,
      onClick: () => navigate('/tendencias')
    },
    {
      title: 'Configurações',
      description: 'Ajuste as configurações da sua conta',
      icon: Settings,
      onClick: () => navigate('/configuracoes')
    }
  ];

  return (
    <div className="relative min-h-screen w-full bg-black overflow-hidden">
      <BackgroundBeams className="opacity-40" />
      
      <div className="relative z-10 p-6 md:p-8 max-w-7xl mx-auto">
        <WelcomeSection userName="Amanda" />
        
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-5 h-5 text-white/50" />
              </div>
              <input 
                type="search" 
                className="bg-white/5 border border-white/10 text-white text-sm rounded-lg block w-full pl-10 p-2.5 mb-6 focus:border-arca-blue focus:ring-arca-blue" 
                placeholder="Buscar análises, relatórios..."
              />
            </div>
            
            <h2 className="text-xl font-semibold mb-4 text-white">Ações Rápidas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {actionCards.map((card, index) => (
                <ActionCard 
                  key={index}
                  title={card.title}
                  description={card.description}
                  icon={card.icon}
                  onClick={card.onClick}
                />
              ))}
            </div>
          </div>
          
          <div className="md:w-80 lg:w-96">
            <RecentActivities />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
