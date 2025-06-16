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


import React, { useState } from 'react';
import { Send, ChevronDown } from 'lucide-react';
import ChatSuggestionCard from './ChatSuggestionCard';
import { BackgroundBeams } from '@/components/ui/background-beams';

const ChatMain = () => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      console.log('Sending message:', message);
      setMessage('');
    }
  };
  
  const suggestions = [
    {
      title: 'Calcular ROI de casa em Orlando',
      onClick: () => console.log('ROI Orlando clicked')
    },
    {
      title: 'Comparar valorização entre bairros',
      onClick: () => console.log('Valorização clicked')
    },
    {
      title: 'Mostrar tendências do mercado em Miami',
      onClick: () => console.log('Tendências Miami clicked')
    },
    {
      title: 'Analisar melhor momento para investir',
      onClick: () => console.log('Momento investir clicked')
    }
  ];

  return (
    <div className="relative flex flex-col items-center justify-center w-full min-h-screen bg-white">
      <BackgroundBeams className="opacity-20" />
      
      <div className="z-10 flex flex-col items-center max-w-2xl px-4 py-10">
        <h1 className="mb-3 text-4xl font-bold text-center">
          Start talking to 🤖 Arca AI Chat
        </h1>
        
        <p className="max-w-lg mb-8 text-center text-gray-600">
          Sua assistente imobiliária inteligente! Precisa de uma análise rápida, sugestões ou um panorama do mercado? A Arca está aqui para ajudar.
        </p>

        <div className="w-full mb-4">
          <div className="relative w-full">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Escreva uma pergunta..."
              className="w-full p-4 pr-12 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-arca-blue focus:border-transparent resize-none min-h-[120px]"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
            <button 
              onClick={handleSend}
              disabled={!message.trim()}
              className="absolute p-2 text-white rounded-full bottom-3 right-3 bg-arca-blue hover:bg-arca-blue/80 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <Send size={18} />
            </button>
          </div>

          <div className="flex items-center justify-between w-full px-1 mt-2 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <span>Modelo: GPT-4</span>
              <ChevronDown size={16} />
            </div>
          </div>
        </div>

        <div className="w-full mt-4">
          <h3 className="mb-3 text-sm font-medium text-gray-500">Sugestões</h3>
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            {suggestions.map((suggestion, index) => (
              <ChatSuggestionCard
                key={index}
                title={suggestion.title}
                onClick={suggestion.onClick}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMain;
