import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom'; 
import { useEffect } from 'react'; 
import Lenis from '@studio-freight/lenis';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Brands from './components/Brands';
import Rhythm from './components/Rhythm'; 
import MobileShowcase from './components/MobileShowcase'; 
import Features from './components/Features';
import RouteMap from './components/RouteMap';
import DownloadSection from './components/DownloadSection';
import Footer from './components/Footer';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Technology from './pages/Technology';
import Community from './pages/Community'; 
import Overview from './pages/Overview'; 
import FeaturesPage from './pages/Features'; 
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './ScrollToTop';  
import Workouts from './pages/Workouts'; 
import Profile from './pages/Profile';  
import History from './pages/History'; 
import Nutrition from './pages/Nutrition';

function AppContent() {
  const location = useLocation();
  // Pages where we DON'T want the landing page Navbar/Footer
  const appPaths = ['/dashboard', '/workouts', '/nutrition', '/profile', '/history'];
  const isAppPage = appPaths.includes(location.pathname); 

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
    window.lenis = lenis; 

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div className="bg-[#050505] min-h-screen font-sans selection:bg-brand selection:text-black relative overflow-x-hidden">
      {/* Background Glow Effect */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
         <div className="absolute -top-[10%] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] opacity-40 blur-[140px]"
              style={{ background: 'radial-gradient(circle,rgba(191, 255, 0, 0.45) 0%, transparent 70%)' }} />
      </div>

      {/* Show Navbar on landing page, but hide it inside the Dashboard app */}
      {!isAppPage && <Navbar />}
      
      <Routes>    
  {/* LANDING PAGE - Shows Home if logged out, Redirects to Dashboard if logged in */}
  <Route path="/" element={
    localStorage.getItem('token') ? (
      <Navigate to="/dashboard" replace />
    ) : (
      <div className="relative z-10">
        <Hero />
        <Brands />
        <div className="flex flex-col items-center py-20">
          <span className="px-4 py-1 rounded-full border border-brand/20 text-brand text-[10px] uppercase tracking-[0.4em] font-black mb-6">
            Core Experience
          </span>
          <h2 className="text-6xl md:text[3.5rem] font-bold tracking-tighter text-center text-white">
            Your All-In-One <span className="italic font-serif font-light opacity-80">Rhythm</span>
          </h2>
        </div>
        <Rhythm /> 
        <MobileShowcase />
        <div className="flex flex-col items-center py-20">
          <span className="px-4 py-1 rounded-full border border-brand/20 text-brand text-[10px] uppercase tracking-[0.4em] font-black mb-6 text-white">
            Why Fitness Tracker
          </span>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-center text-white">
            Fitness That Understands You
          </h2>
        </div>
        <Features /> 
        <RouteMap/> 
        <DownloadSection/> 
      </div>
    )
  } />

  {/* Auth Routes - Prevent logged-in users from seeing Login/Register */}
  <Route 
    path="/login" 
    element={localStorage.getItem('token') ? <Navigate to="/dashboard" replace /> : <Login />} 
  />
  <Route 
    path="/register" 
    element={localStorage.getItem('token') ? <Navigate to="/dashboard" replace /> : <Register />} 
  /> 
  
  {/* Protected Dashboard Routes - Remains the same */}
  <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
  <Route path="/workouts" element={<ProtectedRoute><Workouts /></ProtectedRoute>} /> 
  <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} /> 
  <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} /> 
  <Route path="/nutrition" element={<ProtectedRoute><Nutrition /></ProtectedRoute>} />

  {/* Other Pages */}
  <Route path="/technology" element={<Technology />} />
  <Route path="/community" element={<Community />} /> 
  <Route path="/features" element={<FeaturesPage />} /> 
  <Route path="/overview" element={<Overview />} />
</Routes>

      {/* Show Footer on landing page, but hide it inside the Dashboard app */}
      {!isAppPage && <Footer />}
    </div>
  );
}

export default function App() { 
  return (
    <Router>
      <ScrollToTop />
      <AppContent />
    </Router>
  );
}