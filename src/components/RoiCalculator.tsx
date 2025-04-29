
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Calculator } from 'lucide-react';

const RoiCalculator: React.FC = () => {
  const [precoCompra, setPrecoCompra] = useState('');
  const [aluguelMensal, setAluguelMensal] = useState('');
  const [despesasMensais, setDespesasMensais] = useState('');
  const [calculationResult, setCalculationResult] = useState<any>(null);

  const handleCalculate = () => {
    const compra = parseFloat(precoCompra);
    const aluguel = parseFloat(aluguelMensal);
    const despesas = parseFloat(despesasMensais);
    
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
      ]
    });
  };
  
  const COLORS = ['#FF8042', '#00C49F'];

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 flex items-center">
        <Calculator className="mr-2" />
        Calculadora de ROI - Curto Prazo
      </h2>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Informações do Investimento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label htmlFor="precoCompra" className="text-sm font-medium">
                Preço de Compra (R$)
              </label>
              <Input
                id="precoCompra"
                type="number"
                value={precoCompra}
                onChange={(e) => setPrecoCompra(e.target.value)}
                placeholder="Ex: 500000"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="aluguelMensal" className="text-sm font-medium">
                Aluguel Mensal (R$)
              </label>
              <Input
                id="aluguelMensal"
                type="number"
                value={aluguelMensal}
                onChange={(e) => setAluguelMensal(e.target.value)}
                placeholder="Ex: 2500"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="despesasMensais" className="text-sm font-medium">
                Despesas Mensais (R$)
              </label>
              <Input
                id="despesasMensais"
                type="number"
                value={despesasMensais}
                onChange={(e) => setDespesasMensais(e.target.value)}
                placeholder="Ex: 500"
              />
            </div>
          </div>
          <Button 
            onClick={handleCalculate}
            className="w-full mt-4 bg-arca-purple hover:bg-arca-dark-purple"
          >
            Calcular ROI
          </Button>
        </CardContent>
      </Card>
      
      {calculationResult && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Resultados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-arca-soft-purple p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-600">ROI Anual</p>
                  <p className="text-3xl font-bold text-arca-purple">{calculationResult.roiAnual}%</p>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-600">Retorno do Investimento</p>
                  <p className="text-3xl font-bold text-gray-700">{calculationResult.retornoEmAnos} anos</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500">Receita Anual</p>
                    <p className="font-semibold">R$ {calculationResult.receitaAnual.toLocaleString()}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500">Despesas Anuais</p>
                    <p className="font-semibold">R$ {calculationResult.despesaAnual.toLocaleString()}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg col-span-2">
                    <p className="text-xs text-gray-500">Lucro Anual</p>
                    <p className="font-semibold">R$ {calculationResult.lucroAnual.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Distribuição</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={calculationResult.pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {calculationResult.pieData.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `R$ ${value.toLocaleString()}`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 text-sm text-gray-600">
                <p>
                  Com um investimento de R$ {parseInt(precoCompra).toLocaleString()}, você receberá cerca de 
                  R$ {calculationResult.lucroAnual.toLocaleString()} por ano em lucro líquido, o que representa 
                  um ROI anual de {calculationResult.roiAnual}%.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default RoiCalculator;
