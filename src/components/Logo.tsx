
import React from 'react';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "" }) => {
  return (
    <div className={`flex items-center gap-2 font-bold text-2xl ${className}`}>
      <span className="bg-clip-text text-transparent arca-gradient">ARCA</span>
      <span className="text-xs bg-arca-purple text-white px-2 py-0.5 rounded-md">INSIGHTS AI</span>
    </div>
  );
};

export default Logo;
