
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { CurrencyResponse } from '@/types/currency';

export interface CurrencyState {
  dollarRate: number | null;
  previousRate: number | null;
  percentChange: number | null;
  absoluteChange: number | null;
  weeklyHigh: number | null;
  weeklyLow: number | null;
  isLoading: boolean;
  lastUpdate: string;
}

export const useCurrencyData = () => {
  const [state, setState] = useState<CurrencyState>({
    dollarRate: null,
    previousRate: null,
    percentChange: null,
    absoluteChange: null,
    weeklyHigh: null,
    weeklyLow: null,
    isLoading: true,
    lastUpdate: '',
  });

  const fetchDollarRate = useCallback(async () => {
    setState(prevState => ({ ...prevState, isLoading: true }));
    
    try {
      const response = await axios.get<CurrencyResponse>('https://economia.awesomeapi.com.br/json/last/USD-BRL');
      
      if (response.data && response.data.USDBRL) {
        const data = response.data.USDBRL;
        const newRate = parseFloat(data.bid);
        
        setState(prevState => {
          // Save previous rate and calculate changes
          const updatedState: CurrencyState = { 
            ...prevState,
            dollarRate: newRate,
            isLoading: false,
            lastUpdate: new Date(data.create_date).toLocaleTimeString()
          };
          
          // Process previous rate if it exists
          if (prevState.dollarRate !== null) {
            updatedState.previousRate = prevState.dollarRate;
            updatedState.percentChange = parseFloat(data.pctChange);
            updatedState.absoluteChange = newRate - prevState.dollarRate;
          }
          
          // Update weekly high/low tracking
          const highValue = parseFloat(data.high);
          const lowValue = parseFloat(data.low);
          
          if (!prevState.weeklyHigh || highValue > prevState.weeklyHigh) {
            updatedState.weeklyHigh = highValue;
          } else {
            updatedState.weeklyHigh = prevState.weeklyHigh;
          }
          
          if (!prevState.weeklyLow || lowValue < prevState.weeklyLow) {
            updatedState.weeklyLow = lowValue;
          } else {
            updatedState.weeklyLow = prevState.weeklyLow;
          }
          
          return updatedState;
        });
      }
    } catch (error) {
      console.error('Error fetching dollar rate:', error);
      setState(prevState => ({ ...prevState, isLoading: false }));
    }
  }, []);

  useEffect(() => {
    fetchDollarRate();
    
    // Set up polling every 5 minutes
    const intervalId = setInterval(fetchDollarRate, 300000);
    
    return () => clearInterval(intervalId);
  }, [fetchDollarRate]);

  return { ...state, fetchDollarRate };
};
