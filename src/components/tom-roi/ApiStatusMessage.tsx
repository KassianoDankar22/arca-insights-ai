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
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ApiStatusMessageProps {
  onTryAgain: () => void;
}

const ApiStatusMessage: React.FC<ApiStatusMessageProps> = ({ onTryAgain }) => {
  return (
    <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-md p-4 mb-6">
      <div className="flex items-start">
        <div className="flex-shrink-0 mt-0.5">
          <AlertTriangle className="h-5 w-5 text-amber-600" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium">Serviço temporariamente indisponível</h3>
          <div className="mt-2 text-sm">
            <ul className="list-disc pl-5 space-y-1">
              <li>Aguardar alguns minutos e tentar novamente</li>
              <li>Verificar se há manutenção programada</li>
              <li>Entrar em contato com o suporte se o problema persistir</li>
            </ul>
          </div>
          <div className="mt-3">
            <Button
              size="sm"
              variant="outline"
              onClick={onTryAgain}
              className="flex items-center gap-2"
            >
              <RefreshCw size={14} />
              Verificar novamente
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiStatusMessage; 