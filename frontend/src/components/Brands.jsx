import { motion } from 'framer-motion';

export default function Brands() {
  // Added 3 more brands for a total of 8
  const brands = [
    "Headspace", "Strava", "Asics", "Whoop", 
    "Garmin", "Nike", "Apple Health", "Peloton"
  ];

  // We double the array to ensure there's no gap during the infinite loop
  const duplicatedBrands = [...brands, ...brands];

  return (
    <div className="w-full py-12 border-y border-white/5 bg-zinc-900/20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative">
        {/* Gradients to fade out the edges for a premium look */}
        <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#050505] to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#050505] to-transparent z-10" />

        <motion.div 
          className="flex gap-16 md:gap-24 whitespace-nowrap"
          animate={{
            x: ["0%", "-50%"], // Moves halfway (the full original set)
          }}
          transition={{
            duration: 25, // Adjust speed here (higher = slower)
            ease: "linear",
            repeat: Infinity,
          }}
        >
          {duplicatedBrands.map((brand, index) => (
            <span 
              key={`${brand}-${index}`} 
              className="text-xl md:text-2xl font-black tracking-tighter text-white opacity-30 grayscale contrast-200 uppercase"
            >
              {brand}
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
}