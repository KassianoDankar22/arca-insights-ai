
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface FormHeaderProps {
  title: string;
  description: string;
}

const FormHeader: React.FC<FormHeaderProps> = ({ title, description }) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="text-center mb-6">
      <h2 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-semibold text-gray-800 mb-3`}>
        {title}
      </h2>
      <p className="text-gray-600 max-w-2xl mx-auto">
        {description}
      </p>
    </div>
  );
};

export default FormHeader;
