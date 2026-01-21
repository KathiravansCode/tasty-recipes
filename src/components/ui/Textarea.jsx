import React from 'react';

const Textarea = ({ label, error, className = '', ...props }) => (
  <div className="mb-4">
    {label && <label className="block text-gray-700 font-medium mb-2">{label}</label>}
    <textarea
      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition resize-none ${error ? 'border-red-500' : 'border-gray-300'} ${className}`}
      {...props}
    />
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

export default Textarea;