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
import VideoPlayer from '@/components/academy/VideoPlayer';
import { 
  ArrowLeft,
  BookOpen,
  CheckCircle,
  Loader2,
  List,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useCourse } from '@/hooks/useCourse';

interface Module {
  id: string;
  title: string;
  duration: string;
  lessons: Lesson[];
}

interface Lesson {
  id: string;
  title: string;
  duration: string;
  videoUrl: string;
  completed: boolean;
}

const CoursePlayerPage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { course, modules, progress, loading, error } = useCourse(courseId!);
  const [currentModule, setCurrentModule] = useState<Module | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [expandedModules, setExpandedModules] = useState<string[]>([]);

  useEffect(() => {
    // Inicializar com o primeiro módulo e primeira aula
    if (modules.length > 0) {
      setCurrentModule(modules[0]);
      if (modules[0].lessons.length > 0) {
        setCurrentLesson(modules[0].lessons[0]);
      }
      setExpandedModules([modules[0].id]);
    }
  }, [modules]);

  const handleModuleToggle = (moduleId: string) => {
    setExpandedModules(prev => 
      prev.includes(moduleId)
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const handleLessonSelect = (module: Module, lesson: Lesson) => {
    setCurrentModule(module);
    setCurrentLesson(lesson);
  };

  const handleVideoProgress = async (videoProgress: number) => {
    if (!currentLesson) return;

    try {
      await academyService.updateLessonProgress(
        currentLesson.id,
        videoProgress,
        videoProgress === 100
      );

      // Atualizar o estado local da aula
      setModules(prevModules => 
        prevModules.map(module => ({
          ...module,
          lessons: module.lessons.map(lesson => 
            lesson.id === currentLesson.id
              ? { ...lesson, progress: videoProgress, completed: videoProgress === 100 }
              : lesson
          )
        }))
      );

      // Atualizar o progresso geral do curso
      if (courseId) {
        const updatedProgress = await academyService.getCourseProgress(courseId);
        setProgress(updatedProgress);
      }
    } catch (err) {
      console.error('Failed to update progress:', err);
    }
  };

  const handleVideoComplete = async () => {
    if (currentLesson && currentModule) {
      // Encontrar a próxima aula
      const currentModuleIndex = modules.findIndex(m => m.id === currentModule.id);
      const currentLessonIndex = currentModule.lessons.findIndex(l => l.id === currentLesson.id);

      if (currentLessonIndex < currentModule.lessons.length - 1) {
        // Próxima aula no mesmo módulo
        setCurrentLesson(currentModule.lessons[currentLessonIndex + 1]);
      } else if (currentModuleIndex < modules.length - 1) {
        // Primeira aula do próximo módulo
        const nextModule = modules[currentModuleIndex + 1];
        setCurrentModule(nextModule);
        setCurrentLesson(nextModule.lessons[0]);
        setExpandedModules(prev => [...prev, nextModule.id]);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-lg text-gray-300">Carregando aula...</p>
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
          <p className="text-gray-300 mb-4">{error?.message || 'Curso não encontrado'}</p>
          <Button onClick={() => navigate('/academy')} className="bg-blue-600 hover:bg-blue-700">
            Voltar para Academy
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-80 bg-gray-800 border-r border-gray-700 overflow-y-auto">
          <div className="p-4">
            <Button 
              variant="ghost" 
              className="mb-4 text-white hover:text-blue-400"
              onClick={() => navigate(`/academy/${courseId}`)}
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Voltar para o curso
            </Button>

            <h2 className="text-xl font-bold mb-2">{course?.title}</h2>
            <Progress value={progress} className="mb-4" />
            <p className="text-sm text-gray-400 mb-6">{Math.round(progress)}% completo</p>

            <div className="space-y-2">
              {modules.map(module => (
                <div key={module.id} className="border border-gray-700 rounded-lg">
                  <button
                    className="w-full p-3 flex items-center justify-between text-left hover:bg-gray-700/50"
                    onClick={() => handleModuleToggle(module.id)}
                  >
                    <div>
                      <h3 className="font-medium">{module.title}</h3>
                      <p className="text-sm text-gray-400">{module.duration}</p>
                    </div>
                    {expandedModules.includes(module.id) ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </button>

                  {expandedModules.includes(module.id) && (
                    <div className="border-t border-gray-700">
                      {module.lessons.map(lesson => (
                        <button
                          key={lesson.id}
                          className={`w-full p-3 flex items-center gap-2 text-left hover:bg-gray-700/50 ${
                            currentLesson?.id === lesson.id ? 'bg-blue-600/20' : ''
                          }`}
                          onClick={() => handleLessonSelect(module, lesson)}
                        >
                          {lesson.completed ? (
                            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                          ) : (
                            <div className="w-5 h-5 border-2 border-gray-500 rounded-full flex-shrink-0" />
                          )}
                          <div>
                            <p className="font-medium">{lesson.title}</p>
                            <p className="text-sm text-gray-400">{lesson.duration}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          {currentLesson ? (
            <div className="p-6">
              <VideoPlayer
                videoUrl={currentLesson.videoUrl}
                onProgress={handleVideoProgress}
                onComplete={handleVideoComplete}
              />

              <div className="mt-6">
                <h2 className="text-2xl font-bold mb-2">{currentLesson.title}</h2>
                <p className="text-gray-400">{currentModule?.title}</p>
                {currentLesson.description && (
                  <p className="mt-4 text-gray-300">{currentLesson.description}</p>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <BookOpen className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <p className="text-xl text-gray-300">Selecione uma aula para começar</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoursePlayerPage; 