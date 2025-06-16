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
import { useEffect, useState } from 'react';

interface WelcomeSectionProps {
  userName?: string;
  gender?: 'male' | 'female';
}

const WelcomeSection: React.FC<WelcomeSectionProps> = ({ 
  userName = 'Juliana Lengler',
  gender = 'female' 
}) => {
  const [greeting, setGreeting] = useState('');
  const [welcomeText, setWelcomeText] = useState('');

  useEffect(() => {
    // Set time-based greeting
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Bom dia');
    else if (hour < 18) setGreeting('Boa tarde');
    else setGreeting('Boa noite');
    
    // Set gender-based welcome text
    const genderSpecificWelcome = gender === 'female' ? 'Bem-vinda' : 'Bem-vindo';
    setWelcomeText(`${genderSpecificWelcome} à ARCA sua plataforma inteligente de análise imobiliária.`);
  }, [gender]);

  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-white">
        {greeting}, <span className="text-arca-blue">{userName}</span>
      </h1>
      <p className="text-white/70 mt-2">
        {welcomeText}
      </p>
    </div>
  );
};

export default WelcomeSection;
