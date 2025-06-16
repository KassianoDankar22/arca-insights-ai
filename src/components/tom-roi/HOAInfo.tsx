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

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Info, ChevronDown, ChevronUp, Lightbulb, BarChart3, Target, FileText, CheckCircle, AlertTriangle } from 'lucide-react';
import { HOA_TABLE, getHOAByCondominiumAndBedrooms } from './data/hoa-table';

interface HOAInfoProps {
  selectedCondominium?: string;
  selectedBedrooms?: number;
}

const HOAInfo: React.FC<HOAInfoProps> = ({ selectedCondominium, selectedBedrooms }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Buscar HOA específico se temos dados
  const specificHOA = selectedCondominium && selectedBedrooms 
    ? getHOAByCondominiumAndBedrooms(selectedCondominium, selectedBedrooms)
    : null;

  return (
    <Card className="bg-blue-50 border-blue-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Info size={16} className="text-blue-600" />
            <CardTitle className="text-sm font-medium text-blue-800">
              <Lightbulb className="inline w-4 h-4 mr-1" /> Sistema HOA Inteligente
            </CardTitle>
            {specificHOA && (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                HOA: ${specificHOA}
              </Badge>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-6 w-6 p-0 text-blue-600"
          >
            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          <p className="text-sm text-blue-700">
            {specificHOA 
              ? <><CheckCircle className="inline w-4 h-4 mr-1" /> HOA encontrado automaticamente: ${specificHOA} para {selectedCondominium} ({selectedBedrooms} quartos)</>
              : <><BarChart3 className="inline w-4 h-4 mr-1" /> Agora usamos uma tabela com valores reais de HOA por condomínio e quartos</>
            }
          </p>

          {isExpanded && (
            <div className="space-y-4">
              <div className="bg-white p-3 rounded-md border border-blue-200">
                <h4 className="text-sm font-semibold text-blue-800 mb-2"><Target className="inline w-4 h-4 mr-1" /> Como Funciona:</h4>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• <strong>Automático:</strong> Sistema busca HOA real por condomínio e quartos</li>
                  <li>• <strong>Dados 2024:</strong> Valores baseados em dados reais de mercado</li>
                  <li>• <strong>Precisão:</strong> Elimina "chutes" e estimativas imprecisas</li>
                  <li>• <strong>Flexível:</strong> Você pode sobrescrever manualmente se precisar</li>
                </ul>
              </div>

              <div className="bg-white p-3 rounded-md border border-blue-200">
                <h4 className="text-sm font-semibold text-blue-800 mb-2"><FileText className="inline w-4 h-4 mr-1" /> Condomínios na Base:</h4>
                <div className="grid grid-cols-2 gap-1 text-xs text-blue-700">
                  {HOA_TABLE.map((item, index) => (
                    <div key={index} className="flex justify-between">
                      <span>{item.condominio}</span>
                      <span className="font-mono">
                        ${selectedBedrooms ? 
                          (selectedBedrooms === 3 ? item.quartos3 :
                           selectedBedrooms === 4 ? item.quartos4 :
                           selectedBedrooms === 5 ? item.quartos5 :
                           item.quartos6Plus) 
                          : '...'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-yellow-50 p-3 rounded-md border border-yellow-200">
                <h4 className="text-sm font-semibold text-yellow-800 mb-1"><AlertTriangle className="inline w-4 h-4 mr-1" /> Importante:</h4>
                <p className="text-xs text-yellow-700">
                  Se o condomínio não estiver na lista, o sistema usa valores médios por quartos. 
                  Você sempre pode inserir manualmente um valor específico se souber o HOA exato.
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default HOAInfo; 