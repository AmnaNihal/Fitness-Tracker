import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 px-6 flex flex-col items-center overflow-hidden min-h-screen bg-transparent"> 
      
      {/* Background Video Layer - Swapped from Image */}
      <div className="absolute inset-0 z-0">
      <video
    autoPlay
    loop
    muted
    playsInline
    className="w-full h-full object-cover opacity-50 grayscale transition-opacity duration-1000"
  >
    <source src="/video.mp4" type="video/mp4" />
   
  </video>
      </div>

      {/* Content Layer */}
      <div className="relative z-20 flex flex-col items-center">
        {/* Floating Status Bar */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-zinc-900/60 backdrop-blur-md border border-white/10 p-3 rounded-2xl flex flex-wrap items-center justify-center gap-3 mb-12"
        >
          <p className="text-xs md:text-sm text-zinc-400">Good morning, how are you feeling today?</p>
          <div className="flex gap-2">
            <span className="px-3 py-1 bg-brand text-black text-[10px] font-black uppercase rounded-lg">ENERGIZED</span>
            <button className="p-1 rounded-md border border-white/20 text-white"><Plus size={14} /></button>
          </div>
        </motion.div>

        <h1 className="text-6xl md:text-9xl font-serif italic text-center mb-6 leading-[0.9] text-white">
        <span className="text-[5rem] font-serif italic block">
    Move With
  </span>
          <span className="font-sans not-italic font-black">Meaning</span>
        </h1>

        <p className="max-w-md text-center text-zinc-500 text-sm md:text-base">
          Fitness Tracker is your personal coach that listens, learns, adapts and guides.
        </p>
      </div>
    </section>
  );
}