import { motion } from 'framer-motion';

const StatCard = ({ title, value, unit, progress, color = "bg-brand" }) => (
  <motion.div 
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="bg-zinc-900/50 border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-xl relative overflow-hidden"
  >
    <div className="flex items-center gap-2 mb-6">
      <div className={`w-2 h-2 rounded-full ${color} shadow-[0_0_10px_rgba(191,255,0,0.5)]`} />
      <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest">{title}</span>
    </div>

    <div className="flex items-baseline gap-2 mb-10">
      <span className="text-6xl font-black tracking-tighter text-white">{value}</span>
      <span className="text-zinc-600 font-medium">{unit}</span>
    </div>

    {/* The Frequency/Data Bars */}
    <div className="flex gap-1.5 h-16 items-end">
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ height: 0 }}
          whileInView={{ height: `${Math.random() * 100}%` }}
          transition={{ delay: i * 0.05, duration: 0.5 }}
          className={`w-full rounded-full transition-colors ${
            i < progress ? color : "bg-zinc-800"
          }`}
        />
      ))}
    </div>
  </motion.div>
);

export default function StatsGrid() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Move" value="220" unit="/ 750 kcal" progress={9} />
        <StatCard title="Exercise" value="40" unit="/ 60 min" progress={6} />
        <StatCard title="Active Challenge" value="81,80" unit="/ 150 km" progress={12} />
      </div>
    </section>
  );
}