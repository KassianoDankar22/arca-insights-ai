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
import { supabase } from '@/lib/supabase';

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: number;
  students_count: number;
  rating: number;
  price: number;
  instructor: string;
  created_at: string;
  status: 'draft' | 'published' | 'archived';
}

export const useCourse = (courseId?: string) => {
  const [course, setCourse] = useState<Course | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const { data, error: err } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });

      if (err) throw err;
      setCourses(data || []);
    } catch (err) {
      setError('Erro ao carregar cursos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourse = async (id: string) => {
    try {
      setLoading(true);
      const { data, error: err } = await supabase
        .from('courses')
        .select('*')
        .eq('id', id)
        .single();

      if (err) throw err;
      setCourse(data);
    } catch (err) {
      setError('Erro ao carregar curso');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createCourse = async (courseData: Partial<Course>) => {
    try {
      setLoading(true);
      const { data, error: err } = await supabase
        .from('courses')
        .insert([courseData])
        .select()
        .single();

      if (err) throw err;
      setCourses(prev => [data, ...prev]);
      return data;
    } catch (err) {
      setError('Erro ao criar curso');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateCourse = async (id: string, courseData: Partial<Course>) => {
    try {
      setLoading(true);
      const { data, error: err } = await supabase
        .from('courses')
        .update(courseData)
        .eq('id', id)
        .select()
        .single();

      if (err) throw err;
      setCourses(prev => prev.map(c => c.id === id ? data : c));
      if (course?.id === id) setCourse(data);
      return data;
    } catch (err) {
      setError('Erro ao atualizar curso');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (courseId) {
      fetchCourse(courseId);
    } else {
      fetchCourses();
    }
  }, [courseId]);

  return {
    course,
    courses,
    loading,
    error,
    createCourse,
    updateCourse,
    refetchCourses: fetchCourses
  };
}; 