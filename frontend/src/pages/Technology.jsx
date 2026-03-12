import { motion } from 'framer-motion';
import { Database, ShieldCheck, Zap, LayoutTemplate } from 'lucide-react';
import GlowCard from '../components/GlowCard';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Technology() {
  const specs = [
    { icon: Database, title: "MERN Stack Architecture", desc: "Powered by MongoDB, Express, React, and Node.js for high-performance, full-stack fitness data management." },
    { icon: ShieldCheck, title: "Secure Authentication", desc: "Industry-standard data encryption for all sensitive user information and secure credential storage." },
    { icon: Zap, title: "Real-time Processing", desc: "Optimized 1-2 second response times for seamless workout logging and instant nutrition tracking updates." },
    { icon: LayoutTemplate, title: "Mobile Responsiveness", desc: "Fully adaptive interface designed for cross-browser compatibility and seamless use on smartphones and tablets." }
  ];

  return (
    <div className="bg-black min-h-screen">
     
      <div className="pt-40 pb-20 px-6 max-w-7xl mx-auto">
        <motion.header 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-24"
        >
          <span className="text-[#BFFF00] text-[10px] uppercase tracking-[0.4em] font-black">Technical Infrastructure</span>
          <h1 className="text-6xl md:text-8xl font-serif italic text-white mt-4">
            Built for <br/> 
            <span className="not-italic font-sans font-black uppercase">Performance</span>
          </h1>
        </motion.header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {specs.map((spec, i) => (
            <GlowCard key={i} className="p-8 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-[#BFFF00]/10 rounded-2xl flex items-center justify-center mb-6">
                <spec.icon className="text-[#BFFF00]" size={24} />
              </div>
              <h3 className="text-white font-black uppercase tracking-widest text-sm mb-4">{spec.title}</h3>
              <p className="text-zinc-400 text-xs leading-relaxed">{spec.desc}</p>
            </GlowCard>
          ))}
        </div>

        <div className="mt-32">
          <motion.header 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <span className="text-[#BFFF00] text-[10px] uppercase tracking-[0.4em] font-black">Reliability</span>
            <h2 className="text-4xl font-serif italic text-white mt-4">Integrity & <br/> <span className="not-italic font-sans font-black uppercase text-5xl">Assurance</span></h2>
          </motion.header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <GlowCard className="p-8 border-white/10">
              <h4 className="text-[#BFFF00] text-[10px] font-black uppercase tracking-widest mb-4">Logging & Monitoring</h4>
              <p className="text-zinc-200 text-sm font-bold mb-2">99.9% System Uptime</p>
              <p className="text-zinc-500 text-xs">Continuous monitoring of server activity and error logging ensures a stable environment for hundreds of concurrent users.</p>
            </GlowCard>
            <GlowCard className="p-8 border-white/10">
              <h4 className="text-[#BFFF00] text-[10px] font-black uppercase tracking-widest mb-4">Security Assessment</h4>
              <p className="text-zinc-200 text-sm font-bold mb-2">Penetration Tested</p>
              <p className="text-zinc-500 text-xs">Regular security assessments and data privacy audits to ensure compliance with global data protection standards.</p>
            </GlowCard>
            <GlowCard className="p-8 border-white/10">
              <h4 className="text-[#BFFF00] text-[10px] font-black uppercase tracking-widest mb-4">QA Standards</h4>
              <p className="text-zinc-200 text-sm font-bold mb-2">Full Test Coverage</p>
              <p className="text-zinc-500 text-xs">Comprehensive test suites covering unit, integration, and end-to-end testing to maintain high software quality.</p>
            </GlowCard>
          </div>
        </div>

        <div className="mt-32 relative rounded-[3rem] overflow-hidden aspect-video border border-white/5 bg-zinc-900/20">
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent z-10" />
          <video autoPlay loop muted className="w-full h-full object-cover opacity-40 grayscale" src="/video.mp4" />
          <div className="absolute bottom-12 left-12 z-20 max-w-xl">
            <h2 className="text-4xl font-black uppercase tracking-tighter mb-4 italic text-white">Scale Without Limits</h2>
            <p className="text-zinc-400">
              Our architecture supports horizontal scalability to handle a growing user base and vast amounts of fitness data without performance bottlenecks.
            </p>
          </div>
        </div>
      </div>
     
    </div>
  );
}