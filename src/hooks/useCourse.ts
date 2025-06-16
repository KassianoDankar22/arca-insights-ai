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
  duration: string; // Changed from number to string to match database
  students_count: number;
  rating: number;
  price: number;
  instructor: string;
  created_at: string;
  status: 'draft' | 'published' | 'archived';
  // Optional fields to handle database mismatch
  category?: string;
  level?: string;
  instructor_name?: string;
  duration_minutes?: number;
  thumbnail_url?: string;
  video_url?: string;
  content?: any;
  tags?: string[];
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
      
      // Map database response to Course interface
      const mappedCourses: Course[] = (data || []).map(item => ({
        id: item.id,
        title: item.title,
        description: item.description || '',
        thumbnail: item.thumbnail_url || '',
        duration: item.duration || '30 min',
        students_count: 0, // Default value since not in database
        rating: 4.5, // Default value since not in database
        price: 0, // Default value since not in database
        instructor: item.instructor || item.instructor_name || 'Instrutor',
        created_at: item.created_at,
        status: 'published' as const,
        category: item.category,
        level: item.level,
        instructor_name: item.instructor_name,
        duration_minutes: item.duration_minutes,
        thumbnail_url: item.thumbnail_url,
        video_url: item.video_url,
        content: item.content,
        tags: item.tags
      }));
      
      setCourses(mappedCourses);
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
      
      // Map single database response to Course interface
      const mappedCourse: Course = {
        id: data.id,
        title: data.title,
        description: data.description || '',
        thumbnail: data.thumbnail_url || '',
        duration: data.duration || '30 min',
        students_count: 0,
        rating: 4.5,
        price: 0,
        instructor: data.instructor || data.instructor_name || 'Instrutor',
        created_at: data.created_at,
        status: 'published' as const,
        category: data.category,
        level: data.level,
        instructor_name: data.instructor_name,
        duration_minutes: data.duration_minutes,
        thumbnail_url: data.thumbnail_url,
        video_url: data.video_url,
        content: data.content,
        tags: data.tags
      };
      
      setCourse(mappedCourse);
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
      
      // Map Course interface to database schema
      const dbData = {
        title: courseData.title!,
        description: courseData.description,
        instructor: courseData.instructor,
        instructor_name: courseData.instructor_name,
        duration: courseData.duration,
        duration_minutes: courseData.duration_minutes,
        thumbnail_url: courseData.thumbnail_url,
        video_url: courseData.video_url,
        category: courseData.category,
        level: courseData.level,
        content: courseData.content,
        tags: courseData.tags
      };
      
      const { data, error: err } = await supabase
        .from('courses')
        .insert([dbData])
        .select()
        .single();

      if (err) throw err;
      
      const mappedCourse: Course = {
        id: data.id,
        title: data.title,
        description: data.description || '',
        thumbnail: data.thumbnail_url || '',
        duration: data.duration || '30 min',
        students_count: 0,
        rating: 4.5,
        price: 0,
        instructor: data.instructor || data.instructor_name || 'Instrutor',
        created_at: data.created_at,
        status: 'published' as const,
        category: data.category,
        level: data.level,
        instructor_name: data.instructor_name,
        duration_minutes: data.duration_minutes,
        thumbnail_url: data.thumbnail_url,
        video_url: data.video_url,
        content: data.content,
        tags: data.tags
      };
      
      setCourses(prev => [mappedCourse, ...prev]);
      return mappedCourse;
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
      
      // Map Course interface to database schema
      const dbData = {
        title: courseData.title,
        description: courseData.description,
        instructor: courseData.instructor,
        instructor_name: courseData.instructor_name,
        duration: courseData.duration,
        duration_minutes: courseData.duration_minutes,
        thumbnail_url: courseData.thumbnail_url,
        video_url: courseData.video_url,
        category: courseData.category,
        level: courseData.level,
        content: courseData.content,
        tags: courseData.tags
      };
      
      const { data, error: err } = await supabase
        .from('courses')
        .update(dbData)
        .eq('id', id)
        .select()
        .single();

      if (err) throw err;
      
      const mappedCourse: Course = {
        id: data.id,
        title: data.title,
        description: data.description || '',
        thumbnail: data.thumbnail_url || '',
        duration: data.duration || '30 min',
        students_count: 0,
        rating: 4.5,
        price: 0,
        instructor: data.instructor || data.instructor_name || 'Instrutor',
        created_at: data.created_at,
        status: 'published' as const,
        category: data.category,
        level: data.level,
        instructor_name: data.instructor_name,
        duration_minutes: data.duration_minutes,
        thumbnail_url: data.thumbnail_url,
        video_url: data.video_url,
        content: data.content,
        tags: data.tags
      };
      
      setCourses(prev => prev.map(c => c.id === id ? mappedCourse : c));
      if (course?.id === id) setCourse(mappedCourse);
      return mappedCourse;
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
