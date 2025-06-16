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

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useAcademy } from '@/hooks/useAcademy';
import { Course } from '@/services/academyService';
import { 
  Play, 
  Clock, 
  Users, 
  Star, 
  Search, 
  Filter,
  BookOpen,
  Award,
  TrendingUp,
  Home,
  Building,
  Calculator,
  MessageSquare,
  PieChart,
  Briefcase,
  Loader2,
  PlayCircle,
  DollarSign,
  Building2,
  Lightbulb,
  Target,
  GraduationCap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const categories = [
  { name: 'Todos', icon: BookOpen, count: 0 },
  { name: 'Fundamentos', icon: Home, count: 0 },
  { name: 'Vendas', icon: TrendingUp, count: 0 },
  { name: 'Marketing', icon: MessageSquare, count: 0 },
  { name: 'Investimentos', icon: PieChart, count: 0 },
  { name: 'Relacionamento', icon: Users, count: 0 },
  { name: 'Legislação', icon: Briefcase, count: 0 }
];

// Imagens relacionadas a corretores e mercado imobiliário
const brokerImages = [
  'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=250&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=400&h=250&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=400&h=250&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=250&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=400&h=250&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=250&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=400&h=250&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&h=250&fit=crop&crop=center'
];

const AcademyPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const { courses, stats, loading, error } = useAcademy();
  const navigate = useNavigate();
  const [selectedLevel, setSelectedLevel] = useState('Todos');

  // Atualiza as contagens das categorias
  const categoriesWithCounts = categories.map(cat => ({
    ...cat,
    count: cat.name === 'Todos' 
      ? courses.length 
      : courses.filter(course => course.category === cat.name).length
  }));

  const filteredCourses = courses.filter(course => {
    const matchesCategory = selectedCategory === 'Todos' || course.category === selectedCategory;
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = selectedLevel === 'Todos' || course.level === selectedLevel;
    return matchesCategory && matchesSearch && matchesLevel;
  });

  const featuredCourse = courses.find(course => course.isBestseller) || courses[0];

  const handleCourseClick = (courseId: string) => {
    navigate(`/academy/${courseId}`);
  };

  // Função para obter imagem relacionada a corretores
  const getBrokerImage = (index: number) => {
    return brokerImages[index % brokerImages.length];
  };

  const formatPrice = (price: number) => {
    return price === 0 ? 'Gratuito' : `R$ ${price.toLocaleString('pt-BR')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-lg text-gray-300">Carregando cursos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <BookOpen className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Ops! Algo deu errado.</h2>
          <p className="text-gray-300 mb-4">{error.message}</p>
          <Button onClick={() => window.location.reload()} className="bg-blue-600 hover:bg-blue-700">
            Tentar Novamente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <GraduationCap className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">
              ARCA Academy
              </h1>
          </div>
          <p className="text-gray-600">
            Desenvolva suas habilidades em investimentos imobiliários com nossos cursos especializados
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-4 text-center">
            <BookOpen className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">45+</div>
            <div className="text-sm text-gray-600">Cursos Disponíveis</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">8.5K+</div>
            <div className="text-sm text-gray-600">Estudantes Ativos</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Award className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">98%</div>
            <div className="text-sm text-gray-600">Taxa de Satisfação</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Star className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">4.8</div>
            <div className="text-sm text-gray-600">Avaliação Média</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
                placeholder="Buscar cursos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
            />
          </div>
            
            <div className="flex gap-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {categories.map(category => (
                  <option key={category.name} value={category.name}>{category.name}</option>
                ))}
              </select>
              
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {['Todos', 'Iniciante', 'Intermediário', 'Avançado'].map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
      </div>
        </CardContent>
      </Card>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course, index) => (
          <motion.div 
            key={course.id} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <Card 
              className="h-full flex flex-col cursor-pointer hover:shadow-lg transition-shadow duration-300"
              onClick={() => handleCourseClick(course.id)}
            >
                <div className="relative">
                  <img
                  src={getBrokerImage(index)}
          alt={course.title} 
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="absolute top-4 left-4 flex gap-2">
        {course.isNew && (
                    <Badge className="bg-green-500 text-white">Novo</Badge>
                  )}
                  {course.price === 0 && (
                    <Badge className="bg-blue-500 text-white">Gratuito</Badge>
        )}
      </div>
                <div className="absolute top-4 right-4">
                  <Badge variant="outline" className="bg-white">{course.level}</Badge>
                    </div>
                  </div>
              
              <CardContent className="flex-1 flex flex-col p-6">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                    {course.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {course.description}
                  </p>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">{course.rating}</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-sm text-gray-600">{course.students} estudantes</span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
            <span>{course.duration}</span>
          </div>
                    <div className="flex items-center gap-1">
                      <PlayCircle className="w-4 h-4" />
                      <span>{course.students} estudantes</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-auto">
                  <div>
                    <div className="font-semibold text-lg">
                      {formatPrice(course.price)}
                      </div>
                    <div className="text-sm text-gray-600">
                      {course.instructor}
          </div>
        </div>
                  <Button size="sm">
                    {course.price === 0 ? 'Começar' : 'Inscrever-se'}
                  </Button>
            </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
      </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Nenhum curso encontrado
            </h3>
            <p className="text-gray-500">
            Tente ajustar seus filtros ou termo de busca
          </p>
      </div>
      )}
    </div>
  );
};

export default AcademyPage; 