import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const FeatureCard = ({ title, description, image, index }) => (
  <motion.div 
    // FORCED IMMEDIATE ANIMATION
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ 
      duration: 0.7, 
      delay: index * 0.2, // Staggered
      ease: "easeOut" 
    }}
    whileHover={{ y: -12 }}
    className="bg-zinc-900/50 border border-white/5 rounded-[2.5rem] overflow-hidden backdrop-blur-sm h-full"
  >
    <div className="h-64 bg-zinc-800 overflow-hidden">
      <img src={image} alt={title} className="w-full h-full object-cover grayscale opacity-60" />
    </div>
    <div className="p-8">
      <h3 className="text-white text-xl font-bold mb-4">{title}</h3>
      <p className="text-zinc-500 text-sm leading-relaxed">{description}</p>
    </div>
  </motion.div>
);

export default function Features() {
  const features = [
    {
      title: "Smart Workout Tracking",
      description: "Log runs, strength sessions, and daily activity with real-time insights and performance summaries.",
      image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000"
    },
    {
      title: "Nutrition & Calorie Insights",
      description: "Monitor calories, protein, carbs, and fats with clean visual analytics designed for consistency.",
      image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1000"
    },
    {
      title: "Progress That Motivates",
      description: "Track weekly performance trends and stay accountable with data-driven progress tracking.",
      image: "https://images.unsplash.com/photo-1510017803434-a899398421b3?q=80&w=1000"
    }
  ];

  return (
    <div className="bg-black min-h-screen">
     
      
      {/* Wrapper to ensure the grid is positioned correctly */}
      <main className="relative z-10">
        <section className="py-40 px-6 max-w-7xl mx-auto">
          <AnimatePresence>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((f, i) => (
                <FeatureCard key={`feat-${i}`} index={i} {...f} />
              ))}
            </div>
          </AnimatePresence>
        </section>
      </main>

     
    </div>
  );
}