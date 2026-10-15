import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="mx-toast-container" role="region" aria-live="polite">
        {toasts.map((toast) => {
          const icons = {
            success: <CheckCircle2 size={18} className="mx-toast__icon mx-toast__icon--success" />,
            error: <AlertCircle size={18} className="mx-toast__icon mx-toast__icon--error" />,
            info: <Info size={18} className="mx-toast__icon mx-toast__icon--info" />
          };

          return (
            <div key={toast.id} className={`mx-toast mx-toast--${toast.type}`}>
              {icons[toast.type] || icons.info}
              <div className="mx-toast__content">{toast.message}</div>
              <button
                className="mx-toast__close"
                onClick={() => removeToast(toast.id)}
                aria-label="إغلاق التنبيه"
              >
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
