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
import { Card } from '@/components/ui/card';
import LoaderOne from '@/components/ui/loader-one';

const LoadingState: React.FC = () => {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="p-4">
          <div className="animate-pulse">
            <div className="flex items-center justify-between mb-4">
              <div className="space-y-2">
                <div className="h-4 w-48 bg-gray-200 rounded"></div>
                <div className="h-3 w-32 bg-gray-200 rounded"></div>
              </div>
              <LoaderOne />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="h-3 w-24 bg-gray-200 rounded"></div>
                <div className="h-4 w-32 bg-gray-200 rounded"></div>
              </div>
              <div className="space-y-2">
                <div className="h-3 w-24 bg-gray-200 rounded"></div>
                <div className="h-4 w-32 bg-gray-200 rounded"></div>
              </div>
              <div className="space-y-2">
                <div className="h-3 w-24 bg-gray-200 rounded"></div>
                <div className="h-4 w-32 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default LoadingState;
