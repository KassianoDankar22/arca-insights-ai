
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Calculator, Upload, FileUp, Download } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

type FormValues = {
  investmentType: string;
  projectName: string;
  location: string;
  modelType: string;
  bedrooms: string;
  hasPool: string;
  purchasePrice: string;
  aluguelMensal: string;
  despesasMensais: string;
  logoImage: File | null;
};

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

  const handleCalculate = form.handleSubmit((data) => {
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
  });

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
  
  const COLORS = ['#FF8042', '#00C49F'];

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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="flex flex-col justify-center items-center p-6 border-2 border-dashed rounded-lg bg-gray-50 hover:bg-gray-100 transition cursor-pointer relative">
                  {logoPreview ? (
                    <div className="mb-2 relative">
                      <img 
                        src={logoPreview} 
                        alt="Logo Preview" 
                        className="max-h-32 max-w-full object-contain" 
                      />
                      <Button 
                        type="button"
                        variant="destructive" 
                        size="sm"
                        className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full"
                        onClick={() => {
                          setLogoPreview(null);
                          form.setValue('logoImage', null);
                        }}
                      >
                        ×
                      </Button>
                    </div>
                  ) : (
                    <Upload className="h-12 w-12 text-gray-400 mb-2" />
                  )}
                  
                  <label className="flex flex-col items-center cursor-pointer">
                    <span className="font-medium text-gray-600">
                      {logoPreview ? 'Alterar logo' : 'Adicionar logo da imobiliária'}
                    </span>
                    <span className="text-xs text-gray-400 mt-1">PNG, JPG ou SVG (max. 2MB)</span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleLogoChange}
                    />
                  </label>
                </div>

                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="investmentType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de Investimento</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o tipo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="casa_ferias">Casa de Férias</SelectItem>
                            <SelectItem value="residencial">Residencial</SelectItem>
                            <SelectItem value="comercial">Comercial</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="projectName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome do Condomínio/Projeto</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Ex: Windsor at Westside" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Localização</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Ex: Kissimmee, Davenport" />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="modelType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Modelo da Casa</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Ex: Townhouse, Lakeshore" />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="bedrooms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número de Quartos</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                            <SelectItem key={num} value={num.toString()}>
                              {num}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="hasPool"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Piscina</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Possui piscina?" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Sim">Sim</SelectItem>
                          <SelectItem value="Não">Não</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="purchasePrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor de Compra (R$)</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="number" 
                          placeholder="Ex: 500000"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="aluguelMensal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Aluguel Mensal (R$)</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="number"
                          placeholder="Ex: 2500" 
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="despesasMensais"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Despesas Mensais (R$)</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="number"
                          placeholder="Ex: 500" 
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <Button 
                type="submit"
                className="w-full mt-6 bg-arca-purple hover:bg-arca-dark-purple"
              >
                Calcular ROI
              </Button>
            </CardContent>
          </Card>
        </form>
      </Form>
      
      {calculationResult && (
        <div ref={reportRef} className="mt-8 bg-white p-6 rounded-lg shadow-lg">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-2xl font-bold text-arca-dark-blue">Análise de ROI</h3>
              <p className="text-gray-600">
                {calculationResult.formData.projectName || 'Propriedade'} - {calculationResult.formData.location || 'Localização não especificada'}
              </p>
            </div>
            {logoPreview && (
              <img src={logoPreview} alt="Logo" className="h-16 object-contain" />
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Detalhes do Imóvel</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-2 gap-y-2 text-sm">
                  <div className="font-medium">Tipo:</div>
                  <div>{calculationResult.formData.investmentType === 'casa_ferias' ? 'Casa de Férias' : 
                         calculationResult.formData.investmentType === 'residencial' ? 'Residencial' : 
                         calculationResult.formData.investmentType === 'comercial' ? 'Comercial' : 
                         'Não especificado'}</div>
                  
                  <div className="font-medium">Modelo:</div>
                  <div>{calculationResult.formData.modelType || 'Não especificado'}</div>
                  
                  <div className="font-medium">Quartos:</div>
                  <div>{calculationResult.formData.bedrooms || 'Não especificado'}</div>
                  
                  <div className="font-medium">Piscina:</div>
                  <div>{calculationResult.formData.hasPool}</div>
                  
                  <div className="font-medium">Valor de Compra:</div>
                  <div>R$ {parseFloat(calculationResult.formData.purchasePrice).toLocaleString('pt-BR')}</div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Resultados Financeiros</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  <div className="bg-arca-soft-purple p-4 rounded-lg text-center">
                    <p className="text-sm text-gray-600">ROI Anual</p>
                    <p className="text-3xl font-bold text-arca-purple">{calculationResult.roiAnual}%</p>
                  </div>
                  <div className="bg-gray-100 p-4 rounded-lg text-center">
                    <p className="text-sm text-gray-600">Retorno do Investimento</p>
                    <p className="text-3xl font-bold text-gray-700">{calculationResult.retornoEmAnos} anos</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Detalhes Financeiros</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500">Receita Anual</p>
                    <p className="font-semibold">R$ {calculationResult.receitaAnual.toLocaleString('pt-BR')}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500">Despesas Anuais</p>
                    <p className="font-semibold">R$ {calculationResult.despesaAnual.toLocaleString('pt-BR')}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg col-span-2">
                    <p className="text-xs text-gray-500">Lucro Anual</p>
                    <p className="font-semibold">R$ {calculationResult.lucroAnual.toLocaleString('pt-BR')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Distribuição de Receitas</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={calculationResult.pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={70}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {calculationResult.pieData.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `R$ ${value.toLocaleString('pt-BR')}`} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              Este relatório apresenta uma análise de rentabilidade para o investimento em {calculationResult.formData.projectName || 'propriedade'} 
              localizada em {calculationResult.formData.location || 'localização não especificada'}. Com um investimento inicial de 
              R$ {parseFloat(calculationResult.formData.purchasePrice).toLocaleString('pt-BR')}, 
              o imóvel tem potencial de gerar um ROI anual de {calculationResult.roiAnual}%, 
              com retorno completo do investimento em aproximadamente {calculationResult.retornoEmAnos} anos.
            </p>
          </div>
          
          <div className="text-center text-xs text-gray-400 mt-6">
            <p>Análise gerada por ARCA AI Tools em {new Date().toLocaleDateString('pt-BR')}</p>
          </div>
        </div>
      )}
      
      {calculationResult && (
        <div className="flex justify-center mt-6">
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                onClick={exportToPdf}
                className="bg-arca-blue hover:bg-arca-dark-blue flex gap-2 items-center"
              >
                <Download size={16} />
                Exportar como PDF
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>PDF Exportado com Sucesso</DialogTitle>
              </DialogHeader>
              <p className="py-4">
                O relatório de ROI para {calculationResult.formData.projectName || 'sua propriedade'} foi exportado com sucesso e está pronto para compartilhamento.
              </p>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
};

export default RoiCalculator;
