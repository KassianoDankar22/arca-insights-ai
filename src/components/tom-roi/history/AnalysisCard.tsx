
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Trash2 } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export interface AnalysisCardProps {
  analysis: {
    id: string;
    condominio: string;
    localizacao: string;
    criado_em: string;
    expira_em: string;
  };
  onView: (id: string) => void;
  onDelete: (id: string) => void;
}

const AnalysisCard: React.FC<AnalysisCardProps> = ({ analysis, onView, onDelete }) => {
  const isMobile = useIsMobile();
  
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), "dd/MM/yyyy", { locale: ptBR });
    } catch (e) {
      return "Data inválida";
    }
  };
  
  const getDaysUntilExpiration = (expiresAt: string) => {
    try {
      const expireDate = parseISO(expiresAt);
      const now = new Date();
      
      if (expireDate <= now) {
        return { expired: true, text: "Expirado" };
      }
      
      const distanceText = formatDistanceToNow(expireDate, { locale: ptBR, addSuffix: false });
      return { expired: false, text: `Expira em ${distanceText}` };
    } catch (e) {
      return { expired: true, text: "Data inválida" };
    }
  };

  const expiration = getDaysUntilExpiration(analysis.expira_em);

  return (
    <Card 
      key={analysis.id} 
      className="bg-white/70 backdrop-blur-lg border border-white/20 shadow-sm hover:shadow-md transition-shadow"
    >
      <CardContent className={`${isMobile ? 'p-4' : 'p-6'} flex ${isMobile ? 'flex-col space-y-4' : 'flex-row items-center justify-between'}`}>
        <div>
          <h3 className="font-semibold text-lg">{analysis.condominio}</h3>
          <div className="text-sm text-gray-500">
            <p>{analysis.localizacao}</p>
            <p>Data: {formatDate(analysis.criado_em)}</p>
          </div>
          <span className={`text-xs font-medium px-2 py-1 rounded-full inline-block mt-2 ${
            expiration.expired ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'
          }`}>
            {expiration.text}
          </span>
        </div>
        
        <div className={`flex gap-2 ${isMobile ? 'w-full justify-between' : ''}`}>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1"
            onClick={() => onView(analysis.id)}
          >
            <Eye size={16} />
            Visualizar
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1 text-red-500 hover:text-red-600 hover:border-red-200"
            onClick={() => onDelete(analysis.id)}
          >
            <Trash2 size={16} />
            Excluir
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalysisCard;
