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
import { MessageSquare, Archive, MoreVertical, Plus } from 'lucide-react';
import { useChatHistory } from '@/hooks/useChatHistory';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ChatHistoryItemProps {
  id: string;
  title: string;
  time: string;
  active?: boolean;
  messageCount: number;
  lastMessage: string;
  onSelect: () => void;
  onArchive: () => void;
}

const ChatHistoryItem: React.FC<ChatHistoryItemProps> = ({ 
  title, 
  time, 
  active, 
  messageCount, 
  lastMessage,
  onSelect,
  onArchive
}) => {
  return (
    <div 
      className={`p-3 rounded-lg cursor-pointer transition-all hover:bg-gray-100 ${
        active ? 'bg-blue-50 border-l-4 border-blue-500' : 'bg-white'
      }`}
      onClick={onSelect}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <MessageSquare className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <h3 className="text-sm font-medium text-gray-900 truncate">{title}</h3>
          </div>
          
          {lastMessage && (
            <p className="text-xs text-gray-500 truncate mb-1">
              {lastMessage.length > 40 ? lastMessage.substring(0, 40) + '...' : lastMessage}
            </p>
          )}
          
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">{time}</span>
            {messageCount > 0 && (
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                {messageCount} msg{messageCount !== 1 ? 's' : ''}
              </span>
            )}
          </div>
      </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 ml-2">
              <MoreVertical className="w-3 h-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onArchive}>
              <Archive className="w-4 h-4 mr-2" />
              Arquivar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

const ChatHistory = () => {
  const {
    conversations,
    currentConversation,
    loading,
    error,
    createConversation,
    selectConversation,
    archiveConversation,
  } = useChatHistory();

  const handleNewChat = async () => {
    await createConversation('Nova conversa');
  };

  const formatRelativeTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { 
        addSuffix: true, 
        locale: ptBR 
      });
    } catch {
      return 'há pouco tempo';
    }
  };

  if (loading) {
    return (
      <aside className="w-full h-full p-4 overflow-y-auto bg-gray-50 border-l border-gray-200">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="mb-3">
              <div className="h-16 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-full h-full p-4 overflow-y-auto bg-gray-50 border-l border-gray-200">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-gray-800">Conversas</h2>
          <Button
            onClick={handleNewChat}
            size="sm"
            variant="outline"
            className="h-8 w-8 p-0"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        
        {error && (
          <div className="text-sm text-red-600 bg-red-50 p-2 rounded mb-3">
            {error}
          </div>
        )}
      </div>

      <div className="space-y-2">
        {conversations.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm mb-4">
              Nenhuma conversa ainda
            </p>
            <Button onClick={handleNewChat} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Começar nova conversa
            </Button>
          </div>
        ) : (
          conversations.map((conversation) => (
          <ChatHistoryItem 
              key={conversation.id}
              id={conversation.id}
              title={conversation.title}
              time={formatRelativeTime(conversation.updated_at)}
              messageCount={conversation.message_count || 0}
              lastMessage={conversation.last_message || ''}
              active={currentConversation?.id === conversation.id}
              onSelect={() => selectConversation(conversation)}
              onArchive={() => archiveConversation(conversation.id)}
          />
          ))
        )}
      </div>
    </aside>
  );
};

export default ChatHistory;
