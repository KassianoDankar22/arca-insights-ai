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

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { academyService } from '@/services/academyService';
import { Course } from '@/services/academyService';
import { 
  Play, 
  Clock, 
  Users, 
  Star, 
  ArrowLeft,
  BookOpen,
  Award,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { useCourse } from '@/hooks/useCourse';

// Imagens relacionadas a corretores e mercado imobiliário
const brokerImages = [
  'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=400&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&h=400&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&h=400&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=400&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=800&h=400&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=400&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=800&h=400&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&h=400&fit=crop&crop=center'
];

const CourseDetailPage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { course, modules, progress, loading, error } = useCourse(courseId!);

  // Função para obter imagem relacionada a corretores
  const getBrokerImage = (index: number = 0) => {
    return brokerImages[index % brokerImages.length];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-lg text-gray-300">Carregando curso...</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <BookOpen className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Ops! Algo deu errado.</h2>
          <p className="text-gray-300 mb-4">{typeof error === 'string' ? error : 'Curso não encontrado'}</p>
          <Button onClick={() => navigate('/academy')} className="bg-blue-600 hover:bg-blue-700">
            Voltar para Academy
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Hero Section */}
      <div className="relative h-[60vh] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.8), rgba(0,0,0,0.3)), url(${getBrokerImage(0)})`
          }}
        />
        <div className="relative z-10 flex items-center h-full max-w-7xl mx-auto px-6">
          <div className="max-w-2xl">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Button 
                variant="ghost" 
                className="mb-4 text-white hover:text-blue-400"
                onClick={() => navigate('/academy')}
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Voltar para Academy
              </Button>

              <div className="flex items-center gap-4 mb-4">
                <Badge className="bg-red-600 hover:bg-red-700">
                  {course.isBestseller ? 'BESTSELLER' : 'DESTAQUE'}
                </Badge>
                <Badge variant="outline" className="border-white text-white">
                  {course.level}
                </Badge>
              </div>

              <h1 className="text-5xl font-bold mb-4 leading-tight">
                {course.title}
              </h1>

              <p className="text-xl text-gray-200 mb-6 leading-relaxed">
                {course.description}
              </p>

              <div className="flex items-center gap-6 mb-8 text-sm">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span>{course.rating}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span>{(course.students || 0).toLocaleString()} alunos</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>{course.duration}</span>
                </div>
              </div>

              <div className="flex gap-4">
                <Button size="lg" className="bg-white text-black hover:bg-gray-200 font-semibold" onClick={() => navigate(`/academy/${courseId}/player`)}>
                  <Play className="w-5 h-5 mr-2" />
                  Continuar Curso
                </Button>
                {progress > 0 && (
                  <div className="flex items-center gap-2">
                    <Progress value={progress} className="w-32" />
                    <span className="text-sm text-gray-300">{progress}%</span>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">O que você vai aprender</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {modules && modules.slice(0, 6).map((module, index) => (
                  <div key={module.id} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                    <span className="text-gray-300">{module.title}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Conteúdo do curso</h2>
              <div className="space-y-4">
                {modules && modules.map((module, index) => (
                  <Card key={module.id} className="bg-gray-800 border-gray-700">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-lg">{module.title}</h3>
                        <Badge variant="secondary" className="bg-gray-700 text-gray-300">
                          {module.duration}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-400 mt-2">{module.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          <div>
            <Card className="bg-gray-800 border-gray-700 sticky top-4">
              <CardContent className="p-6">
                <Button 
                  className="w-full mb-4 bg-blue-600 hover:bg-blue-700 text-lg py-3"
                  onClick={() => navigate(`/academy/${courseId}/player`)}
                >
                  <Play className="w-5 h-5 mr-2" />
                  Começar Agora
                </Button>

                <div className="space-y-4 text-sm text-gray-300">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    <span>{course.duration} de conteúdo</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    <span>Acesso vitalício</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    <span>Certificado de conclusão</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    <span>{(course.students || 0).toLocaleString()} alunos matriculados</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage; 