/**
 * ========================================
 * ARCA AI - ROI ANALYSIS PLATFORM
 * ========================================
 * 
 * Copyright (c) 2025 JimmyDev
 * All rights reserved.
 * 
 * PROPRIETARY AND CONFIDENTIAL
 * This file contains proprietary code developed by JimmyDev.
 * Unauthorized copying, distribution, or use is strictly prohibited.
 * 
 * Developed by: JimmyDev
 * ========================================
 */

/**
 * ========================================
 * ARCA AI - ROI ANALYSIS PLATFORM
 * ========================================
 * 
 * Copyright (c) 2024 JimmyDev
 * All rights reserved.
 * 
 * PROPRIETARY AND CONFIDENTIAL
 * This file contains proprietary code developed by JimmyDev.
 * Unauthorized copying, distribution, or use is strictly prohibited.
 * 
 * Developed by: JimmyDev
 * ========================================
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { FormValues } from './types';

export interface CalculationResultProps {
  calculationResult: {
    roiAnual: string;
    retornoEmAnos: string;
    receitaAnual: number;
    despesaAnual: number;
    lucroAnual: number;
    pieData: { name: string; value: number }[];
    formData: FormValues;
  };
  logoPreview: string | null;
  exportToPdf: () => void;
  reportRef: React.RefObject<HTMLDivElement>;
}

const COLORS = ['#FF8042', '#00C49F'];

const CalculationResult: React.FC<CalculationResultProps> = ({ 
  calculationResult, 
  logoPreview,
  exportToPdf,
  reportRef
}) => {
  return (
    <>
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
                      {calculationResult.pieData.map((entry, index) => (
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
      
      <div className="flex justify-center mt-6">
        <Button 
          onClick={exportToPdf}
          className="bg-arca-blue hover:bg-arca-dark-blue flex gap-2 items-center"
        >
          <Download size={16} />
          Exportar como PDF
        </Button>
      </div>
    </>
  );
};

export default CalculationResult;
