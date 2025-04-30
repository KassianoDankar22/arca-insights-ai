
import React from 'react';
import { MessageSquare } from 'lucide-react';

interface ChatHistoryItemProps {
  title: string;
  time: string;
  active?: boolean;
}

const ChatHistoryItem: React.FC<ChatHistoryItemProps> = ({ title, time, active }) => {
  return (
    <div className={`flex items-center p-3 mb-1 rounded-lg cursor-pointer ${active ? 'bg-blue-50' : 'hover:bg-gray-50'}`}>
      <div className={`p-2 mr-3 rounded-lg ${active ? 'bg-blue-100' : 'bg-gray-100'}`}>
        <MessageSquare size={18} className={active ? 'text-arca-blue' : 'text-gray-500'} />
      </div>
      <div className="flex-1">
        <h3 className="text-sm font-medium text-gray-800">{title}</h3>
        <p className="text-xs text-gray-500">{time}</p>
      </div>
    </div>
  );
};

const ChatHistory = () => {
  const conversations = [
    { id: 1, title: 'Nova análise', time: 'Agora', active: true },
    { id: 2, title: 'ROI solicitado', time: 'Há 2 horas' },
    { id: 3, title: 'Tendência do mercado', time: 'Há 1 dia' },
    { id: 4, title: 'Análise de investimento', time: 'Há 2 dias' },
    { id: 5, title: 'Comparativo Miami', time: 'Há 3 dias' },
  ];

  return (
    <aside className="w-full h-full p-4 overflow-y-auto bg-gray-50 border-l border-gray-200">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Conversas</h2>
      </div>
      <div className="space-y-1">
        {conversations.map((convo) => (
          <ChatHistoryItem 
            key={convo.id} 
            title={convo.title} 
            time={convo.time} 
            active={convo.active} 
          />
        ))}
      </div>
    </aside>
  );
};

export default ChatHistory;
