import React, { useEffect } from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

const Toast = ({ message, type = 'info', onClose, duration = 4000 }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const config = {
    success: {
      bg: 'bg-gradient-to-r from-green-500 to-emerald-500',
      icon: <CheckCircle size={24} />
    },
    error: {
      bg: 'bg-gradient-to-r from-red-500 to-pink-500',
      icon: <XCircle size={24} />
    },
    info: {
      bg: 'bg-gradient-to-r from-blue-500 to-cyan-500',
      icon: <Info size={24} />
    }
  };

  const { bg, icon } = config[type] || config.info;

  return (
    <div className={`fixed top-4 right-4 ${bg} text-white px-6 py-4 rounded-xl shadow-2xl z-50 animate-slide-in backdrop-blur-sm bg-opacity-95 max-w-md`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {icon}
        </div>
        <div className="flex-1">
          <p className="font-medium">{message}</p>
        </div>
        <button 
          onClick={onClose}
          className="flex-shrink-0 hover:bg-white hover:bg-opacity-20 rounded-lg p-1 transition-all duration-200"
        >
          <X size={20} />
        </button>
      </div>
      <div className="mt-2 h-1 bg-white bg-opacity-30 rounded-full overflow-hidden">
        <div 
          className="h-full bg-white animate-progress"
          style={{
            animation: `progress ${duration}ms linear`
          }}
        />
      </div>
      <style jsx>{`
        @keyframes progress {
          from { width: 100%; }
          to { width: 0%; }
        }
        .animate-progress {
          animation: progress ${duration}ms linear;
        }
      `}</style>
    </div>
  );
};

export default Toast;