import React from 'react';

export const Button = ({ children, onClick, type = 'button', className = '' }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`relative inline-flex items-center justify-center px-6 py-2.5 text-sm font-semibold text-white transition-all duration-300 ease-in-out rounded-lg bg-gradient-to-r from-purple-600 via-blue-500 to-pink-500 hover:scale-105 hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-900 ${className}`}
    >
      {children}
    </button>
  );
};