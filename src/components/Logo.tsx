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
      <img alt="Arca AI Logo" src="/lovable-uploads/6954e100-c7f2-481d-a212-f2fa53fb94da.png" className="h-16 w-auto object-scale-down" />
    </div>;
};
export default Logo;