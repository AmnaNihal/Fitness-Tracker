import { motion } from 'framer-motion';

const StatRow = ({ label, value, unit }) => (
  <div className="flex justify-between items-center py-2 border-b border-white/5">
    <span className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest">{label}</span>
    <div className="flex items-baseline gap-1">
      <span className="text-white font-bold">{value}</span>
      <span className="text-zinc-500 text-[8px] uppercase">{unit}</span>
    </div>
  </div>
);

export default function MobileShowcase() {
  return (
    <section className="relative py-24 flex flex-col items-center overflow-hidden">
      {/* Background Glow behind the phone */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand/10 blur-[150px] -z-10" />

      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative mx-auto border-zinc-800 bg-zinc-900 border-[8px] rounded-[3rem] h-[640px] w-[310px] shadow-2xl overflow-hidden"
      >
        {/* Dynamic Island / Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-zinc-900 rounded-b-2xl z-20" />

        {/* Mockup Screen Content */}
        <div className="h-full w-full bg-[#050505] p-6 pt-10 overflow-y-auto no-scrollbar">
          <header className="mb-6">
            <h4 className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-1">Current State</h4>
            <p className="text-white text-xs opacity-50">Monday, 28 Oct</p>
          </header>

          {/* Mini Activity Ring */}
          <div className="relative flex items-center justify-center mb-10 py-4">
            <svg className="w-32 h-32 transform -rotate-90">
              <circle cx="64" cy="64" r="50" stroke="#18181b" strokeWidth="8" fill="transparent" />
              <circle cx="64" cy="64" r="50" stroke="#BFFF00" strokeWidth="8" fill="transparent" strokeDasharray="314" strokeDashoffset="78" strokeLinecap="round" />
            </svg>
            <div className="absolute text-center">
              <span className="text-3xl font-black text-white">75</span>
              <p className="text-[8px] text-zinc-500 font-bold uppercase">Activity Score</p>
            </div>
          </div>

          {/* Mobile Metrics Grid */}
          <div className="grid grid-cols-2 gap-3 mb-8">
            <div className="bg-zinc-900/50 p-4 rounded-2xl border border-white/5">
              <span className="text-zinc-500 text-[8px] uppercase font-bold">Move</span>
              <p className="text-white text-lg font-bold">220 <span className="text-[10px] text-zinc-600">kcal</span></p>
            </div>
            <div className="bg-zinc-900/50 p-4 rounded-2xl border border-white/5">
              <span className="text-zinc-500 text-[8px] uppercase font-bold">Exercise</span>
              <p className="text-white text-lg font-bold">40 <span className="text-[10px] text-zinc-600">min</span></p>
            </div>
          </div>

          <StatRow label="Monday Morning Run" value="10,58" unit="km" />
          <StatRow label="Active Challenge" value="81,80" unit="km" />
        </div>

        {/* Bottom Home Indicator */}
        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-28 h-1 bg-white/20 rounded-full" />
      </motion.div>
    </section>
  );
}