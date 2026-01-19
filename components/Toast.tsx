
import React, { useEffect } from 'react';

export type ToastType = 'info' | 'success' | 'error' | 'warning';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose, duration = 4000 }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const getIcon = () => {
    switch (type) {
      case 'success': return 'check_circle';
      case 'error': return 'error';
      case 'warning': return 'warning';
      default: return 'info';
    }
  };

  const getColor = () => {
    switch (type) {
      case 'success': return 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400';
      case 'error': return 'bg-damage-red/10 border-damage-red/40 text-damage-red';
      case 'warning': return 'bg-amber-500/10 border-amber-500/40 text-amber-500';
      default: return 'bg-primary/10 border-primary/40 text-primary';
    }
  };

  return (
    <div className={`fixed top-12 left-1/2 -translate-x-1/2 z-[300] flex items-center gap-3 px-6 py-4 rounded-2xl border backdrop-blur-md shadow-2xl animate-fadeIn ${getColor()}`}>
      <span className="material-symbols-outlined">{getIcon()}</span>
      <p className="text-xs font-black uppercase tracking-widest italic">{message}</p>
      <button onClick={onClose} className="ml-2 opacity-40 hover:opacity-100">
        <span className="material-symbols-outlined text-sm">close</span>
      </button>
    </div>
  );
};

export default Toast;
