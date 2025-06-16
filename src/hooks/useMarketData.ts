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

import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface MarketTrend {
  id: string;
  title: string;
  description: string;
  percentage: number;
  timeframe: string;
  category: 'growth' | 'decline' | 'stable';
  impact: string;
  updated_at: string;
}

export interface MarketInsight {
  id: string;
  title: string;
  description: string;
  type: 'opportunity' | 'risk' | 'trend';
  priority: string;
  data_source: string;
  created_at: string;
  updated_at: string;
}

export interface InvestorTip {
  id: string;
  title: string;
  description: string;
  category: 'location' | 'financing' | 'timing' | 'strategy';
  difficulty: string;
  time_to_implement: string;
  estimated_savings: number;
  created_at: string;
}

export interface PropertyMarketData {
  id: string;
  location: string;
  average_price: number;
  price_change_percent: number;
  average_rent: number;
  rent_change_percent: number;
  occupancy_rate: number;
  cap_rate: number;
  roi: number;
  updated_at: string;
}

export interface MarketReport {
  id: string;
  title: string;
  summary: string;
  full_text: string;
  author: string;
  publication_date: string;
  source: string;
  url: string;
  category: string;
  tags: string[];
}

export const useMarketData = () => {
  const [trends, setTrends] = useState<MarketTrend[]>([]);
  const [insights, setInsights] = useState<MarketInsight[]>([]);
  const [tips, setTips] = useState<InvestorTip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMarketData();
  }, []);

  const loadMarketData = async () => {
    try {
      setLoading(true);
      
      // Load market trends, insights, and tips in parallel
      const [trendsResult, insightsResult, tipsResult] = await Promise.all([
        supabase.from('market_trends').select('*'),
        supabase.from('market_insights').select('*'),
        supabase.from('investor_tips').select('*')
      ]);

      if (trendsResult.error) throw trendsResult.error;
      if (insightsResult.error) throw insightsResult.error;
      if (tipsResult.error) throw tipsResult.error;

      // Map the data with proper type checking
      const mappedTrends: MarketTrend[] = (trendsResult.data || []).map(item => ({
        id: item.id,
        title: item.title,
        description: item.description || '',
        percentage: item.percentage || 0,
        timeframe: item.timeframe || '',
        category: ['growth', 'decline', 'stable'].includes(item.category) 
          ? item.category as 'growth' | 'decline' | 'stable' 
          : 'stable',
        impact: item.impact || '',
        updated_at: item.updated_at
      }));

      const mappedInsights: MarketInsight[] = (insightsResult.data || []).map(item => ({
        id: item.id,
        title: item.title,
        description: item.description || '',
        type: ['opportunity', 'risk', 'trend'].includes(item.type) 
          ? item.type as 'opportunity' | 'risk' | 'trend' 
          : 'trend',
        priority: item.priority || '',
        data_source: item.data_source || '',
        created_at: item.created_at,
        updated_at: item.updated_at
      }));

      const mappedTips: InvestorTip[] = (tipsResult.data || []).map(item => ({
        id: item.id,
        title: item.title,
        description: item.description || '',
        category: ['location', 'financing', 'timing', 'strategy'].includes(item.category) 
          ? item.category as 'location' | 'financing' | 'timing' | 'strategy' 
          : 'strategy',
        difficulty: item.difficulty || '',
        time_to_implement: item.time_to_implement || '',
        estimated_savings: item.estimated_savings || 0,
        created_at: item.created_at
      }));

      setTrends(mappedTrends);
      setInsights(mappedInsights);
      setTips(mappedTips);

    } catch (err) {
      setError('Erro ao carregar dados do mercado');
      console.error('Error loading market data:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    trends,
    insights,
    tips,
    loading,
    error,
    refresh: loadMarketData
  };
};
