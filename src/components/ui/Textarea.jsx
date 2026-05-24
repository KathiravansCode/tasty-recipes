import React from 'react';
import { motion } from 'framer-motion';

const Textarea = ({ label, error, className = '', ...props }) => (
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
    <textarea
      className={`
        w-full px-5 py-4
        border-2 border-gray-200 rounded-2xl
        focus:border-purple-600 focus:ring-4 focus:ring-purple-100
        outline-none transition-all duration-300
        glass-card hover:border-gray-300
        text-gray-800 placeholder-gray-400
        resize-none
        ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-100' : ''}
        ${className}
      `}
      {...props}
    />
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

export default Textarea;