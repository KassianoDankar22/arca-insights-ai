
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Trash2, Eye, ArrowLeft } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface RoiAnalise {
  id: string;
  condominio: string;
  localizacao: string;
  criado_em: string;
  expira_em: string;
}

const TomROIHistory: React.FC = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [analyses, setAnalyses] = useState<RoiAnalise[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  useEffect(() => {
    fetchAnalyses();
  }, []);

  const fetchAnalyses = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('roi_analises')
        .select('*')
        .order('criado_em', { ascending: false });

      if (error) {
        throw error;
      }

      setAnalyses(data || []);
    } catch (error) {
      console.error('Error fetching ROI analyses:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar as análises de ROI.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeleteId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;

    try {
      const { error } = await supabase
        .from('roi_analises')
        .delete()
        .eq('id', deleteId);

      if (error) {
        throw error;
      }

      setAnalyses(analyses.filter(analysis => analysis.id !== deleteId));
      toast({
        title: 'Análise excluída',
        description: 'A análise de ROI foi excluída com sucesso.',
      });
    } catch (error) {
      console.error('Error deleting ROI analysis:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir a análise de ROI.',
        variant: 'destructive',
      });
    } finally {
      setDeleteDialogOpen(false);
      setDeleteId(null);
    }
  };

  const handleView = (id: string) => {
    navigate(`/analise/tom/${id}`);
  };

  const handleBack = () => {
    navigate('/analise/tom');
  };
  
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

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
        <div>
          <Button
            variant="outline"
            className="mb-4 gap-2"
            onClick={handleBack}
          >
            <ArrowLeft size={16} />
            Voltar para Análise
          </Button>
          <h2 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-semibold text-gray-800`}>
            Meus ROI's
          </h2>
          <p className="text-gray-600">
            Histórico das suas análises de ROI dos últimos 7 dias
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin w-8 h-8 border-4 border-arca-blue border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>Carregando análises...</p>
          </div>
        ) : analyses.length === 0 ? (
          <Card className="bg-white/70 backdrop-blur-lg">
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-medium mb-2">Nenhuma análise encontrada</h3>
              <p className="text-gray-600 mb-4">
                Você ainda não criou nenhuma análise de ROI ou todas expiraram.
              </p>
              <Button onClick={handleBack}>
                Criar Nova Análise
              </Button>
            </CardContent>
          </Card>
        ) : (
          analyses.map((analysis) => {
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
                      onClick={() => handleView(analysis.id)}
                    >
                      <Eye size={16} />
                      Visualizar
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-1 text-red-500 hover:text-red-600 hover:border-red-200"
                      onClick={() => handleDelete(analysis.id)}
                    >
                      <Trash2 size={16} />
                      Excluir
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Análise de ROI</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta análise? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-500 hover:bg-red-600 text-white">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TomROIHistory;
