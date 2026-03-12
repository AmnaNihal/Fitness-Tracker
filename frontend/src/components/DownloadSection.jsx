import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useRef } from 'react';

export default function DownloadSection() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Parallax: Left phone moves up, right phone moves slightly slower
  const yLeft = useTransform(scrollYProgress, [0, 1], [200, -150]);
  const yRight = useTransform(scrollYProgress, [0, 1], [200, -50]);

  return (
    <section ref={containerRef} className="relative pt-32 pb-0 px-6 flex flex-col items-center bg-black z-20"> 
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[500px] bg-[#BFFF00]/5 blur-[120px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center max-w-5xl">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="px-3 py-1 rounded-full border border-white/10 bg-zinc-900/40 backdrop-blur-md mb-12 shadow-sm"
        >
          <span className="text-zinc-500 text-[10px] uppercase tracking-[0.4em] font-black">
            Core Experience
          </span>
        </motion.div>

        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.8 }}
          className="text-6xl md:text-[3.5rem] font-serif italic text-white leading-[0.85] tracking-tighter mb-16"
        >
          Your Next Best <br />
          <span className="not-italic font-sans font-black uppercase">Self Starts Here</span>
        </motion.h2>

        <Link to="/login">
  <motion.button
    whileHover={{ scale: 1.05, boxShadow: "0 0 50px rgba(191,255,0,0.5)" }}
    whileTap={{ scale: 0.98 }}
    className="group flex items-center gap-3 bg-[#BFFF00] text-black px-10 py-5 rounded-full text-sm font-black uppercase tracking-widest shadow-[0_0_30px_rgba(191,255,0,0.3)] transition-all duration-300"
  >
    Start Here
    <motion.div 
      animate={{ x: [0, 4, 0] }} // Switched to x-axis for forward motion
      transition={{ repeat: Infinity, duration: 1.5 }}
    >
      <ArrowRight size={18} strokeWidth={3} />
    </motion.div>
  </motion.button>
</Link>
      </div>

      {/* PARALLAX MOCKUPS: Linked to scroll position */}
      <div className="relative mt-4 flex justify-center w-full max-w-6xl translate-y-16 gap-6 opacity-90 z-30">
        <motion.div 
          style={{ y: yLeft, rotate: -5 }}
          className="w-[280px] md:w-[320px] h-[550px] bg-zinc-900 rounded-[3.5rem] border-[10px] border-zinc-800 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden"
        >
           <img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000" className="w-full h-full object-cover grayscale opacity-40" alt="App Interface" />
        </motion.div>

        <motion.div 
          style={{ y: yRight, rotate: 5 }}
          className="w-[280px] md:w-[320px] h-[550px] bg-zinc-900 rounded-[3.5rem] border-[10px] border-zinc-800 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden"
        >
           <img src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1000" className="w-full h-full object-cover grayscale opacity-40" alt="App Interface" />
        </motion.div>
      </div>
    </section>
  );
}