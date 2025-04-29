
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
        className="h-32 w-auto"  // Increased height from h-16 to h-32
      />
    </div>
  );
};

export default Logo;
