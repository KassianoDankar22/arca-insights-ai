
import React, { useState } from 'react';
import ChatInterface from '@/components/ChatInterface';
import DataPanel from '@/components/DataPanel';

const HomePage = () => {
  const [showPanel, setShowPanel] = useState(true);
  
  return (
    <div className="flex h-full">
      <div className="flex-1">
        <ChatInterface onTogglePanel={() => setShowPanel(!showPanel)} />
      </div>
      <DataPanel isVisible={showPanel} />
    </div>
  );
};

export default HomePage;
