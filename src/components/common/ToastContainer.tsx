import React from 'react';
import { useBlog } from '../../context/BlogContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useBlog();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let Icon = CheckCircle2;
        let borderClass = 'border-[#8C6D53] bg-[#2D2A26] text-[#FAF8F5]';
        let iconColor = 'text-[#C4A482]';

        if (toast.type === 'error') {
          Icon = AlertCircle;
          borderClass = 'border-red-500 bg-stone-900 text-white';
          iconColor = 'text-red-400';
        } else if (toast.type === 'info') {
          Icon = Info;
          borderClass = 'border-stone-400 bg-stone-900 text-stone-100';
          iconColor = 'text-stone-300';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-xl shadow-2xl border flex items-start gap-3 transition-all animate-in slide-in-from-bottom-2 duration-200 ${borderClass}`}
          >
            <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${iconColor}`} />
            <div className="flex-1 text-xs sm:text-sm font-medium leading-snug">
              {toast.message}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-stone-400 hover:text-white p-0.5 shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
