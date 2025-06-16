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

interface MetricCardProps { 
  title: string; 
  value: string | number;
  change?: string;
  icon: React.ReactNode;
  iconBgColor?: string;
  lastUpdated?: string;
  changeColor?: string;
}

export default function MetricCard({ 
  title, 
  value, 
  change, 
  icon,
  iconBgColor = 'bg-blue-100',
  lastUpdated,
  changeColor = 'text-green-500'
}: MetricCardProps) {
  return (
    <Card className="p-6 bg-white shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          {change && <p className={changeColor}>{change}</p>}
          {lastUpdated && <p className="text-gray-500 text-xs">{lastUpdated}</p>}
            </div>
        <div className={`${iconBgColor} p-2 rounded-lg`}>{icon}</div>
          </div>
      </Card>
  );
}
