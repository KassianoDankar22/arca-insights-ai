import React from 'react';

const FerramentasPage = () => {
  return (
    <div className="container mx-auto p-4 md:p-8 bg-arca-base min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-arca-main">
          Ferramentas
        </h1>
      </div>
      <div className="bg-white rounded-xl shadow-xl p-8">
        <p className="text-lg text-gray-700">
          Bem-vindo à sua seção de Ferramentas. Conteúdo futuro será adicionado aqui.
        </p>
        {/* Aqui podemos listar as diversas ferramentas, como a calculadora de ROI, etc. */}
      </div>
    </div>
  );
};

export default FerramentasPage; 