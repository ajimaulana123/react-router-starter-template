import { useState, useEffect } from 'react';

interface ToastProps {
  message: string | null;
  type?: 'success' | 'error';
  onClose: () => void;
  duration?: number;
}

export function Toast({ message, type = 'success', onClose, duration = 3000 }: ToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      // Trigger enter animation
      requestAnimationFrame(() => setVisible(true));
      
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(onClose, 300); // Wait for exit animation
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [message, duration, onClose]);

  if (!message) return null;

  return (
    <div
      className={`
        fixed top-4 right-4 z-[100] flex items-center gap-3 px-5 py-3.5 rounded-[12px] shadow-[0_8px_24px_rgba(0,0,0,0.12)]
        transition-all duration-300 ease-in-out max-w-sm
        ${visible ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'}
        ${type === 'success' 
          ? 'bg-[#D1FAE5] text-[#065F46] border border-[#A7F3D0]' 
          : 'bg-[#FEE2E2] text-[#991B1B] border border-[#FECACA]'
        }
      `}
    >
      <span className="text-lg">{type === 'success' ? '✅' : '⚠️'}</span>
      <span className="text-sm font-medium flex-1">{message}</span>
      <button
        onClick={() => {
          setVisible(false);
          setTimeout(onClose, 300);
        }}
        className="text-sm opacity-60 hover:opacity-100 transition-opacity"
      >
        ✕
      </button>
    </div>
  );
}
