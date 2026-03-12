import { motion } from 'framer-motion';
import { Activity, Utensils, BarChart3, BellRing, Search, Shield } from 'lucide-react';
import GlowCard from '../components/GlowCard';

export default function Features() {
  const features = [
    { icon: Activity, title: "Workout Tracking", desc: "Create, edit, and categorize routines with specific sets, reps, and weights." },
    { icon: Utensils, title: "Nutrition Logs", desc: "Log daily food intake with nutritional details including calories and macronutrients." },
    { icon: BarChart3, title: "Data Visualization", desc: "View progress through generated graphs, lifting history, and consumption trends." },
    { icon: BellRing, title: "Smart Alerts", desc: "Receive notifications for goal achievements, workout completion, and reminders." },
    { icon: Search, title: "Advanced Search", desc: "Easily filter through specific workouts, nutrition entries, or community users." },
    { icon: Shield, title: "User Management", desc: "Secure account creation with personalized profiles and basic info updates." }
  ];

  return (
    <div className="pt-40 pb-20 px-6 max-w-7xl mx-auto">
      <header className="text-center mb-24">
        <span className="text-[#BFFF00] text-[10px] uppercase tracking-[0.4em] font-black">Functional Logic</span>
        <h1 className="text-6xl md:text-8xl font-serif italic text-white mt-4">Engineered for <br/> <span className="not-italic font-sans font-black uppercase">Results</span></h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((f, i) => (
          <GlowCard key={i} className="p-10 hover:border-[#BFFF00]/30 transition-colors duration-500">
            <div className="flex items-start justify-between mb-8">
              <div className="w-12 h-12 bg-[#BFFF00]/10 rounded-2xl flex items-center justify-center">
                <f.icon className="text-[#BFFF00]" size={24} />
              </div>
              <span className="text-zinc-800 font-black text-4xl">0{i + 1}</span>
            </div>
            <h3 className="text-white font-black uppercase tracking-widest text-base mb-4">{f.title}</h3>
            <p className="text-zinc-500 text-sm leading-relaxed">{f.desc}</p>
          </GlowCard>
        ))}
      </div>
    </div>
  );
}