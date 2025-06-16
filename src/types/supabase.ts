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

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      courses: {
        Row: {
          id: string
          title: string
          description: string
          instructor: string
          duration: string
          level: 'Iniciante' | 'Intermediário' | 'Avançado'
          rating: number
          students: number
          thumbnail: string
          category: string
          price: number
          tags: string[]
          isNew: boolean
          isBestseller: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          instructor: string
          duration: string
          level: 'Iniciante' | 'Intermediário' | 'Avançado'
          rating?: number
          students?: number
          thumbnail: string
          category: string
          price: number
          tags?: string[]
          isNew?: boolean
          isBestseller?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          instructor?: string
          duration?: string
          level?: 'Iniciante' | 'Intermediário' | 'Avançado'
          rating?: number
          students?: number
          thumbnail?: string
          category?: string
          price?: number
          tags?: string[]
          isNew?: boolean
          isBestseller?: boolean
          updated_at?: string
        }
      }
      course_modules: {
        Row: {
          id: string
          course_id: string
          title: string
          description: string | null
          duration: string
          order_index: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          course_id: string
          title: string
          description?: string | null
          duration: string
          order_index: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          course_id?: string
          title?: string
          description?: string | null
          duration?: string
          order_index?: number
          updated_at?: string
        }
      }
      course_lessons: {
        Row: {
          id: string
          module_id: string
          title: string
          description: string | null
          duration: string
          video_url: string
          order_index: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          module_id: string
          title: string
          description?: string | null
          duration: string
          video_url: string
          order_index: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          module_id?: string
          title?: string
          description?: string | null
          duration?: string
          video_url?: string
          order_index?: number
          updated_at?: string
        }
      }
      lesson_progress: {
        Row: {
          id: string
          user_id: string
          lesson_id: string
          completed: boolean
          progress: number
          last_watched: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          lesson_id: string
          completed?: boolean
          progress?: number
          last_watched?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          lesson_id?: string
          completed?: boolean
          progress?: number
          last_watched?: string
          updated_at?: string
        }
      }
    }
    Functions: {
      calculate_course_progress: {
        Args: {
          p_course_id: string
          p_user_id: string
        }
        Returns: number
      }
    }
  }
} 