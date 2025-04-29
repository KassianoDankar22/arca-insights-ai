
import React from 'react';

interface LogoProps {
  className?: string;
  showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className = "", showText = true }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img 
        src="/lovable-uploads/5de6cebf-0745-4969-adca-eb8b63437759.png" 
        alt="Arca AI Logo" 
        className="h-10"
      />
    </div>
  );
};

export default Logo;
