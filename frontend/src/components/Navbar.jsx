import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl">
      <div className="bg-zinc-900/60 backdrop-blur-md border border-white/10 rounded-full px-6 py-3 flex items-center justify-between">
        
        {/* Logo leads back to Home */}
        <Link to="/" className="flex items-center gap-2 group">
          <svg className="w-7 h-7 heartbeat" viewBox="0 0 64 32" fill="none">
            <polyline 
              style={{ filter: "drop-shadow(0 0 6px #BFFF00)" }}
              points="0,16 10,16 14,8 20,24 26,4 32,28 38,16 64,16"
              stroke="#BFFF00"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-white font-black tracking-tighter text-xl">
            Fitness Tracker
          </span>
        </Link>

        {/* Updated Navigation Links - All using Link for full page routing */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/overview" className="text-zinc-400 text-[11px] uppercase tracking-widest font-bold hover:text-white transition-colors">
            Overview
          </Link>
          <Link to="/features" className="text-zinc-400 text-[11px] uppercase tracking-widest font-bold hover:text-white transition-colors">
            Features
          </Link>
          <Link to="/technology" className="text-zinc-400 text-[11px] uppercase tracking-widest font-bold hover:text-white transition-colors">
            Technology
          </Link>
          <Link to="/community" className="text-zinc-400 text-[11px] uppercase tracking-widest font-bold hover:text-white transition-colors">
            Community
          </Link>
        </div>

        {/* Signup Button leading to Registration */}
        <Link 
          to="/register" 
          className="bg-black text-white px-5 py-2 rounded-full text-[11px] font-black uppercase tracking-widest flex items-center gap-2 border border-white/10 hover:bg-white hover:text-black transition-all"
        >
          Signup <ArrowRight size={14} />
        </Link>
      </div>
    </nav>
  );
}