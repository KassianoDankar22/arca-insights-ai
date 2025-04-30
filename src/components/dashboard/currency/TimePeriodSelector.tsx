
import React from 'react';

type TimePeriod = 'today' | 'week' | 'month';

interface TimePeriodSelectorProps {
  timePeriod: TimePeriod;
  setTimePeriod: (period: TimePeriod) => void;
}

export const TimePeriodSelector: React.FC<TimePeriodSelectorProps> = ({ 
  timePeriod, 
  setTimePeriod 
}) => {
  return (
    <div className="flex gap-2 text-xs mt-2 mb-2">
      <button 
        onClick={() => setTimePeriod('today')} 
        className={`px-2 py-1 rounded-full transition-colors ${
          timePeriod === 'today' 
            ? 'bg-arca-blue text-white' 
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        Hoje
      </button>
      <button 
        onClick={() => setTimePeriod('week')} 
        className={`px-2 py-1 rounded-full transition-colors ${
          timePeriod === 'week' 
            ? 'bg-arca-blue text-white' 
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        Semana
      </button>
      <button 
        onClick={() => setTimePeriod('month')} 
        className={`px-2 py-1 rounded-full transition-colors ${
          timePeriod === 'month' 
            ? 'bg-arca-blue text-white' 
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        Mês
      </button>
    </div>
  );
};
