import { useState, useRef } from 'react';
import ActivityRing from './ActivityRing';
import StatsGrid from './StatsGrid';

// Reusable Glow Wrapper for the dashboard cards
const GlowWrapper = ({ children, className = "" }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }
  };

  return (
    <div 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={`relative group overflow-hidden rounded-[2.5rem] bg-[#0A0A0A] border border-white/5 ${className}`}
    >
      <div 
        className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
        style={{
          background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(191, 255, 0, 0.06), transparent 40%)`
        }}
      />
      {children}
    </div>
  );
};

export default function Rhythm() {
  return (
    <section className="py-24 px-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        
        {/* Left Side: Score Tracker with Glow */}
        <GlowWrapper className="lg:col-span-1">
          <ActivityRing score={75} />
        </GlowWrapper>

        {/* Right Side: Detailed Metrics with Glow */}
        <GlowWrapper className="lg:col-span-2">
          <StatsGrid />
        </GlowWrapper>
        
      </div>
    </section>
  );
}