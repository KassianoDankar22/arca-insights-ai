import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, RefreshCw, Clock } from 'lucide-react';
import axios from 'axios';
import { motion } from 'framer-motion';

const CurrencyWidget: React.FC = () => {
  const [dollarRate, setDollarRate] = useState<number | null>(null);
  const [previousRate, setPreviousRate] = useState<number | null>(null);
  const [percentChange, setPercentChange] = useState<number | null>(null);
  const [absoluteChange, setAbsoluteChange] = useState<number | null>(null);
  const [weeklyHigh, setWeeklyHigh] = useState<number | null>(null);
  const [weeklyLow, setWeeklyLow] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState('');
  const [timePeriod, setTimePeriod] = useState<'today' | 'week' | 'month'>('today');

  const fetchDollarRate = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('https://open.er-api.com/v6/latest/USD');
      if (response.data && response.data.rates && response.data.rates.BRL) {
        // Save previous rate to determine if it's going up or down
        if (dollarRate !== null) {
          setPreviousRate(dollarRate);
          
          // Calculate percent and absolute changes
          const newRate = response.data.rates.BRL;
          const percentDiff = ((newRate - dollarRate) / dollarRate) * 100;
          setPercentChange(percentDiff);
          setAbsoluteChange(newRate - dollarRate);
        }
        
        setDollarRate(response.data.rates.BRL);
        
        // For demo purposes, set simulated weekly high/low
        // In a real app, you would fetch historical data
        if (!weeklyHigh || response.data.rates.BRL > weeklyHigh) {
          setWeeklyHigh(response.data.rates.BRL);
        }
        
        if (!weeklyLow || response.data.rates.BRL < weeklyLow) {
          setWeeklyLow(response.data.rates.BRL);
        } else {
          // For demo - simulate some variation if unchanged
          if (!weeklyHigh) setWeeklyHigh(response.data.rates.BRL * 1.05);
          if (!weeklyLow) setWeeklyLow(response.data.rates.BRL * 0.95);
        }
        
        // Format current time for last update display
        const now = new Date();
        setLastUpdate(now.toLocaleTimeString());
      }
    } catch (error) {
      console.error('Error fetching dollar rate:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDollarRate();
    
    // Set up polling every 5 minutes
    const intervalId = setInterval(fetchDollarRate, 300000);
    
    return () => clearInterval(intervalId);
  }, []);

  // Determine if rate is up or down from previous
  const isUp = previousRate !== null && dollarRate !== null && dollarRate > previousRate;
  const isDown = previousRate !== null && dollarRate !== null && dollarRate < previousRate;
  
  const formatPercentChange = () => {
    if (percentChange === null) return '';
    return `${percentChange > 0 ? '+' : ''}${percentChange.toFixed(2)}%`;
  };
  
  const formatAbsoluteChange = () => {
    if (absoluteChange === null) return '';
    return `${absoluteChange > 0 ? '+' : ''}${Math.abs(absoluteChange).toFixed(4)}`;
  };

  const renderTimePeriodSelector = () => (
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
          <div className="flex items-start justify-between">
            <div>
              {dollarRate ? (
                <div className="flex items-center">
                  <span className="text-2xl font-bold">R$ {dollarRate.toFixed(2)}</span>
                  {isUp && <TrendingUp className="ml-2 text-green-500" size={20} />}
                  {isDown && <TrendingDown className="ml-2 text-red-500" size={20} />}
                </div>
              ) : (
                <div className="h-8 bg-gray-200 rounded animate-pulse w-24" />
              )}
              
              {percentChange !== null && (
                <div className="text-sm mt-1">
                  <span className={isUp ? 'text-green-500' : isDown ? 'text-red-500' : 'text-gray-500'}>
                    {formatAbsoluteChange()} ({formatPercentChange()})
                  </span>
                </div>
              )}
              
              <div className="flex items-center text-xs text-gray-500 mt-1">
                <Clock size={12} className="mr-1" /> 
                <span>Atualizado às {lastUpdate}</span>
              </div>
            </div>
            <div className="text-right">
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                isUp ? 'bg-green-100 text-green-800' : 
                isDown ? 'bg-red-100 text-red-800' : 
                'bg-blue-100 text-blue-800'
              }`}>
                {isUp ? '↑ Alta' : isDown ? '↓ Queda' : 'Estável'}
              </span>
            </div>
          </div>
          
          {renderTimePeriodSelector()}
          
          {weeklyHigh !== null && weeklyLow !== null && (
            <div className="mt-2 pt-2 border-t border-gray-100">
              <div className="flex justify-between text-xs">
                <div>
                  <div className="text-gray-600">Mínima {timePeriod === 'today' ? 'hoje' : timePeriod === 'week' ? 'da semana' : 'do mês'}</div>
                  <div className="font-semibold">R$ {weeklyLow.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-gray-600 text-right">Máxima {timePeriod === 'today' ? 'hoje' : timePeriod === 'week' ? 'da semana' : 'do mês'}</div>
                  <div className="font-semibold text-right">R$ {weeklyHigh.toFixed(2)}</div>
                </div>
              </div>
              <div className="mt-2 h-2 bg-gray-100 rounded overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-400 to-purple-400" 
                  style={{ 
                    width: `${dollarRate && weeklyLow && weeklyHigh 
                      ? ((dollarRate - weeklyLow) / (weeklyHigh - weeklyLow)) * 100 
                      : 0}%` 
                  }}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CurrencyWidget;
