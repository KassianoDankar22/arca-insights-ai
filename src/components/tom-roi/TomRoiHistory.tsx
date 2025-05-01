
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Trash2 } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface RoiHistoryItem {
  id: string;
  projectName: string;
  location: string;
  date: Date;
  expiresIn: number;
}

const TomRoiHistory: React.FC = () => {
  const isMobile = useIsMobile();
  
  // Mock data for demonstration
  const mockHistoryItems: RoiHistoryItem[] = [
    {
      id: '1',
      projectName: 'Condomínio Beira Mar',
      location: 'Florianópolis, SC',
      date: new Date(2023, 5, 15),
      expiresIn: 5
    },
    {
      id: '2',
      projectName: 'Residencial Solar das Palmeiras',
      location: 'Balneário Camboriú, SC',
      date: new Date(2023, 5, 12),
      expiresIn: 2
    },
    {
      id: '3',
      projectName: 'Villa das Araucárias',
      location: 'Gramado, RS',
      date: new Date(2023, 5, 10),
      expiresIn: 1
    }
  ];

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h2 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-semibold text-gray-800 mb-3`}>
          Meus ROI's
        </h2>
        <p className="text-gray-600">
          Histórico das suas análises de ROI dos últimos 7 dias
        </p>
      </div>

      <div className="space-y-4">
        {mockHistoryItems.map((item) => (
          <Card key={item.id} className="bg-white/70 backdrop-blur-lg border border-white/20 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className={`${isMobile ? 'p-4' : 'p-6'} flex ${isMobile ? 'flex-col space-y-4' : 'flex-row items-center justify-between'}`}>
              <div>
                <h3 className="font-semibold text-lg">{item.projectName}</h3>
                <div className="text-sm text-gray-500">
                  <p>{item.location}</p>
                  <p>Data: {formatDate(item.date)}</p>
                </div>
                <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-full inline-block mt-2">
                  Expira em {item.expiresIn} {item.expiresIn === 1 ? 'dia' : 'dias'}
                </span>
              </div>
              
              <div className={`flex gap-2 ${isMobile ? 'w-full justify-between' : ''}`}>
                <Button variant="outline" size="sm" className="gap-1">
                  <FileText size={16} />
                  Visualizar
                </Button>
                <Button variant="outline" size="sm" className="gap-1 text-red-500 hover:text-red-600 hover:border-red-200">
                  <Trash2 size={16} />
                  Excluir
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TomRoiHistory;
