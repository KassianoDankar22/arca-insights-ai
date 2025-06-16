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
import { LucideIcon } from 'lucide-react';

interface ActionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  className?: string;
  onClick?: () => void;
}

const ActionCard: React.FC<ActionCardProps> = ({ 
  title, 
  description, 
  icon: Icon,
  className,
  onClick 
}) => {
  return (
    <div 
      onClick={onClick}
      className={cn(
        "relative group overflow-hidden rounded-xl p-6 bg-white/5 backdrop-blur-sm border border-white/10 cursor-pointer transition-all",
        "hover:scale-[1.02] hover:bg-white/10 hover:shadow-lg",
        className
      )}
    >
      <div className="absolute -right-3 -top-3 p-3 text-arca-blue opacity-20 group-hover:opacity-30 transition-opacity">
        <Icon size={48} />
      </div>
      <div className="relative z-10">
        <h3 className="font-semibold text-lg text-white mb-2">{title}</h3>
        <p className="text-white/70 text-sm">{description}</p>
      </div>
    </div>
  );
};

export default ActionCard;
