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

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { 
  MessageSquare, 
  Users, 
  Send, 
  Clock, 
  CheckCircle, 
  UserPlus,
  Search,
  Phone,
  Video,
  MoreVertical,
  Paperclip,
  Smile,
  Circle,
  AlertCircle,
  User
} from 'lucide-react';

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderType: 'admin' | 'user';
  message: string;
  timestamp: Date;
  read: boolean;
}

interface ChatSession {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  status: 'waiting' | 'active' | 'closed';
  messages: ChatMessage[];
  startedAt: Date;
  lastActivity: Date;
}

const AdminLiveChat = () => {
  const [selectedChat, setSelectedChat] = useState<ChatSession | null>(null);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Carregar sessões de chat do localStorage
  useEffect(() => {
    const loadChatSessions = () => {
      const storedChats = localStorage.getItem('admin_live_chats');
      if (storedChats) {
        const chats = JSON.parse(storedChats);
        const parsedChats = chats.map((chat: any) => ({
          ...chat,
          startedAt: new Date(chat.startedAt),
          lastActivity: new Date(chat.lastActivity),
          messages: chat.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
        }));
        setChatSessions(parsedChats);
      }
    };

    loadChatSessions();

    // Atualizar a cada 5 segundos para simular tempo real
    const interval = setInterval(loadChatSessions, 5000);
    return () => clearInterval(interval);
  }, []);

  const filteredChats = chatSessions.filter(chat =>
    chat.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chat.userEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting': return 'bg-yellow-500';
      case 'active': return 'bg-green-500';
      case 'closed': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'waiting': return 'Aguardando';
      case 'active': return 'Ativo';
      case 'closed': return 'Encerrado';
      default: return 'Desconhecido';
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    
    if (diffMinutes < 1) return 'agora';
    if (diffMinutes < 60) return `${diffMinutes}m atrás`;
    
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h atrás`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d atrás`;
  };

  const handleSendMessage = () => {
    if (!message.trim() || !selectedChat) return;
    
    const newMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      senderId: 'admin',
      senderName: 'Suporte Arca',
      senderType: 'admin',
      message: message.trim(),
      timestamp: new Date(),
      read: true
    };

    const updatedChat = {
      ...selectedChat,
      messages: [...selectedChat.messages, newMessage],
      status: 'active' as const,
      lastActivity: new Date()
    };

    // Atualizar localStorage
    const allChats = JSON.parse(localStorage.getItem('admin_live_chats') || '[]');
    const chatIndex = allChats.findIndex((chat: ChatSession) => chat.id === selectedChat.id);
    
    if (chatIndex >= 0) {
      allChats[chatIndex] = updatedChat;
      localStorage.setItem('admin_live_chats', JSON.stringify(allChats));
      
      // Também atualizar no localStorage específico do usuário
      localStorage.setItem(`chat_session_${selectedChat.userId}`, JSON.stringify(updatedChat));
    }

    // Atualizar estado local
    setSelectedChat(updatedChat);
    setChatSessions(prev => prev.map(chat => 
      chat.id === selectedChat.id ? updatedChat : chat
    ));
    
    setMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedChat?.messages]);

  const getUnreadCount = (chat: ChatSession) => {
    return chat.messages.filter(msg => msg.senderType === 'user' && !msg.read).length;
  };

  const activeChats = chatSessions.filter(chat => chat.status !== 'closed');
  const waitingChats = chatSessions.filter(chat => chat.status === 'waiting');

  const stats = [
    {
      title: 'Chats Ativos',
      value: activeChats.length,
      icon: MessageSquare,
      color: 'blue'
    },
    {
      title: 'Aguardando Resposta',
      value: waitingChats.length,
      icon: Clock,
      color: 'yellow'
    },
    {
      title: 'Total Hoje',
      value: chatSessions.length,
      icon: Users,
      color: 'green'
    },
    {
      title: 'Mensagens não Lidas',
      value: chatSessions.reduce((acc, chat) => acc + getUnreadCount(chat), 0),
      icon: AlertCircle,
      color: 'red'
    }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Chat ao Vivo - Admin</h1>
          <p className="text-gray-600">Atenda usuários em tempo real</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="px-3 py-1">
            <Circle className="w-2 h-2 fill-green-500 text-green-500 mr-2" />
            Online
          </Badge>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <stat.icon className={`w-8 h-8 text-${stat.color}-500`} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Chat Interface */}
      <div className="grid grid-cols-12 gap-6 h-[600px]">
        {/* Chat Sessions List */}
        <div className="col-span-4">
          <Card className="h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Sessões de Chat</CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Buscar usuários..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-y-auto h-[calc(600px-140px)]">
                {filteredChats.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    <MessageSquare className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>Nenhum chat disponível</p>
                    <p className="text-sm">Os chats aparecerão aqui quando os usuários iniciarem conversas</p>
                  </div>
                ) : (
                  filteredChats
                    .sort((a, b) => b.lastActivity.getTime() - a.lastActivity.getTime())
                    .map((chat) => {
                      const unreadCount = getUnreadCount(chat);
                      const lastMessage = chat.messages[chat.messages.length - 1];
                      
                      return (
                        <div
                          key={chat.id}
                          className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                            selectedChat?.id === chat.id ? 'bg-blue-50 border-blue-200' : ''
                          }`}
                          onClick={() => setSelectedChat(chat)}
                        >
                          <div className="flex items-start gap-3">
                            <div className="relative">
                              <Avatar className="w-10 h-10">
                                <AvatarFallback className="bg-blue-500 text-white">
                                  <User className="w-5 h-5" />
                                </AvatarFallback>
                              </Avatar>
                              <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(chat.status)}`}></div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium text-gray-900 truncate">{chat.userName}</h4>
                                <div className="flex items-center gap-1">
                                  {unreadCount > 0 && (
                                    <Badge variant="destructive" className="px-1.5 py-0.5 text-xs">
                                      {unreadCount}
                                    </Badge>
                                  )}
                                  <span className="text-xs text-gray-500">{formatRelativeTime(chat.lastActivity)}</span>
                                </div>
                              </div>
                              <p className="text-sm text-gray-500 truncate">{chat.userEmail}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="px-1.5 py-0.5 text-xs">
                                  {getStatusText(chat.status)}
                                </Badge>
                                {lastMessage && (
                                  <p className="text-xs text-gray-400 truncate flex-1">
                                    {lastMessage.senderType === 'admin' ? 'Você: ' : ''}
                                    {lastMessage.message}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chat Messages */}
        <div className="col-span-8">
          <Card className="h-full">
            {selectedChat ? (
              <>
                <CardHeader className="border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-blue-500 text-white">
                          <User className="w-5 h-5" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{selectedChat.userName}</h3>
                        <p className="text-sm text-gray-500">{selectedChat.userEmail}</p>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(selectedChat.status)}`}></div>
                          <span className="text-xs text-gray-500">{getStatusText(selectedChat.status)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Phone className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Video className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-0 flex flex-col h-[calc(600px-120px)]">
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {selectedChat.messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.senderType === 'admin' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`flex items-start gap-2 max-w-[70%] ${msg.senderType === 'admin' ? 'flex-row-reverse' : ''}`}>
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className={msg.senderType === 'admin' ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'}>
                              {msg.senderType === 'admin' ? 'A' : <User className="w-4 h-4" />}
                            </AvatarFallback>
                          </Avatar>
                          <div className={`rounded-lg p-3 ${msg.senderType === 'admin' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-900'}`}>
                            <p className="text-sm">{msg.message}</p>
                            <p className={`text-xs mt-1 ${msg.senderType === 'admin' ? 'text-green-100' : 'text-gray-500'}`}>
                              {formatTime(msg.timestamp)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  {selectedChat.status !== 'closed' && (
                    <div className="border-t p-4">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" className="px-2">
                          <Paperclip className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="px-2">
                          <Smile className="w-4 h-4" />
                        </Button>
                        <Input
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="Digite sua mensagem..."
                          className="flex-1"
                        />
                        <Button 
                          onClick={handleSendMessage}
                          disabled={!message.trim()}
                          className="bg-green-500 hover:bg-green-600"
                        >
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </>
            ) : (
              <CardContent className="h-full flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium mb-2">Selecione um chat</h3>
                  <p>Escolha uma conversa na lista para começar a responder</p>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminLiveChat; 