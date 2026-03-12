import { motion } from 'framer-motion';
import { Target, Lightbulb, TrendingUp } from 'lucide-react';
import GlowCard from '../components/GlowCard';
import Navbar from '../components/Navbar'; 
import Footer from '../components/Footer';

export default function Overview() {
  return (
    <div className="bg-black min-h-screen">
     

      <div className="pt-40 pb-20 px-6 max-w-7xl mx-auto">
        {/* --- RESTORED HEADER --- */}
        <header className="mb-24">
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[#BFFF00] text-[10px] uppercase tracking-[0.4em] font-black"
          >
            Project Background
          </motion.span>
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-6xl md:text-8xl font-serif italic text-white mt-4"
          >
            Elevating <br/> 
            <span className="not-italic font-sans font-black uppercase">Digital Health</span>
          </motion.h1>
        </header>

        {/* --- RESTORED VISION SECTION --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-32">
          <div className="space-y-6">
            <h2 className="text-3xl font-black uppercase tracking-tighter text-white italic">The Vision</h2>
            <p className="text-zinc-400 leading-relaxed text-lg">
              In response to the global surge in health consciousness, our Fitness Tracker provides a digital solution for individuals to seamlessly manage and monitor their fitness journeys. 
            </p>
            <p className="text-zinc-500 leading-relaxed">
              Our objective is to provide a real-life scenario using modern tools, helping users create a robust application that tracks activities, nutrition, and progress over time.
            </p>
          </div>
          <GlowCard className="aspect-square bg-zinc-900/20 flex items-center justify-center p-12 relative overflow-hidden">
            <Target size={120} className="text-[#BFFF00] opacity-20 absolute" />
            <div className="relative z-10 text-center">
               <h3 className="text-[#BFFF00] text-5xl font-black mb-2">100%</h3>
               <p className="text-white font-bold uppercase tracking-widest text-xs">Integrated Application</p>
            </div>
          </GlowCard>
        </div>

        {/* --- RESTORED FEATURE CARDS --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Lightbulb, title: "Innovative Solutions", text: "Catering to diverse needs of fitness enthusiasts with digital implementation." },
            { icon: Target, title: "Laddered Approach", text: "A step-by-step implementation simulating actual lab-based learning environments." },
            { icon: TrendingUp, title: "Robust Scaling", text: "Designed to evolve from a single program into a unified, robust code application." }
          ].map((item, i) => (
            <GlowCard key={i} className="p-8">
              <item.icon className="text-[#BFFF00] mb-6" size={32} />
              <h4 className="text-white font-black uppercase tracking-widest text-sm mb-4">{item.title}</h4>
              <p className="text-zinc-500 text-xs leading-relaxed">{item.text}</p>
            </GlowCard>
          ))}
        </div>
      </div>

     
    </div>
  );
}