import React from 'react';
import { motion } from 'framer-motion';

const Input = ({ label, error, className = '', icon, ...props }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="mb-6"
  >
    {label && (
      <label className="block text-gray-700 font-semibold mb-3 text-sm tracking-wide">
        {label}
      </label>
    )}
    <div className="relative group">
      {icon && (
        <motion.div
          whileHover={{ scale: 1.1 }}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-purple-600 transition-colors duration-300"
        >
          {icon}
        </motion.div>
      )}
      <input
        className={`
          w-full ${icon ? 'pl-12' : ''} px-5 py-4
          border-2 border-gray-200 rounded-2xl
          focus:border-purple-600 focus:ring-4 focus:ring-purple-100
          outline-none transition-all duration-300
          glass-card hover:border-gray-300
          text-gray-800 placeholder-gray-400
          ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-100' : ''}
          ${className}
        `}
        {...props}
      />
    </div>
    {error && (
      <motion.p
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-red-500 text-sm mt-2 flex items-center gap-1"
      >
        <span>⚠️</span>
        {error}
      </motion.p>
    )}
  </motion.div>
);

export default Input;