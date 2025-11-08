import React, { useEffect, useState } from 'react';

/**
 * Toast Component
 * Displays notification toasts with auto-dismiss
 */
const Toast = ({ message, type = 'info', onClose, duration = 3000 }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        setIsVisible(false);
        onClose();
      }, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  const typeStyles = {
    success: 'bg-green-500 text-white border-green-600',
    error: 'bg-red-500 text-white border-red-600',
    warning: 'bg-yellow-500 text-white border-yellow-600',
    info: 'bg-blue-500 text-white border-blue-600',
  };

  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️',
  };

  return (
    <div
      className={`fixed top-8 right-8 px-6 py-4 rounded-xl shadow-2xl font-semibold z-50 max-w-md border-l-4 flex items-center gap-3 ${
        typeStyles[type]
      } ${isExiting ? 'animate-slideOut' : 'animate-slideIn'}`}
      role="alert"
      aria-live="polite"
    >
      <span className="text-2xl">{icons[type]}</span>
      <span className="flex-1">{message}</span>
      <button
        onClick={() => {
          setIsExiting(true);
          setTimeout(() => {
            setIsVisible(false);
            onClose();
          }, 300);
        }}
        className="text-white hover:opacity-80 transition-opacity focus-visible-ring rounded"
        aria-label="Close notification"
      >
        ✕
      </button>
    </div>
  );
};

/**
 * ToastContainer Component
 * Manages multiple toasts
 */
export const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-0 right-0 z-50 p-4 space-y-2">
      {toasts.map((toast, index) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};

export default Toast;
