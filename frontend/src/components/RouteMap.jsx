import { motion } from 'framer-motion';
import { MapPin, Zap, TrendingUp, Heart } from 'lucide-react';

const Metric = ({ icon: Icon, value, label }) => (
  <div className="flex flex-col items-center">
    <div className="flex items-center gap-1 mb-1">
      <Icon size={14} className="text-brand" />
      <span className="text-white font-bold text-lg tracking-tighter">{value}</span>
    </div>
    <span className="text-zinc-600 text-[10px] uppercase font-black tracking-widest">{label}</span>
  </div>
);

export default function RouteMap() {
  // SVG Path coordinates for the zigzag route
  const pathData = "M 50 150 L 150 50 L 250 180 L 350 80 L 450 200 L 550 100";

  return (
    <section className="relative py-24 bg-black overflow-hidden flex flex-col items-center">
      {/* Tactical Map Grid Background */}
      <div 
        className="absolute inset-0 opacity-10" 
        style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}
      />

      {/* Timer Display */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="relative z-10 mb-12 text-center"
      >
        <h3 className="text-7xl md:text-6xl font-sans font-black tracking-tighter text-white tabular-nums">
          40:28:02
        </h3>
        <p className="text-zinc-500 text-xs font-bold uppercase tracking-[0.4em]">Duration</p>
      </motion.div>

      {/* The Animated SVG Path */}
      <div className="relative w-full max-w-4xl h-[300px] mb-16">
        <svg viewBox="0 0 600 250" className="w-full h-full drop-shadow-[0_0_15px_rgba(191,255,0,0.5)]">
          {/* Static Background Path (dimmed) */}
          <path d={pathData} fill="none" stroke="#18181b" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
          
          {/* Animated Neon Path */}
          <motion.path
            d={pathData}
            fill="none"
            stroke="#BFFF00"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            transition={{ duration: 3, ease: "easeInOut" }}
          />

          {/* User Location Dot */}
          <motion.circle
            r="8"
            fill="#BFFF00"
            initial={{ cx: 50, cy: 150, opacity: 0 }}
            animate={{ cx: [50, 150, 250, 350, 450, 550], cy: [150, 50, 180, 80, 200, 100], opacity: 1 }}
            transition={{ duration: 3, ease: "easeInOut", repeat: Infinity }}
            className="drop-shadow-[0_0_8px_#BFFF00]"
          />
        </svg>

        {/* Floating Map Pin Labels */}
        <div className="absolute top-1/4 left-[10%] p-2 bg-brand text-black rounded-lg text-[10px] font-black uppercase">Start</div>
        <div className="absolute bottom-1/4 right-[5%] flex items-center gap-2">
            <div className="w-10 h-10 rounded-full border-2 border-brand p-1 bg-black">
                <img src="https://i.pravatar.cc/100" className="rounded-full grayscale" alt="User" />
            </div>
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="relative z-10 w-full max-w-2xl grid grid-cols-3 gap-8 border-t border-white/10 pt-12">
        <Metric icon={Zap} value="220" label="kcal" />
        <Metric icon={TrendingUp} value="10,58" label="km" />
        <Metric icon={Heart} value="108" label="bpm" />
      </div>
    </section>
  );
}