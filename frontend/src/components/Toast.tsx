import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const Toast: React.FC = () => {
  const { toast, hideToast } = useToast();

  useEffect(() => {
    if (toast.visible) {
      const timer = setTimeout(() => {
        hideToast();
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [toast.visible, hideToast]);

  if (!toast.visible) return null;

  const getToastColors = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-green-50 border-green-500 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-500 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-500 text-yellow-800';
      default:
        return 'bg-blue-50 border-blue-500 text-blue-800';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm w-full animate-fade-in">
      <div className={`rounded-lg shadow-md p-4 border-l-4 ${getToastColors()}`}>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="font-medium">{toast.title}</h3>
            {toast.message && <p className="mt-1 text-sm">{toast.message}</p>}
          </div>
          <button 
            onClick={hideToast}
            className="ml-4 inline-flex text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Toast;