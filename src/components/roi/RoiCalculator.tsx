
import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { Calculator } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

import PropertyInfoForm, { FormValues } from './PropertyInfoForm';
import CalculationResult from './CalculationResult';

const RoiCalculator: React.FC = () => {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [calculationResult, setCalculationResult] = useState<any>(null);
  const reportRef = useRef<HTMLDivElement>(null);
  
  const form = useForm<FormValues>({
    defaultValues: {
      investmentType: '',
      projectName: '',
      location: '',
      modelType: '',
      bedrooms: '',
      hasPool: 'Não',
      purchasePrice: '',
      aluguelMensal: '',
      despesasMensais: '',
      logoImage: null,
    }
  });

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      form.setValue('logoImage', file);
    }
  };

  const handleRemoveLogo = () => {
    setLogoPreview(null);
    form.setValue('logoImage', null);
  };

  const calculateRoi = (data: FormValues) => {
    const compra = parseFloat(data.purchasePrice);
    const aluguel = parseFloat(data.aluguelMensal);
    const despesas = parseFloat(data.despesasMensais);
    
    if (isNaN(compra) || isNaN(aluguel) || isNaN(despesas)) {
      return;
    }
    
    const receitaAnual = aluguel * 12;
    const despesaAnual = despesas * 12;
    const lucroAnual = receitaAnual - despesaAnual;
    const roiAnual = (lucroAnual / compra) * 100;
    const retornoEmAnos = compra / lucroAnual;
    
    setCalculationResult({
      roiAnual: roiAnual.toFixed(2),
      retornoEmAnos: retornoEmAnos.toFixed(1),
      receitaAnual,
      despesaAnual,
      lucroAnual,
      pieData: [
        { name: 'Despesas', value: despesaAnual },
        { name: 'Lucro', value: lucroAnual }
      ],
      formData: { ...data }
    });
  };

  const handleCalculate = form.handleSubmit(calculateRoi);

  const exportToPdf = async () => {
    if (reportRef.current && calculationResult) {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        logging: false
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgWidth = 210;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`ROI_Analise_${calculationResult.formData.projectName || 'Propriedade'}.pdf`);
    }
  };

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 flex items-center justify-center text-center">
        <Calculator className="mr-2" />
        Calculadora de ROI
      </h2>
      
      <Form {...form}>
        <form onSubmit={handleCalculate} className="space-y-6">
          <Card className="overflow-hidden border-0 shadow-lg">
            <div className="bg-gradient-to-r from-arca-dark-blue to-arca-light-blue h-2" />
            <CardHeader>
              <CardTitle className="text-xl text-arca-dark-blue">Informações do Imóvel</CardTitle>
            </CardHeader>
            <CardContent>
              <PropertyInfoForm 
                form={form} 
                logoPreview={logoPreview} 
                handleLogoChange={handleLogoChange} 
                handleRemoveLogo={handleRemoveLogo}
                onSubmit={handleCalculate}
              />
            </CardContent>
          </Card>
        </form>
      </Form>
      
      {calculationResult && (
        <CalculationResult 
          calculationResult={calculationResult} 
          logoPreview={logoPreview}
          exportToPdf={exportToPdf}
          reportRef={reportRef}
        />
      )}
      
      {calculationResult && (
        <Dialog>
          <DialogTrigger className="hidden">Open Dialog</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>PDF Exportado com Sucesso</DialogTitle>
            </DialogHeader>
            <p className="py-4">
              O relatório de ROI para {calculationResult.formData.projectName || 'sua propriedade'} foi exportado com sucesso e está pronto para compartilhamento.
            </p>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default RoiCalculator;
