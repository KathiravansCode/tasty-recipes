import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Info, X, AlertTriangle } from 'lucide-react';

const Toast = ({ message, type = 'info', onClose, duration = 4000 }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const config = {
    success: {
      bg: 'from-green-500 to-emerald-600',
      icon: <CheckCircle size={24} />,
      emoji: '✅'
    },
    error: {
      bg: 'from-red-500 to-pink-600',
      icon: <XCircle size={24} />,
      emoji: '❌'
    },
    warning: {
      bg: 'from-yellow-500 to-orange-600',
      icon: <AlertTriangle size={24} />,
      emoji: '⚠️'
    },
    info: {
      bg: 'from-blue-500 to-cyan-600',
      icon: <Info size={24} />,
      emoji: 'ℹ️'
    }
  };

  const { bg, icon, emoji } = config[type] || config.info;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50, x: 100 }}
        animate={{ opacity: 1, y: 0, x: 0 }}
        exit={{ opacity: 0, x: 100 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`fixed top-6 right-6 bg-gradient-to-r ${bg} text-white px-6 py-4 rounded-2xl shadow-2xl z-50 backdrop-blur-sm max-w-md`}
      >
        <div className="flex items-start gap-4">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="flex-shrink-0 mt-0.5"
          >
            {icon}
          </motion.div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">{emoji}</span>
              <p className="font-bold text-lg">
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </p>
            </div>
            <p className="font-medium opacity-90">{message}</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="flex-shrink-0 hover:bg-white/20 rounded-lg p-1.5 transition-all duration-200"
          >
            <X size={20} />
          </motion.button>
        </div>
        
        {/* Progress Bar */}
        <motion.div
          initial={{ scaleX: 1 }}
          animate={{ scaleX: 0 }}
          transition={{ duration: duration / 1000, ease: "linear" }}
          className="absolute bottom-0 left-0 right-0 h-1 bg-white/30 origin-left"
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default Toast;