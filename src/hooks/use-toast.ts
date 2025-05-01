
import { useState, useCallback } from 'react';
import { Toaster as Sonner, toast } from "sonner";

type ToastVariant = 'default' | 'destructive' | 'success' | 'warning';

export type ToastProps = {
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
    
    setToasts(prev => [...prev, props]);
  }, []);

  return {
    toasts,
    toast: addToast,
    dismiss: toast.dismiss,
  };
}

export { toast };
