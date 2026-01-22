import React from 'react';

const Input = ({ label, error, className = '', icon, ...props }) => (
  <div className="mb-4 animate-fade-in">
    {label && (
      <label className="block text-gray-700 font-medium mb-2 text-sm">
        {label}
      </label>
    )}
    <div className="relative">
      {icon && (
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          {icon}
        </div>
      )}
      <input
        className={`w-full ${icon ? 'pl-10' : ''} px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all duration-300 backdrop-blur-sm bg-white bg-opacity-90 hover:bg-opacity-100 ${
          error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
        } ${className}`}
        {...props}
      />
    </div>
    {error && (
      <p className="text-red-500 text-sm mt-1 animate-slide-in">
        {error}
      </p>
    )}
  </div>
);

export default Input;