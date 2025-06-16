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

export const AnimatedWaves: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`absolute inset-0 overflow-hidden z-0 ${className}`}>
      {/* Soft flowing gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#f0f4ff] via-[#e0eaff] to-[#d4e0ff] -z-10"></div>
      
      {/* Accent color blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] rounded-full bg-gradient-to-br from-[#d9c2ff]/20 via-[#bea6ff]/10 to-transparent blur-[100px]"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[80%] h-[80%] rounded-full bg-gradient-to-tl from-[#c2d9ff]/30 via-[#a6c8ff]/20 to-transparent blur-[120px]"></div>
      
      {/* Wave 1 - Lighter blue */}
      <div className="absolute w-[200%] h-[40px] bottom-[18%] animate-wave" style={{ animationDuration: '18s' }}>
        <svg viewBox="0 0 1000 100" className="h-full w-full fill-[#DBF0FF]/50">
          <path d="M0,50 C150,20 350,80 500,50 C650,20 850,80 1000,50 L1000,100 L0,100 Z" />
        </svg>
      </div>
      
      {/* Wave 2 - Medium blue */}
      <div className="absolute w-[200%] h-[50px] bottom-[12%] animate-wave" style={{ animationDuration: '14s', animationDelay: '0.5s' }}>
        <svg viewBox="0 0 1000 100" className="h-full w-full fill-[#9DCFEE]/40">
          <path d="M0,50 C150,80 350,20 500,50 C650,80 850,20 1000,50 L1000,100 L0,100 Z" />
        </svg>
      </div>
      
      {/* Wave 3 - Purplish blue */}
      <div className="absolute w-[200%] h-[60px] bottom-[6%] animate-wave" style={{ animationDuration: '16s', animationDelay: '0.3s' }}>
        <svg viewBox="0 0 1000 100" className="h-full w-full fill-[#9aa4e8]/30">
          <path d="M0,50 C200,80 300,20 500,50 C700,80 800,20 1000,50 L1000,100 L0,100 Z" />
        </svg>
      </div>
      
      {/* Wave 4 - Darker blue with soft purple tint */}
      <div className="absolute w-[200%] h-[70px] bottom-[0%] animate-wave" style={{ animationDuration: '20s', animationDelay: '0.7s' }}>
        <svg viewBox="0 0 1000 100" className="h-full w-full fill-[#8a94db]/25">
          <path d="M0,60 C250,30 350,90 500,60 C650,30 750,90 1000,60 L1000,100 L0,100 Z" />
        </svg>
      </div>
      
      {/* Add floating particles for extra depth */}
      <div className="absolute top-1/3 left-1/4 w-6 h-6 rounded-full bg-white/10 blur-sm animate-float-slow"></div>
      <div className="absolute top-2/3 right-1/3 w-4 h-4 rounded-full bg-white/10 blur-sm animate-float-medium"></div>
      <div className="absolute top-1/2 left-2/3 w-8 h-8 rounded-full bg-white/10 blur-sm animate-float-fast"></div>
    </div>
  );
};
