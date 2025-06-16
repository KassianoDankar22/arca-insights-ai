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
import { cn } from '@/lib/utils';

interface AnimatedBorderInputProps {
  children: React.ReactNode;
  className?: string;
}

export const AnimatedBorderInput: React.FC<AnimatedBorderInputProps> = ({ children, className }) => {
  return (
    <div className={cn(
      "relative group",
      className
    )}>
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400 via-blue-600 to-blue-400 rounded-md blur opacity-0 group-hover:opacity-100 transition duration-300 animate-gradient-x"></div>
      <div className="relative bg-white rounded-md">
        {children}
      </div>
    </div>
  );
};
