
import React from 'react';
import { motion } from 'framer-motion';

const PricingPage: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-white to-blue-50 p-4"
    >
      <div className="max-w-6xl mx-auto pt-8">
        <h1 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-arca-blue to-blue-600 bg-clip-text text-transparent">
          Planos e Preços
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Free Plan */}
          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
            <h3 className="text-lg font-semibold mb-2">Plano Gratuito</h3>
            <div className="text-3xl font-bold mb-4">R$ 0</div>
            <ul className="space-y-2 mb-8">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Até 5 análises de ROI</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Ferramentas básicas</span>
              </li>
              <li className="flex items-start text-gray-500">
                <span className="mr-2">✗</span>
                <span>Acesso ao ARCA AI</span>
              </li>
            </ul>
            <button className="w-full py-2 rounded-md bg-gray-100 text-gray-800 font-medium hover:bg-gray-200 transition-colors">
              Plano Atual
            </button>
          </div>

          {/* Pro Plan */}
          <div className="bg-arca-blue p-8 rounded-xl shadow-lg text-white relative transform scale-105">
            <div className="absolute -top-4 left-0 right-0 text-center">
              <span className="bg-yellow-400 text-gray-800 px-3 py-1 rounded-full text-xs font-semibold">
                MAIS POPULAR
              </span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Plano Pro</h3>
            <div className="text-3xl font-bold mb-4">R$ 49,90 <span className="text-sm font-normal">/mês</span></div>
            <ul className="space-y-2 mb-8">
              <li className="flex items-start">
                <span className="text-green-300 mr-2">✓</span>
                <span>Análises ilimitadas</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-300 mr-2">✓</span>
                <span>Todas as ferramentas</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-300 mr-2">✓</span>
                <span>Acesso ao ARCA AI</span>
              </li>
            </ul>
            <button className="w-full py-2 rounded-md bg-white text-arca-blue font-medium hover:bg-gray-100 transition-colors">
              Escolher Plano
            </button>
          </div>

          {/* Enterprise Plan */}
          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
            <h3 className="text-lg font-semibold mb-2">Plano Empresarial</h3>
            <div className="text-3xl font-bold mb-4">R$ 199,90 <span className="text-sm font-normal">/mês</span></div>
            <ul className="space-y-2 mb-8">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Tudo do plano Pro</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Múltiplos usuários</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Suporte dedicado</span>
              </li>
            </ul>
            <button className="w-full py-2 rounded-md bg-gray-800 text-white font-medium hover:bg-gray-700 transition-colors">
              Fale Conosco
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PricingPage;
