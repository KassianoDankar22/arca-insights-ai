import React from 'react';
import CourseCard from '@/components/course/CourseCard'; // Importando o novo componente

// Dados de exemplo para os cursos
const sampleCourses = [
  {
    id: '1',
    title: 'Introdução ao Mercado Imobiliário',
    description: 'Aprenda os fundamentos e comece com o pé direito.',
    imageUrl: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1296&q=60',
  },
  {
    id: '2',
    title: 'Técnicas Avançadas de Negociação',
    description: 'Domine a arte de negociar e feche mais negócios.',
    imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1296&q=60',
  },
  {
    id: '3',
    title: 'Marketing Digital para Corretores',
    description: 'Atraia mais clientes usando estratégias digitais.',
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1296&q=60',
  },
  {
    id: '4',
    title: 'Direito Imobiliário Essencial',
    description: 'Entenda os aspectos legais da profissão.',
    imageUrl: 'https://images.unsplash.com/photo-1590102426319-c7526718cd70?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1296&q=60',
  },
];

const AcademyPage = () => {
  return (
    <div className="container mx-auto py-8 px-4 md:px-0">
      <h1 className="text-4xl font-bold text-arca-main mb-10 text-center md:text-left">ARCA Academy</h1>
      
      {/* Seção de Destaque ou Continuar Assistindo (simulando Netflix) */}
      {/* <div className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">Continuar Assistindo</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleCourses.slice(0, 1).map(course => (
            <CourseCard 
              key={course.id} 
              title={course.title} 
              description={course.description} 
              imageUrl={course.imageUrl}
            />
          ))}
        </div>
      </div> */}

      {/* Listagem Principal de Cursos */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">Todos os Cursos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-8">
          {sampleCourses.map(course => (
            <CourseCard 
              key={course.id} 
              title={course.title} 
              description={course.description} 
              imageUrl={course.imageUrl}
            />
          ))}
        </div>
      </div>

    </div>
  );
};

export default AcademyPage; 