import React, { createContext, useState, useContext } from 'react';

type ToastType = 'info' | 'success' | 'error' | 'warning';

interface ToastState {
  visible: boolean;
  title: string;
  message?: string;
  type: ToastType;
}

interface ToastContextType {
  toast: ToastState;
  showToast: (title: string, message?: string, type?: ToastType) => void;
  hideToast: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toast, setToast] = useState<ToastState>({
    visible: false,
    title: '',
    message: '',
    type: 'info',
  });

  const showToast = (title: string, message = '', type: ToastType = 'info') => {
    setToast({
      visible: true,
      title,
      message,
      type,
    });
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, visible: false }));
  };

  return (
    <ToastContext.Provider value={{ toast, showToast, hideToast }}>
      {children}
    </ToastContext.Provider>
  );
};