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
import { 
  MessageSquare, 
  Send, 
  Clock, 
  Phone, 
  Mail, 
  User,
  CheckCircle,
  AlertCircle,
  Minimize2,
  Maximize2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/lib/auth';

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

const ChatLivePage: React.FC = () => {
  const { user } = useAuth();
  const [chatSession, setChatSession] = useState<ChatSession | null>(null);
  const [message, setMessage] = useState('');
  const [isOnline] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Simular checagem de status do suporte
  const [supportStatus] = useState({
    available: true,
    averageResponseTime: '2-5 minutos',
    agentsOnline: 3
  });

  // Simular carregamento de sessão existente
  useEffect(() => {
    if (user) {
      const existingSession = localStorage.getItem(`chat_session_${user.id}`);
      if (existingSession) {
        const session = JSON.parse(existingSession);
        // Converter strings de data de volta para objetos Date
        session.startedAt = new Date(session.startedAt);
        session.lastActivity = new Date(session.lastActivity);
        session.messages = session.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setChatSession(session);
      }
    }
  }, [user]);

  // Auto-scroll para a última mensagem
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatSession?.messages]);

  // Simular polling para novas mensagens do admin (em produção seria Supabase Realtime)
  useEffect(() => {
    if (!chatSession || chatSession.status === 'closed') return;

    const interval = setInterval(() => {
      // Simular recebimento de mensagem do admin
      const randomResponse = Math.random();
      if (randomResponse < 0.02) { // 2% de chance a cada segundo
        handleReceiveAdminMessage("Obrigado por entrar em contato! Como posso ajudá-lo hoje?");
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [chatSession]);

  const startNewChat = () => {
    if (!user) return;

    const newSession: ChatSession = {
      id: `chat_${Date.now()}`,
      userId: user.id,
      userName: user.email?.split('@')[0] || 'Usuário',
      userEmail: user.email || '',
      status: 'waiting',
      messages: [],
      startedAt: new Date(),
      lastActivity: new Date()
    };

    setChatSession(newSession);
    saveSessionToStorage(newSession);

    // Enviar mensagem automática de boas-vindas
    setTimeout(() => {
      const welcomeMessage: ChatMessage = {
        id: `msg_${Date.now()}`,
        senderId: 'system',
        senderName: 'Sistema',
        senderType: 'admin',
        message: 'Olá! Você iniciou um chat com nosso suporte. Um de nossos agentes responderá em breve.',
        timestamp: new Date(),
        read: true
      };
      
      const updatedSession = {
        ...newSession,
        messages: [welcomeMessage],
        lastActivity: new Date()
      };
      
      setChatSession(updatedSession);
      saveSessionToStorage(updatedSession);
    }, 1000);
  };

  const handleSendMessage = () => {
    if (!message.trim() || !chatSession || !user) return;

    const newMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      senderId: user.id,
      senderName: chatSession.userName,
      senderType: 'user',
      message: message.trim(),
      timestamp: new Date(),
      read: false
    };

    const updatedSession = {
      ...chatSession,
      messages: [...chatSession.messages, newMessage],
      status: 'active' as const,
      lastActivity: new Date()
    };

    setChatSession(updatedSession);
    saveSessionToStorage(updatedSession);
    setMessage('');

    // Simular resposta automática em alguns casos
    if (message.toLowerCase().includes('olá') || message.toLowerCase().includes('oi')) {
      setTimeout(() => {
        handleReceiveAdminMessage("Olá! Como posso ajudá-lo hoje?");
      }, 2000);
    }
  };

  const handleReceiveAdminMessage = (messageText: string) => {
    if (!chatSession) return;

    const adminMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      senderId: 'admin',
      senderName: 'Suporte Arca',
      senderType: 'admin',
      message: messageText,
      timestamp: new Date(),
      read: true
    };

    const updatedSession = {
      ...chatSession,
      messages: [...chatSession.messages, adminMessage],
      status: 'active' as const,
      lastActivity: new Date()
    };

    setChatSession(updatedSession);
    saveSessionToStorage(updatedSession);
  };

  const closeChat = () => {
    if (!chatSession) return;

    const closedSession = {
      ...chatSession,
      status: 'closed' as const,
      lastActivity: new Date()
    };

    setChatSession(closedSession);
    saveSessionToStorage(closedSession);
  };

  const saveSessionToStorage = (session: ChatSession) => {
    localStorage.setItem(`chat_session_${session.userId}`, JSON.stringify(session));
    
    // Também salvar na lista global de chats para o admin
    const allChats = JSON.parse(localStorage.getItem('admin_live_chats') || '[]');
    const existingIndex = allChats.findIndex((chat: ChatSession) => chat.id === session.id);
    
    if (existingIndex >= 0) {
      allChats[existingIndex] = session;
    } else {
      allChats.push(session);
    }
    
    localStorage.setItem('admin_live_chats', JSON.stringify(allChats));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <CardTitle>Acesso Necessário</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-4">
              Você precisa estar logado para usar o chat ao vivo.
            </p>
            <Button onClick={() => window.location.href = '/login'}>
              Fazer Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        {!chatSession ? (
          // Tela inicial para iniciar chat
          <div className="space-y-6">
            {/* Header */}
            <div className="text-center py-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Chat ao Vivo - Suporte Técnico
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Fale diretamente com nossa equipe de suporte especializada.
                Estamos aqui para ajudar você a aproveitar ao máximo a plataforma Arca Insights.
              </p>
            </div>

            {/* Status do Suporte */}
            <Card className="border-2">
              <CardHeader className="text-center">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
                  <Badge variant={isOnline ? "default" : "secondary"} className="text-sm">
                    {isOnline ? 'ONLINE' : 'OFFLINE'}
                  </Badge>
                </div>
                <CardTitle className="text-2xl">
                  {isOnline ? 'Suporte Disponível' : 'Suporte Indisponível'}
                </CardTitle>
                <CardDescription>
                  {supportStatus.agentsOnline} agente(s) online • Resposta média: {supportStatus.averageResponseTime}
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-6">
                <Button 
                  onClick={startNewChat}
                  size="lg"
                  className="h-16 text-lg bg-arca-main hover:bg-arca-dark text-white w-full max-w-md"
                >
                  <MessageSquare className="w-6 h-6 mr-3" />
                  Iniciar Chat ao Vivo
                </Button>
                
                <div className="grid md:grid-cols-2 gap-4 max-w-md mx-auto">
                  <Button 
                    variant="outline" 
                    className="h-12"
                    onClick={() => window.location.href = 'mailto:suporte@arcainsights.com'}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    E-mail
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-12"
                    onClick={() => {
                      const phone = "5521999999999";
                      const message = encodeURIComponent("Olá! Preciso de ajuda com a plataforma Arca Insights.");
                      window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
                    }}
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    WhatsApp
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Horários */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Horários de Atendimento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="font-medium text-gray-700">Segunda a Sexta</span>
                    <span className="text-gray-600">8:00 - 18:00</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="font-medium text-gray-700">Sábados</span>
                    <span className="text-gray-600">9:00 - 13:00</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="font-medium text-gray-700">Domingos</span>
                    <span className="text-gray-600">Fechado</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          // Interface de chat ativo
          <Card className={`w-full transition-all duration-300 ${isMinimized ? 'h-16' : 'h-[600px]'}`}>
            <CardHeader className="flex flex-row items-center justify-between py-3 px-4 border-b">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <div>
                  <h3 className="font-semibold">Chat ao Vivo</h3>
                  <p className="text-sm text-gray-500">
                    {chatSession.status === 'waiting' ? 'Aguardando agente...' : 
                     chatSession.status === 'active' ? 'Conectado com suporte' : 'Chat encerrado'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setIsMinimized(!isMinimized)}
                >
                  {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                </Button>
                {chatSession.status !== 'closed' && (
                  <Button variant="ghost" size="sm" onClick={closeChat}>
                    ✕
                  </Button>
                )}
              </div>
            </CardHeader>

            {!isMinimized && (
              <CardContent className="p-0 flex flex-col h-[calc(600px-80px)]">
                {/* Área de mensagens */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {chatSession.messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.senderType === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex items-start gap-2 max-w-[70%] ${msg.senderType === 'user' ? 'flex-row-reverse' : ''}`}>
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className={msg.senderType === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-500 text-white'}>
                            {msg.senderType === 'user' ? <User className="w-4 h-4" /> : 'A'}
                          </AvatarFallback>
                        </Avatar>
                        <div className={`rounded-lg p-3 ${msg.senderType === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-900'}`}>
                          <p className="text-sm">{msg.message}</p>
                          <p className={`text-xs mt-1 ${msg.senderType === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                            {formatTime(msg.timestamp)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="flex items-center gap-2">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-gray-500 text-white">A</AvatarFallback>
                        </Avatar>
                        <div className="bg-gray-100 rounded-lg p-3">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Campo de entrada */}
                {chatSession.status !== 'closed' && (
                  <div className="border-t p-4">
                    <div className="flex gap-2">
                      <Input
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Digite sua mensagem..."
                        className="flex-1"
                        disabled={chatSession.status === 'closed'}
                      />
                      <Button 
                        type="submit" 
                        size="icon"
                        className="bg-arca-main hover:bg-arca-dark"
                        disabled={!message.trim() || chatSession.status === 'closed'}
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            )}
          </Card>
        )}
      </div>
    </div>
  );
};

export default ChatLivePage; 