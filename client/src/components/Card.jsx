import React from 'react';

export const Card = ({ children, className = '' }) => {
  return (
    <div className={`relative overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 transition-all duration-300 ease-in-out hover:scale-[1.02] hover:bg-white/10 hover:shadow-[0_0_30px_rgba(56,189,248,0.2)] hover:border-white/20 ${className}`}>
      {/* Optional internal subtle gradient glow */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};