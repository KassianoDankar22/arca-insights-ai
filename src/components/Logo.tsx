
import React from 'react';

interface LogoProps {
  className?: string;
  showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className = "", showText = true }) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <img 
        src="/lovable-uploads/5de6cebf-0745-4969-adca-eb8b63437759.png" 
        alt="Arca AI Logo" 
        className="h-24 w-auto"  // Changed to h-24 as requested
      />
    </div>
  );
};

export default Logo;
