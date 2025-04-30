
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCurrencyData } from '@/hooks/useCurrencyData';
import { CurrencyRateDisplay } from './currency/CurrencyRateDisplay';
import { TimePeriodSelector } from './currency/TimePeriodSelector';
import { PriceRange } from './currency/PriceRange';

const CurrencyWidget: React.FC = () => {
  const [timePeriod, setTimePeriod] = useState<'today' | 'week' | 'month'>('today');
  const { 
    dollarRate, 
    previousRate, 
    percentChange, 
    absoluteChange, 
    weeklyHigh, 
    weeklyLow, 
    isLoading, 
    lastUpdate, 
    fetchDollarRate 
  } = useCurrencyData();

  // Determine if rate is up or down from previous
  const isUp = previousRate !== null && dollarRate !== null && dollarRate > previousRate;
  const isDown = previousRate !== null && dollarRate !== null && dollarRate < previousRate;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 pb-2">
          <CardTitle className="text-lg flex justify-between items-center">
            <span className="flex items-center">
              <span className="text-arca-blue font-medium">USD/BRL</span>
            </span>
            <button 
              onClick={fetchDollarRate} 
              className="text-gray-600 hover:text-blue-600 transition-colors"
              disabled={isLoading}
            >
              <RefreshCw size={16} className={`${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <CurrencyRateDisplay 
            dollarRate={dollarRate}
            isUp={isUp}
            isDown={isDown}
            percentChange={percentChange}
            absoluteChange={absoluteChange}
            lastUpdate={lastUpdate}
          />
          
          <TimePeriodSelector 
            timePeriod={timePeriod}
            setTimePeriod={setTimePeriod}
          />
          
          <PriceRange 
            weeklyHigh={weeklyHigh}
            weeklyLow={weeklyLow}
            dollarRate={dollarRate}
            timePeriod={timePeriod}
          />
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CurrencyWidget;
