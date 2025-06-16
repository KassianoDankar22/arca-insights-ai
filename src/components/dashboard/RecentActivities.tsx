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
import { CalendarDays } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Activity {
  id: string;
  title: string;
  date: string;
  type: string;
}

interface RecentActivitiesProps {
  activities?: Activity[];
}

const RecentActivities: React.FC<RecentActivitiesProps> = ({ 
  activities = [
    { id: '1', title: 'Análise de ROI Curto Prazo', date: '2 horas atrás', type: 'roi' },
    { id: '2', title: 'Visualização de Tendências', date: 'Ontem', type: 'trend' },
    { id: '3', title: 'Análise de ROI Longo Prazo', date: '3 dias atrás', type: 'roi' },
  ] 
}) => {
  return (
    <Card className="backdrop-blur-sm bg-white/10 border-white/10 text-white">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-white font-medium text-lg">Atividades Recentes</CardTitle>
        <CalendarDays className="text-arca-blue" size={20} />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center gap-4">
              <div className="w-2 h-2 bg-arca-blue rounded-full"></div>
              <div className="flex-1">
                <p className="text-white font-medium">{activity.title}</p>
                <p className="text-white/60 text-xs">{activity.date}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivities;
