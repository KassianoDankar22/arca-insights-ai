
import React from 'react';

const LoadingState: React.FC = () => {
  return (
    <div className="text-center py-8">
      <div className="animate-spin w-8 h-8 border-4 border-arca-blue border-t-transparent rounded-full mx-auto mb-4"></div>
      <p>Carregando análises...</p>
    </div>
  );
};

export default LoadingState;
