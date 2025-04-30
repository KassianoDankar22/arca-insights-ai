import React from 'react';
import { 
  BarChart2, 
  TrendingUp, 
  CircleDollarSign, 
  Clock, 
  HomeIcon, 
  Building, 
  Home
} from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";

const MetricCard = ({ 
  icon: Icon, 
  title, 
  value, 
  change, 
  isPositive = true 
}: { 
  icon: React.ElementType; 
  title: string; 
  value: string; 
  change: string; 
  isPositive?: boolean;
}) => {
  return (
    <Card className="bg-white border border-gray-200">
      <CardContent className="p-6">
        <div className="flex items-center mb-2">
          <Icon className="text-arca-blue mr-2" size={20} />
          <p className="text-gray-600 text-sm">{title}</p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-2xl font-bold">{value}</p>
          <span className={`text-xs font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {isPositive ? '↑' : '↓'} {change}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

const MarketInsightCard = ({
  icon: Icon,
  title,
  children,
  iconBgColor = "bg-blue-100"
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
  iconBgColor?: string;
}) => {
  return (
    <div className="flex gap-4 mb-6">
      <div className={`${iconBgColor} p-3 rounded-md h-fit`}>
        <Icon className="text-arca-blue" size={24} />
      </div>
      <div>
        <h3 className="text-lg font-medium text-gray-800 mb-1">{title}</h3>
        {children}
      </div>
    </div>
  );
};

const InvestorTipCard = ({ number, title, description }: { number: number; title: string; description: string }) => {
  return (
    <div className="flex gap-4 mb-6">
      <div className="bg-blue-100 text-arca-blue rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
        {number}
      </div>
      <div>
        <h3 className="font-medium text-gray-800 mb-1">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
};

const PropertyCard = ({ 
  imageUrl, 
  title, 
  location, 
  price, 
  bedrooms, 
  bathrooms, 
  area 
}: { 
  imageUrl: string; 
  title: string; 
  location: string; 
  price: string; 
  bedrooms: number; 
  bathrooms: number; 
  area: number;
}) => {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
      <div className="h-48 overflow-hidden">
        <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1">{title}</h3>
        <div className="flex items-center text-gray-500 text-sm mb-3">
          <span>{location}</span>
        </div>
        <p className="text-lg font-bold text-arca-blue mb-3">{price}</p>
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <span>{bedrooms} quartos</span>
          </div>
          <div className="flex items-center gap-1">
            <span>{bathrooms} {bathrooms === 1 ? 'banheiro' : 'banheiros'}</span>
          </div>
          <div className="flex items-center gap-1">
            <span>{area} m²</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const HomePage = () => {
  // Update user information
  const userName = "Juliana Lengler"; 
  const userGender = "female";

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">
          {/* Dynamic greeting based on time of day */}
          {(() => {
            const hour = new Date().getHours();
            if (hour < 12) return 'Bom dia';
            else if (hour < 18) return 'Boa tarde';
            else return 'Boa noite';
          })()}, {userName}
        </h1>
        <p className="text-gray-600">
          {/* Gender-specific welcome message */}
          {userGender === 'female' ? 'Bem-vinda' : 'Bem-vindo'} à ARCA sua plataforma inteligente de análise imobiliária.
        </p>
      </div>
      
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard 
          icon={BarChart2} 
          title="ROI Médio" 
          value="8.6%" 
          change="1.2%"
          isPositive={true}
        />
        <MetricCard 
          icon={TrendingUp} 
          title="Valorização Anual" 
          value="5.3%" 
          change="0.8%"
          isPositive={true}
        />
        <MetricCard 
          icon={CircleDollarSign} 
          title="Preço Médio" 
          value="$457,500" 
          change="2.5%"
          isPositive={true}
        />
        <MetricCard 
          icon={Clock} 
          title="Dias no Mercado" 
          value="28" 
          change="3%"
          isPositive={false}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Market Overview */}
        <div className="lg:col-span-2">
          <Card className="bg-white border border-gray-200">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-1">Visão Geral do Mercado</h2>
              <h3 className="text-lg font-medium mb-3">Tendências Imobiliárias - Maio 2025</h3>
              <p className="text-gray-700 mb-6">
                O mercado imobiliário da Flórida continua resiliente com crescimento consistente. 
                Confira os principais insights:
              </p>
              
              <MarketInsightCard 
                icon={TrendingUp} 
                title="Orlando: Crescimento Sustentável"
                iconBgColor="bg-blue-100"
              >
                <p className="text-sm text-gray-600">
                  Valorização média de 4.2% nos últimos 6 meses, com Lake Nona e Winter Garden liderando. 
                  Imóveis para temporada apresentam ocupação média de 80%.
                </p>
              </MarketInsightCard>
              
              <MarketInsightCard 
                icon={Building} 
                title="Miami: Mercado Premium"
                iconBgColor="bg-green-100"
              >
                <p className="text-sm text-gray-600">
                  Valorização de 5.8% no último semestre. Brickell e Miami Beach continuam atraindo compradores 
                  internacionais. Aumento de 15% nas transações de luxo.
                </p>
              </MarketInsightCard>
              
              <MarketInsightCard 
                icon={HomeIcon} 
                title="Tipo de Imóvel Mais Rentável"
                iconBgColor="bg-purple-100"
              >
                <p className="text-sm text-gray-600">
                  Single Family Homes (3-4 quartos) em áreas suburbanas continuam oferecendo o melhor equilíbrio 
                  entre valorização e rendimento de aluguel. ROI médio de 8-9%.
                </p>
              </MarketInsightCard>
            </CardContent>
          </Card>
        </div>
        
        {/* Investor Tips */}
        <div>
          <Card className="bg-white border border-gray-200 h-full">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Dicas para Investidores</h2>
              
              <InvestorTipCard 
                number={1}
                title="Foco em áreas em expansão"
                description="Lake Nona (Orlando) e Doral (Miami) são áreas em rápido desenvolvimento com excelente potencial de valorização."
              />
              
              <InvestorTipCard 
                number={2}
                title="Timing da compra"
                description="O início do ano (Jan-Mar) geralmente oferece os melhores preços devido à sazonalidade do mercado da Flórida."
              />
              
              <InvestorTipCard 
                number={3}
                title="Diversificação"
                description="Para investidores com capital maior, diversificar entre imóvel para moradia permanente e aluguel temporário maximiza o potencial de retorno."
              />
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Featured Properties */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-6">Imóveis em Destaque</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <PropertyCard 
            imageUrl="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aG91c2V8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60" 
            title="Casa de Luxo em Winter Garden" 
            location="Winter Garden, Orlando" 
            price="R$ 650.000" 
            bedrooms={4} 
            bathrooms={3} 
            area={280}
          />
          
          <PropertyCard 
            imageUrl="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=60" 
            title="Townhouse em Lake Nona" 
            location="Lake Nona, Orlando" 
            price="R$ 425.000" 
            bedrooms={3} 
            bathrooms={2.5} 
            area={210}
          />
          
          <PropertyCard 
            imageUrl="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2970&q=80" 
            title="Apartamento em Brickell" 
            location="Brickell, Miami" 
            price="R$ 780.000" 
            bedrooms={2} 
            bathrooms={2} 
            area={175}
          />
        </div>
      </div>
      
      <footer className="text-center text-gray-500 text-sm mt-12">
        © 2025 ARCA - Inteligência Imobiliária. Todos os direitos reservados.
      </footer>
    </div>
  );
};

export default HomePage;
