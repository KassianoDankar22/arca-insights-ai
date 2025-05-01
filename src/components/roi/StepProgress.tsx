
import React from 'react';

type StepProgressProps = {
  currentStep: number;
  totalSteps: number;
};

const StepProgress: React.FC<StepProgressProps> = ({ currentStep, totalSteps }) => {
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              index + 1 === currentStep
                ? 'bg-arca-purple text-white'
                : index + 1 < currentStep
                ? 'bg-arca-light-blue text-white'
                : 'bg-gray-100 text-gray-500'
            }`}>
              {index + 1}
            </div>
          </div>
        ))}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className="h-2.5 rounded-full bg-gradient-to-r from-arca-dark-blue to-arca-light-blue" 
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>
    </div>
  );
};

export default StepProgress;
