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

interface MarketInsightCardProps {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
  iconBgColor?: string;
}

const MarketInsightCard: React.FC<MarketInsightCardProps> = ({
  icon: Icon,
  title,
  children,
  iconBgColor = "bg-blue-100"
}) => {
  return (
    <div className="flex gap-4 mb-6">
      <div className={`${iconBgColor} p-3 rounded-lg h-fit`}>
        <Icon className="text-arca-blue" size={24} />
      </div>
      <div>
        <h3 className="text-lg font-medium text-gray-800 mb-1">{title}</h3>
        {children}
      </div>
    </div>
  );
};

export default MarketInsightCard;
