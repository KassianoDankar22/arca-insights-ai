
import React from 'react';
import { motion } from 'framer-motion';

const DashboardHeader: React.FC = () => {
  // User information
  const userName = "Juliana Lengler"; 
  const userGender = "female";

  return (
    <motion.div 
      className="mb-8"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-1">
            {/* Dynamic greeting with gradient text */}
            <span className="bg-gradient-to-r from-arca-blue to-arca-sky-blue bg-clip-text text-transparent">
              {(() => {
                const hour = new Date().getHours();
                if (hour < 12) return 'Bom dia';
                else if (hour < 18) return 'Boa tarde';
                else return 'Boa noite';
              })()}, {userName}
            </span>
          </h1>
          <p className="text-gray-600">
            {/* Gender-specific welcome message */}
            {userGender === 'female' ? 'Bem-vinda' : 'Bem-vindo'} à ARCA sua plataforma inteligente de análise imobiliária.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardHeader;
