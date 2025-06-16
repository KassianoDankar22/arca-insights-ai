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

import { supabase } from '@/lib/supabase';

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration: string;
  level: 'Iniciante' | 'Intermediário' | 'Avançado';
  rating: number;
  students: number;
  thumbnail: string;
  category: string;
  price: number;
  tags: string[];
  isNew: boolean;
  isBestseller: boolean;
  created_at: string;
  updated_at: string;
}

export interface Module {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  duration: string;
  order_index: number;
  lessons: Lesson[];
  created_at: string;
  updated_at: string;
}

export interface Lesson {
  id: string;
  module_id: string;
  title: string;
  description: string | null;
  duration: string;
  video_url: string;
  order_index: number;
  completed: boolean;
  progress: number;
  created_at: string;
  updated_at: string;
}

export interface LessonProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  completed: boolean;
  progress: number;
  last_watched: string;
  created_at: string;
  updated_at: string;
}

export interface CourseProgress {
  id: string;
  user_id: string;
  course_id: string;
  progress: number;
  completed: boolean;
  last_watched: string;
  created_at: string;
  updated_at: string;
}

export interface AcademyStats {
  total_courses: number;
  total_students: number;
  average_rating: number;
  total_instructors: number;
}

export const academyService = {
  async getAllCourses(): Promise<Course[]> {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getCourseById(courseId: string): Promise<Course> {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('id', courseId)
      .single();

    if (error) throw error;
    return data;
  },

  async getCourseModules(courseId: string) {
    const { data, error } = await supabase
      .from('course_modules')
      .select(`
        *,
        course_lessons (
          *,
          lesson_progress (
            completed,
            progress,
            last_watched
          )
        )
      `)
      .eq('course_id', courseId)
      .order('order_index', { ascending: true });

    if (error) throw error;

    // Organizar as aulas por ordem
    const modules = data.map(module => ({
      ...module,
      lessons: module.course_lessons
        .sort((a, b) => a.order_index - b.order_index)
        .map(lesson => ({
          ...lesson,
          completed: lesson.lesson_progress?.[0]?.completed || false,
          progress: lesson.lesson_progress?.[0]?.progress || 0
        }))
    }));

    return modules;
  },

  async updateLessonProgress(lessonId: string, progress: number, completed: boolean = false) {
    const { data: existingProgress, error: fetchError } = await supabase
      .from('lesson_progress')
      .select('*')
      .eq('lesson_id', lessonId)
      .eq('user_id', supabase.auth.getUser().then(({ data }) => data.user?.id))
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;

    if (existingProgress) {
      const { error } = await supabase
        .from('lesson_progress')
        .update({
          progress,
          completed,
          last_watched: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', existingProgress.id);

      if (error) throw error;
    } else {
      const { error } = await supabase
        .from('lesson_progress')
        .insert({
          lesson_id: lessonId,
          user_id: (await supabase.auth.getUser()).data.user?.id,
          progress,
          completed,
          last_watched: new Date().toISOString()
        });

      if (error) throw error;
    }
  },

  async getCourseProgress(courseId: string) {
    const { data, error } = await supabase
      .rpc('calculate_course_progress', {
        p_course_id: courseId,
        p_user_id: (await supabase.auth.getUser()).data.user?.id
      });

    if (error) throw error;
    return data;
  },

  async getAcademyStats(): Promise<AcademyStats> {
    const { data, error } = await supabase
      .rpc('get_academy_stats');

    if (error) throw error;
    return data;
  }
}; 