import React from 'react';

interface CourseCardProps {
  title: string;
  description: string;
  imageUrl: string;
  // Poderíamos adicionar mais propriedades depois, como:
  // instructor?: string;
  // duration?: string;
  // progress?: number; // 0 a 100
}

const CourseCard: React.FC<CourseCardProps> = ({ title, description, imageUrl }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-all hover:scale-105 cursor-pointer">
      <div 
        className="w-full h-48 bg-gray-300 bg-cover bg-center"
        style={{ backgroundImage: `url(${imageUrl || '/placeholder-image.jpg'})` }}
      >
        {/* Imagem do curso */}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 text-gray-800 group-hover:text-arca-blue transition-colors">{title}</h3>
        <p className="text-sm text-gray-600">
          {description}
        </p>
        {/* Outras informações como instrutor, duração, etc., podem vir aqui */}
      </div>
    </div>
  );
};

export default CourseCard; 