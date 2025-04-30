
import React from 'react';

export const AnimatedWaves: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`absolute inset-0 overflow-hidden z-0 ${className}`}>
      {/* Wave 1 - Lighter blue */}
      <div className="absolute w-[200%] h-[40px] bottom-[15%] animate-wave" style={{ animationDuration: '15s' }}>
        <svg viewBox="0 0 1000 100" className="h-full w-full fill-[#DBF0FF]/70">
          <path d="M0,50 C150,20 350,80 500,50 C650,20 850,80 1000,50 L1000,100 L0,100 Z" />
        </svg>
      </div>
      
      {/* Wave 2 - Medium blue */}
      <div className="absolute w-[200%] h-[50px] bottom-[10%] animate-wave" style={{ animationDuration: '10s', animationDelay: '0.5s' }}>
        <svg viewBox="0 0 1000 100" className="h-full w-full fill-[#9DCFEE]/60">
          <path d="M0,50 C150,80 350,20 500,50 C650,80 850,20 1000,50 L1000,100 L0,100 Z" />
        </svg>
      </div>
      
      {/* Wave 3 - Darker blue */}
      <div className="absolute w-[200%] h-[60px] bottom-[5%] animate-wave" style={{ animationDuration: '12s', animationDelay: '0.3s' }}>
        <svg viewBox="0 0 1000 100" className="h-full w-full fill-[#6DAFE0]/50">
          <path d="M0,50 C200,80 300,20 500,50 C700,80 800,20 1000,50 L1000,100 L0,100 Z" />
        </svg>
      </div>
      
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-[#F7F7F7] to-[#E8F4FC] -z-10"></div>
    </div>
  );
};
