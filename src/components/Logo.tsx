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
      <img alt="Arca AI Logo" className="h-14 w-auto object-scale-down" src="/lovable-uploads/f661dcdf-81da-40d9-b1b9-622de36233cb.png" />
    </div>;
};
export default Logo;