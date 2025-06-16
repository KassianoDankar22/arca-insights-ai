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

import { useState, useEffect } from 'react';
import { academyService, Course, Module } from '@/services/academyService';

interface AcademyStats {
  total_courses: number;
  total_students: number;
  average_rating: number;
  total_instructors: number;
}

export function useAcademy() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [stats, setStats] = useState<AcademyStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const data = await academyService.getAllCourses();
      setCourses(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load courses'));
    } finally {
      setLoading(false);
    }
  };

  return {
    courses,
    stats,
    loading,
    error,
    loadCourses
  };
}

export function useCourse(courseId: string) {
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadCourseData();
  }, [courseId]);

  const loadCourseData = async () => {
    try {
      setLoading(true);
      if (!courseId) throw new Error('Course ID is required');

      // Carregar dados do curso
      const courseData = await academyService.getCourseById(courseId);
      setCourse(courseData);

      // Carregar módulos e aulas
      const modulesData = await academyService.getCourseModules(courseId);
      setModules(modulesData);

      // Carregar progresso geral do curso
      const progressData = await academyService.getCourseProgress(courseId);
      setProgress(progressData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load course'));
    } finally {
      setLoading(false);
    }
  };

  return {
    course,
    modules,
    progress,
    loading,
    error,
    loadCourseData
  };
} 