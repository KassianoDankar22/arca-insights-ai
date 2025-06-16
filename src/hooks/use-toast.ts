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


import { useState, useCallback } from 'react';
import { toast } from "sonner";

type ToastVariant = 'default' | 'destructive' | 'success' | 'warning';

export type ToastProps = {
  id?: string;
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
  action?: React.ReactNode;
};

export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const addToast = useCallback((props: ToastProps) => {
    const { variant = 'default', title, description, duration, action } = props;
    
    if (variant === 'destructive') {
      toast.error(title, { 
        description,
        duration,
        action
      });
    } else if (variant === 'success') {
      toast.success(title, { 
        description,
        duration,
        action
      });
    } else if (variant === 'warning') {
      toast.warning(title, { 
        description,
        duration,
        action
      });
    } else {
      toast(title, { 
        description, 
        duration,
        action
      });
    }
    
    // Generate a unique ID if not provided
    const id = props.id || `toast-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    setToasts(prev => [...prev, { ...props, id }]);
  }, []);

  return {
    toasts,
    toast: addToast,
    dismiss: toast.dismiss,
  };
}

export { toast };
