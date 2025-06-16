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

import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface ChatNotification {
  id: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

export const useLiveChatNotifications = () => {
  const [notifications, setNotifications] = useState<ChatNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Mock data - em produção seria conectado ao Supabase Realtime
  useEffect(() => {
    // Simular notificações chegando
    const mockNotifications = [
      {
        id: '1',
        userId: '1',
        userName: 'Maria Silva',
        message: 'Preciso de ajuda com a análise de ROI',
        timestamp: new Date(),
        read: false
      },
      {
        id: '2',
        userId: '2',
        userName: 'João Santos',
        message: 'Como faço para exportar o relatório?',
        timestamp: new Date(Date.now() - 300000),
        read: false
      }
    ];

    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter(n => !n.read).length);

    // Simular novas mensagens chegando
    const interval = setInterval(() => {
      if (Math.random() > 0.8) { // 20% chance a cada 10 segundos
        const newNotification: ChatNotification = {
          id: Math.random().toString(),
          userId: Math.random().toString(),
          userName: 'Usuário Teste',
          message: 'Nova mensagem de chat',
          timestamp: new Date(),
          read: false
        };

        setNotifications(prev => [newNotification, ...prev]);
        setUnreadCount(prev => prev + 1);

        // Mostrar toast de notificação
        toast.info(`Nova mensagem de ${newNotification.userName}`, {
          description: newNotification.message,
          action: {
            label: 'Ver Chat',
            onClick: () => {
              window.location.href = '/admin/live-chat';
            }
          }
        });
      }
    }, 10000); // A cada 10 segundos

    return () => clearInterval(interval);
  }, []);

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const clearNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotifications
  };
}; 