import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { cn } from '../utils/cn';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col space-y-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              "flex items-center w-80 p-4 rounded-lg shadow-lg border bg-white animate-in slide-in-from-right-8 duration-300",
              t.type === 'success' && "border-emerald-200 text-emerald-800",
              t.type === 'error' && "border-red-200 text-red-800",
              t.type === 'info' && "border-blue-200 text-blue-800"
            )}
          >
            <div className="mr-3">
              {t.type === 'success' && <CheckCircle className="h-5 w-5 text-emerald-500" />}
              {t.type === 'error' && <AlertCircle className="h-5 w-5 text-red-500" />}
              {t.type === 'info' && <Info className="h-5 w-5 text-blue-500" />}
            </div>
            <p className="flex-1 text-sm font-medium">{t.message}</p>
            <button onClick={() => removeToast(t.id)} className="ml-4 text-slate-400 hover:text-slate-600">
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
