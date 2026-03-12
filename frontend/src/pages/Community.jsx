import React from 'react';
import { motion } from 'framer-motion';
import GlowCard from '../components/GlowCard';
import { Trophy, Star, Quote } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Community() {
  const testimonials = [
    { name: "Marcus Chen", role: "Triathlete", text: "The precision in tracking heart rate variability is unmatched. Transformed my rest days.", rating: 5, img: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=150&h=150&fit=crop" },
    { name: "Elena Rodriguez", role: "Fitness Coach", text: "The data visualization makes complex biometrics easy for anyone to understand.", rating: 5, img: "https://images.unsplash.com/photo-1548690312-e3b507d8d110?q=80&w=150&h=150&fit=crop" },
    { name: "Jake Thorne", role: "Powerlifter", text: "Finally a tracker that understands heavy volume and recovery cycles.", rating: 5, img: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=150&h=150&fit=crop" },
    { name: "Sarah J.", role: "Marathon Lead", text: "Fitness Tracker changed how our local running club analyzes recovery. Truly elite.", rating: 5, img: "https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=150&h=150&fit=crop" },
  ];

  const duplicatedFeedback = [...testimonials, ...testimonials];

  return (
    <div className="bg-black min-h-screen">
     
      <div className="pt-40 pb-20 px-6 max-w-7xl mx-auto overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-[#BFFF00] text-[10px] uppercase tracking-[0.4em] font-black">Global Network</span>
            <h1 className="text-6xl font-black uppercase tracking-tighter text-white mt-4 leading-none">
              Stronger <br/> 
              <span className="italic font-serif font-light lowercase text-zinc-200">together</span>
            </h1>
          </motion.div>
        </div>

        {/* Featured Leaderboard */}
        <div className="grid grid-cols-1 gap-6 mb-32">
          <GlowCard className="p-8">
            <div className="flex items-center gap-3 mb-10">
              <Trophy size={20} className="text-[#BFFF00]" />
              <h3 className="text-zinc-400 text-[11px] uppercase font-black tracking-widest">Community Leaderboard</h3>
            </div>
            <div className="space-y-4">
              {[
                { rank: "01", name: "User_Alpha72", pts: "14,200", img: "https://i.pravatar.cc/150?u=1" },
                { rank: "02", name: "RhythmMaster", pts: "12,850", img: "https://i.pravatar.cc/150?u=2" },
                { rank: "03", name: "Velocity_Fix", pts: "11,400", img: "https://i.pravatar.cc/150?u=3" }
              ].map((user) => (
                <div key={user.rank} className="flex items-center justify-between p-5 bg-white/[0.03] border border-white/5 rounded-2xl">
                  <div className="flex items-center gap-6">
                    <span className="text-zinc-600 font-black text-lg">{user.rank}</span>
                    <img src={user.img} className="w-10 h-10 rounded-full grayscale border border-white/10" alt={user.name} />
                    <span className="font-bold text-base text-white">{user.name}</span>
                  </div>
                  <span className="text-[#BFFF00] font-black text-sm tracking-widest">{user.pts} PTS</span>
                </div>
              ))}
            </div>
          </GlowCard>
        </div>

        {/* Feedback Section */}
        <div className="relative">
          <div className="text-center mb-12">
            <span className="text-[#BFFF00] text-[10px] uppercase tracking-[0.4em] font-black">Member Testimonials</span>
          </div>
          <motion.div 
            className="flex gap-6"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 35, ease: "linear", repeat: Infinity }}
          >
            {duplicatedFeedback.map((user, i) => (
              <div key={i} className="min-w-[350px] bg-zinc-900/40 border border-white/5 p-8 rounded-[2rem] backdrop-blur-md">
                <div className="flex gap-1 mb-4">
                  {[...Array(user.rating)].map((_, i) => (
                    <Star key={i} size={10} fill="#BFFF00" className="text-[#BFFF00]" />
                  ))}
                </div>
                <p className="text-zinc-200 text-sm italic mb-6 leading-relaxed">"{user.text}"</p>
                <div className="flex items-center gap-3">
                  <img src={user.img} className="w-10 h-10 rounded-full border border-white/10 grayscale contrast-125" alt={user.name} />
                  <div>
                    <p className="text-white font-bold text-xs">{user.name}</p>
                    <p className="text-zinc-500 text-[9px] uppercase font-black tracking-widest">{user.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
      
    </div>
  );
}