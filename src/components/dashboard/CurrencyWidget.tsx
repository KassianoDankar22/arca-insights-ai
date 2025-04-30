
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import axios from 'axios';
import { motion } from 'framer-motion';

const CurrencyWidget: React.FC = () => {
  const [dollarRate, setDollarRate] = useState<number | null>(null);
  const [previousRate, setPreviousRate] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState('');

  const fetchDollarRate = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('https://open.er-api.com/v6/latest/USD');
      if (response.data && response.data.rates && response.data.rates.BRL) {
        // Save previous rate to determine if it's going up or down
        if (dollarRate !== null) {
          setPreviousRate(dollarRate);
        }
        setDollarRate(response.data.rates.BRL);
        
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
          <div className="flex items-end justify-between">
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
              <p className="text-xs text-gray-500 mt-1">Atualizado às {lastUpdate}</p>
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
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CurrencyWidget;
