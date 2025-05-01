
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileMinus, FileBarChart, House, ArrowLeft, CircleDollarSign, DownloadCloud, FileText, Calendar } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { TomRoiResultData } from './types';

interface TomRoiResultsProps {
  resultData: TomRoiResultData;
  onRecalculate: () => void;
  onReset: () => void;
  onExport: () => void;
  onViewHistory: () => void;
}

const TomRoiResults: React.FC<TomRoiResultsProps> = ({ 
  resultData, 
  onRecalculate, 
  onReset,
  onExport,
  onViewHistory
}) => {
  const isMobile = useIsMobile();
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  
  const formatPercent = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  const cardClasses = "bg-white/70 backdrop-blur-lg border border-white/20 shadow-lg transition-all hover:shadow-xl";

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-semibold text-gray-800 mb-3`}>
          Análise de ROI para {resultData.formData.projectName}
        </h2>
        <p className="text-gray-600">
          Aqui está a análise detalhada para seu imóvel em {resultData.formData.location}
        </p>
      </div>

      {/* Results Cards */}
      <div className={`grid grid-cols-1 ${isMobile ? '' : 'md:grid-cols-2 lg:grid-cols-4'} gap-6`}>
        {/* Property & Financing Card */}
        <Card className={cardClasses}>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-full bg-blue-50">
                <House className="text-arca-blue" size={24} />
              </div>
              <CardTitle className="text-xl">Imóvel & Financiamento</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex justify-between">
                <span className="text-gray-600">Valor do imóvel:</span>
                <span className="font-semibold">{formatCurrency(resultData.property.value)}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600">Entrada (20%):</span>
                <span className="font-semibold">{formatCurrency(resultData.property.downPayment)}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600">Valor financiado:</span>
                <span className="font-semibold">{formatCurrency(resultData.property.financedAmount)}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600">Taxa de juros:</span>
                <span className="font-semibold">{formatPercent(resultData.property.interestRate)}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600">Prazo:</span>
                <span className="font-semibold">{resultData.property.term} anos</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Rental Income Card */}
        <Card className={cardClasses}>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-full bg-green-50">
                <CircleDollarSign className="text-green-600" size={24} />
              </div>
              <CardTitle className="text-xl">Rendimento do Aluguel</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex justify-between">
                <span className="text-gray-600">Diária média:</span>
                <span className="font-semibold">{formatCurrency(resultData.rental.averageRate)}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600">Taxa de ocupação:</span>
                <span className="font-semibold">{resultData.rental.occupancyRate}%</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600">Rendimento mensal:</span>
                <span className="font-semibold">{formatCurrency(resultData.rental.monthlyGross)}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600">Rendimento anual:</span>
                <span className="font-semibold">{formatCurrency(resultData.rental.yearlyGross)}</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Expenses Card */}
        <Card className={cardClasses}>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-full bg-red-50">
                <FileMinus className="text-red-500" size={24} />
              </div>
              <CardTitle className="text-xl">Despesas</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex justify-between">
                <span className="text-gray-600">Administração:</span>
                <span className="font-semibold">{formatCurrency(resultData.expenses.management)}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600">Piscina:</span>
                <span className="font-semibold">{formatCurrency(resultData.expenses.pool)}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600">Contas mensais:</span>
                <span className="font-semibold">{formatCurrency(resultData.expenses.utilities)}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600">HOA/Condomínio:</span>
                <span className="font-semibold">{formatCurrency(resultData.expenses.hoa)}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600">IPTU:</span>
                <span className="font-semibold">{formatCurrency(resultData.expenses.propertyTax)}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600">Seguro:</span>
                <span className="font-semibold">{formatCurrency(resultData.expenses.insurance)}</span>
              </li>
              <li className="flex justify-between font-semibold border-t pt-2 mt-2">
                <span>Total Mensal:</span>
                <span className="text-red-500">{formatCurrency(resultData.expenses.totalMonthly)}</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* ROI Final Card */}
        <Card className={cardClasses}>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-full bg-purple-50">
                <FileBarChart className="text-purple-600" size={24} />
              </div>
              <CardTitle className="text-xl">ROI Final</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex justify-between">
                <span className="text-gray-600">Renda líquida mensal:</span>
                <span className="font-semibold">{formatCurrency(resultData.roi.netMonthlyIncome)}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600">Após financiamento:</span>
                <span className={`font-semibold ${resultData.roi.afterFinancing < 0 ? 'text-red-500' : 'text-green-500'}`}>
                  {formatCurrency(resultData.roi.afterFinancing)}
                </span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600">Valorização anual:</span>
                <span className="font-semibold">{formatCurrency(resultData.roi.annualAppreciation)}</span>
              </li>
              <li className="flex justify-between font-semibold border-t pt-2 mt-2">
                <span>Total anual:</span>
                <span className="text-purple-600">{formatCurrency(resultData.roi.totalAnnual)}</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className={`flex ${isMobile ? 'flex-col space-y-3' : 'flex-row space-x-3'} justify-center mt-8`}>
        <Button
          variant="outline"
          className="gap-2"
          onClick={onRecalculate}
        >
          <ArrowLeft size={18} />
          Alterar Dados e Recalcular
        </Button>
        <Button
          variant="outline"
          className="gap-2"
          onClick={onReset}
        >
          <FileText size={18} />
          Gerar Novo ROI
        </Button>
        <Button
          className="gap-2 bg-arca-blue hover:bg-blue-600"
          onClick={onExport}
        >
          <DownloadCloud size={18} />
          Exportar PDF/JPEG
        </Button>
        <Button
          variant="outline"
          className="gap-2"
          onClick={onViewHistory}
        >
          <Calendar size={18} />
          Ver Histórico de Análises
        </Button>
      </div>
    </div>
  );
};

export default TomRoiResults;
