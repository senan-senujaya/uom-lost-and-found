import React from 'react';

// Notice we now pass 'foundCount' instead of 'onReportClick'
export const Navbar = ({ foundCount }) => {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-slate-950/50 backdrop-blur-lg border-b border-white/10 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        
        {/* Logo - Clicks back to top */}
        <div 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 cursor-pointer"
        >
          UoM Lost<span className="text-white">&</span>Found
        </div>
        
        {/* Navigation Links */}
        <div className="flex items-center space-x-8 text-sm font-medium text-slate-300">
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
            className="flex items-center gap-2 hover:text-cyan-400 transition-colors duration-300"
          >
            
            {/* The Live Counter Badge */}
            <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-bold border border-cyan-500/30">
              {foundCount} Found
            </span>
          </button>
          
          <a 
            href="mailto:support@uom.lk" 
            className="hover:text-cyan-400 transition-colors duration-300"
          >
            Contact Us
          </a>
        </div>

      </div>
    </nav>
  );
};