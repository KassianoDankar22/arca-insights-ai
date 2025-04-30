import React from 'react';
interface LogoProps {
  className?: string;
  showText?: boolean;
}
const Logo: React.FC<LogoProps> = ({
  className = "",
  showText = true
}) => {
  return <div className={`flex items-center justify-center ${className}`}>
      <img alt="Arca AI Logo" src="/lovable-uploads/48c84aa8-2ba2-4d0c-a8ff-5cd2cef1c5b3.png" className="h-14 w-auto object-scale-down" />
    </div>;
};
export default Logo;