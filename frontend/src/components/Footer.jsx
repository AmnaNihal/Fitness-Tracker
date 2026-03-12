import { motion } from 'framer-motion';
/* FIX: Added the missing import below */
import { useLocation } from 'react-router-dom';

export default function Footer() {
  const location = useLocation();
  
  // Check if we are on Login or Register pages to reduce whitespace
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  const footerSections = [
    {
      title: 'Product',
      // Updated to match your Navbar links
      links: ['Features', 'Technology', 'Community', 'Overview']
    },
    {
      title: 'Resources',
      links: ['Terms', 'Privacy', 'Careers', 'YouTube']
    }
  ];

  return (
    /* FIX: Changed pt-64 to a conditional class.
        If it's an auth page, we use pt-10 to "reduce" it.
    */
    <footer className={`bg-black ${isAuthPage ? 'pt-10' : 'pt-64'} pb-10 px-6 relative overflow-hidden`}>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-16 relative z-10">
        
        {/* Left Section: Brand & Tagline */}
        <div className="flex flex-col">
          <div className="flex items-center gap-3 mb-8">
            <svg
              className="w-8 h-4"
              viewBox="0 0 64 32"
              fill="none"
            >
              <polyline
                points="0,16 10,16 14,8 20,24 26,4 32,28 38,16 64,16"
                stroke="#BFFF00"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ filter: "drop-shadow(0 0 8px #BFFF00)" }}
              />
            </svg>

            <span className="text-3xl font-black tracking-tighter text-white">Fitness Tracker</span>
          </div>
          
          <div className="max-w-[160px]">
            <p className="text-zinc-600 text-xs font-bold leading-relaxed uppercase tracking-wider">
              Your Wellness, <br /> Our Mission.
            </p>
          </div>
        </div>

        {/* Right Section: Link Columns */}
        <div className="grid grid-cols-2 md:grid-cols-2 gap-x-20 gap-y-10">
          {footerSections.map((section) => (
            <div key={section.title} className="flex flex-col gap-6">
              <h4 className="text-zinc-700 text-[10px] uppercase tracking-[0.3em] font-black">
                {section.title}
              </h4>
              <ul className="flex flex-col gap-4">
                {section.links.map((link) => (
                  <li key={link}>
                    {/* Changed href to follow typical routing /features, /technology, etc */}
                    <a href={`/${link.toLowerCase()}`} className="text-zinc-500 text-[13px] font-medium hover:text-[#BFFF00] transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Massive Decorative Logo (Peeking from bottom center) */}
      <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-[80vw] max-w-[1000px] aspect-square pointer-events-none opacity-20">
        <div className="w-full h-full bg-[#BFFF00] rounded-full flex items-center justify-center overflow-hidden blur-[60px]">
          <div className="w-full h-[30px] bg-black rotate-45 transform scale-[2]" />
        </div>
      </div>

      {/* Subtle Bottom Copyright */}
      <div className="max-w-7xl mx-auto mt-32 pt-8 border-t border-white/5 flex justify-between items-center relative z-10">
        <p className="text-zinc-700 text-[10px] uppercase tracking-widest font-black">
          © 2026 Fitness Tracker.
        </p>
      </div>
    </footer>
  );
}