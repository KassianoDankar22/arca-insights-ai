
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { toast } from '@/hooks/use-toast';

export const exportToPDF = async (elementRef: React.RefObject<HTMLDivElement>, fileName: string) => {
  if (!elementRef.current) return;
  
  try {
    const canvas = await html2canvas(elementRef.current, {
      scale: 2,
      logging: false,
      useCORS: true,
      backgroundColor: '#ffffff',
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });
    
    const imgWidth = 210;
    const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    
    pdf.save(fileName);
    
    toast({
      title: 'PDF exportado',
      description: 'Sua análise foi exportada com sucesso.',
    });
  } catch (error) {
    console.error('Error exporting to PDF:', error);
    toast({
      title: 'Erro ao exportar',
      description: 'Não foi possível exportar a análise para PDF.',
      variant: 'destructive',
    });
  }
};

export const exportToJPEG = async (elementRef: React.RefObject<HTMLDivElement>, fileName: string) => {
  if (!elementRef.current) return;
  
  try {
    const canvas = await html2canvas(elementRef.current, {
      scale: 2,
      logging: false,
      useCORS: true,
      backgroundColor: '#ffffff',
    });
    
    const link = document.createElement('a');
    link.download = fileName;
    link.href = canvas.toDataURL('image/jpeg', 0.9);
    link.click();
    
    toast({
      title: 'Imagem exportada',
      description: 'Sua análise foi exportada como imagem com sucesso.',
    });
  } catch (error) {
    console.error('Error exporting to JPEG:', error);
    toast({
      title: 'Erro ao exportar',
      description: 'Não foi possível exportar a análise como imagem.',
      variant: 'destructive',
    });
  }
};
