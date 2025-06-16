
/**
 * ========================================
 * ARCA AI - ROI ANALYSIS PLATFORM
 * ========================================
 * 
 * Copyright (c) 2025 JimmyDev
 * All rights reserved.
 * 
 * PROPRIETARY AND CONFIDENTIAL
 * This file contains proprietary code developed by JimmyDev.
 * Unauthorized copying, distribution, or use is strictly prohibited.
 * 
 * Developed by: JimmyDev
 * ========================================
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCurrencyData } from '@/hooks/useCurrencyData';
import { CurrencyRateDisplay } from './currency/CurrencyRateDisplay';
import { TimePeriodSelector } from './currency/TimePeriodSelector';
import { PriceRange } from './currency/PriceRange';
import { CurrencyHistory } from './currency/CurrencyHistory';
import { toast } from 'sonner';

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
    dayHistory,
    fetchDollarRate 
  } = useCurrencyData();

  // Determine if rate is up or down from previous
  const isUp = previousRate !== null && dollarRate !== null && dollarRate > previousRate;
  const isDown = previousRate !== null && dollarRate !== null && dollarRate < previousRate;

  const handleManualRefresh = async () => {
    try {
      await fetchDollarRate();
      toast.success('Cotação atualizada com sucesso!');
    } catch (error) {
      toast.error('Erro ao atualizar cotação. Tente novamente.');
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="shadow-sm border h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-bold flex justify-between items-center">
            <span className="flex items-center text-arca-dark-blue">USD/BRL</span>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleManualRefresh}
                disabled={isLoading}
                className="text-gray-600 hover:text-blue-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                aria-label="Atualizar cotação"
              >
                <RefreshCw size={16} className={`${isLoading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
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

          <CurrencyHistory history={dayHistory} />
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CurrencyWidget;
