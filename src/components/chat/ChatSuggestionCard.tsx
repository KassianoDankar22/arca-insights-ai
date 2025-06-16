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

interface ChatSuggestionCardProps {
  title: string;
  onClick: () => void;
}

const ChatSuggestionCard: React.FC<ChatSuggestionCardProps> = ({ title, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center w-full p-3 text-left transition-all border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm"
    >
      <span className="text-sm text-gray-700">{title}</span>
    </button>
  );
};

export default ChatSuggestionCard;
