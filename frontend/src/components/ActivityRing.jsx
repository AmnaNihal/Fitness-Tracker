import { motion } from 'framer-motion';

export default function ActivityRing({ score = 75 }) {
  // circumference of a half circle (pi * r)
  const radius = 80;
  const circumference = Math.PI * radius;
  const progressOffset = circumference - (score / 100) * circumference;

  return (
    <div className="bg-[#0A0A0A] p-10 rounded-[2.5rem] border border-white/5 flex flex-col items-center justify-center min-w-[340px] relative overflow-hidden h-full">
      {/* Label - Positioned at the top like the screenshot */}
      <span className="absolute top-8 text-zinc-600 text-[10px] uppercase tracking-[0.3em] font-black">
        Current State
      </span>
      
      {/* The Arc Gauge */}
      <div className="relative mt-12 flex items-center justify-center">
        <svg className="w-56 h-32 overflow-visible">
          {/* Background Track Arc */}
          <path
            d="M 20 110 A 80 80 0 0 1 180 110"
            fill="none"
            stroke="#1A1A1A"
            strokeWidth="12"
            strokeLinecap="round"
          />
          {/* Neon Progress Arc */}
          <motion.path
            d="M 20 110 A 80 80 0 0 1 180 110"
            fill="none"
            stroke="#BFFF00"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            whileInView={{ strokeDashoffset: progressOffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            style={{ filter: 'drop-shadow(0 0 12px rgba(191,255,0,0.8))' }}
          />
        </svg>

        {/* Inner Text - Precisely positioned inside the arc */}
        <div className="absolute top-1/2 -translate-y-2 flex flex-col items-center">
          <span className="text-7xl font-black text-white leading-none tracking-tighter">
            {score}
          </span>
          <span className="text-zinc-500 text-[9px] font-bold uppercase tracking-widest mt-2">
            Activity Score
          </span>
          {/* Stars from the reference */}
          <div className="flex gap-1 mt-1">
             <span className="text-[#BFFF00] text-[10px]">★</span>
             <span className="text-[#BFFF00] text-[10px]">★</span>
          </div>
        </div>
      </div>
    </div>
  );
}