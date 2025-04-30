
import React, { useState } from 'react';
import ChatMain from '@/components/chat/ChatMain';
import ChatHistory from '@/components/chat/ChatHistory';

const ChatPage = () => {
  const [showHistory, setShowHistory] = useState(true);

  return (
    <div className="flex w-full h-full bg-white">
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <ChatMain />
        </div>
        {showHistory && (
          <div className="hidden w-80 md:block">
            <ChatHistory />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
