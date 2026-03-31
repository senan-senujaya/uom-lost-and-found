import React from 'react';

export const Input = ({ label, type = 'text', placeholder, value, onChange, name }) => {
  return (
    <div className="flex flex-col space-y-2 w-full">
      {label && <label className="text-sm font-medium text-slate-300">{label}</label>}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 backdrop-blur-md transition-all duration-300 ease-in-out focus:outline-none focus:bg-white/10 focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/30 focus:shadow-[0_0_15px_rgba(236,72,153,0.3)]"
      />
    </div>
  );
};