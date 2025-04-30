
import React from 'react';
import { useEffect, useState } from 'react';

interface WelcomeSectionProps {
  userName?: string;
}

const WelcomeSection: React.FC<WelcomeSectionProps> = ({ userName = 'User' }) => {
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Bom dia');
    else if (hour < 18) setGreeting('Boa tarde');
    else setGreeting('Boa noite');
  }, []);

  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-white">
        {greeting}, <span className="text-arca-blue">{userName}</span>
      </h1>
      <p className="text-white/70 mt-2">
        Bem-vindo ao seu dashboard da ARCA AI. O que gostaria de fazer hoje?
      </p>
    </div>
  );
};

export default WelcomeSection;
