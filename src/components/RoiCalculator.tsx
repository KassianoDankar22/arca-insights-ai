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
import { Card, CardContent } from '@/components/ui/card';

// This component is now replaced by the Tom ROI analyzer
// This file exists only for backward compatibility
const RoiCalculator: React.FC = () => {
  return (
    <Card className="bg-white/80 backdrop-blur-lg border border-gray-200 shadow-lg">
      <CardContent className="p-6">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-semibold text-gray-800 mb-3">
            Calculadora de ROI
          </h2>
          <p className="text-gray-600">
            Esta calculadora foi substituída pelo Tom - Especialista em Análise de ROI.
            Por favor, utilize a nova ferramenta.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default RoiCalculator;
