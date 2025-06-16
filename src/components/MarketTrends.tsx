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

/**
 * ========================================
 * ARCA AI - ROI ANALYSIS PLATFORM
 * ========================================
 * 
 * Copyright (c) 2024 JimmyDev
 * All rights reserved.
 * 
 * PROPRIETARY AND CONFIDENTIAL
 * This file contains proprietary code developed by JimmyDev.
 * Unauthorized copying, distribution, or use is strictly prohibited.
 * 
 * Developed by: JimmyDev
 * ========================================
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp } from 'lucide-react';

const MarketTrends: React.FC = () => {
  // Example data for the charts (in dollars)
  const priceData = [
    { month: 'Jan', residential: 350, commercial: 280 },
    { month: 'Feb', residential: 355, commercial: 275 },
    { month: 'Mar', residential: 362, commercial: 290 },
    { month: 'Apr', residential: 368, commercial: 295 },
    { month: 'May', residential: 375, commercial: 300 },
    { month: 'Jun', residential: 382, commercial: 305 },
    { month: 'Jul', residential: 390, commercial: 310 },
    { month: 'Aug', residential: 398, commercial: 315 },
    { month: 'Sep', residential: 405, commercial: 322 },
    { month: 'Oct', residential: 413, commercial: 328 },
    { month: 'Nov', residential: 420, commercial: 334 },
    { month: 'Dec', residential: 428, commercial: 340 },
  ];

  const regionData = [
    { name: 'Orlando', appreciation: 5.3 },
    { name: 'Miami', appreciation: 7.8 },
    { name: 'Tampa', appreciation: 4.5 },
    { name: 'Jacksonville', appreciation: 6.2 },
    { name: 'Naples', appreciation: 8.7 },
  ];

  const marketInsights = [
    {
      title: "Residential Market",
      description: "The residential market continues to show steady growth with an average appreciation of 6.5% over the last 12 months. Two-bedroom properties in central areas have the highest demand."
    },
    {
      title: "Commercial Market",
      description: "Commercial spaces are slowly recovering after the pandemic. There's a trend of appreciation in smaller, more versatile office spaces adapted to hybrid work models."
    },
    {
      title: "Rental Market",
      description: "The residential rental market is hot, with an average occupancy rate above 92%. Demand for furnished properties has increased by 15% in the last six months."
    },
  ];

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 flex items-center">
        <TrendingUp className="mr-2" />
        Market Trends
      </h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Price Evolution per sq.ft</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart 
                  data={priceData} 
                  margin={{ top: 10, right: 30, left: 10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false}
                    tickLine={false}
                    padding={{ left: 10, right: 10 }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    domain={[250, 'dataMax + 20']}
                    padding={{ top: 10, bottom: 10 }}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip 
                    formatter={(value) => [`$${value}/sq.ft`, ""]}
                    labelFormatter={(label) => `Month: ${label}`}
                  />
                  <Legend 
                    wrapperStyle={{ paddingTop: 10 }}
                    iconSize={10}
                    iconType="circle"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="residential" 
                    name="Residential" 
                    stroke="#9b87f5" 
                    strokeWidth={3}
                    dot={true}
                    activeDot={{ r: 6 }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="commercial" 
                    name="Commercial" 
                    stroke="#1EAEDB" 
                    strokeWidth={3}
                    dot={true}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Appreciation by Region (% in 12 months)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={regionData} 
                  margin={{ top: 10, right: 30, left: 10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) => `${value}%`}
                    domain={[0, 10]}
                  />
                  <Tooltip 
                    formatter={(value) => [`${value}%`, "Appreciation"]}
                  />
                  <Legend 
                    wrapperStyle={{ paddingTop: 10 }}
                    iconSize={10}
                    iconType="square"
                  />
                  <Bar 
                    dataKey="appreciation" 
                    name="Appreciation" 
                    fill="#7E69AB" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Market Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {marketInsights.map((insight, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-lg mb-2">{insight.title}</h3>
                <p className="text-gray-600 text-sm">{insight.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 bg-arca-soft-purple p-4 rounded-lg">
            <h3 className="font-medium text-lg mb-2">AI Analysis</h3>
            <p className="text-gray-700">
              Based on current trends, the real estate market is in a phase of moderate growth. Residential properties in Miami and Naples show the best potential for short-term appreciation. For investors with a more conservative risk profile, Orlando continues to be a stable option with consistent demand and lower price volatility.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MarketTrends;
