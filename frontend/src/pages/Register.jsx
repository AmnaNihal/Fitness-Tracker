import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { User, Mail, Lock, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';



const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const nameRegex = /^[A-Za-z\s]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

export default function Register() {
  const navigate = useNavigate();



  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard', { replace: true }); 
    }
  }, [navigate]);


  // ✅ State must be here (top-level)
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
  
    // ✅ Minimal frontend validation (no UI changes)
    const cleanName = name.trim();
    const cleanEmail = email.trim();
    
    if (!cleanName || !cleanEmail || !password) {
      setError('All fields are required');
      return;
    }
    
    if (cleanName.length < 3) {
      setError('Name must be at least 3 characters');
      return;
    }
    
    if (!nameRegex.test(cleanName)) {
      setError('Name can only contain letters and spaces');
      return;
    }
    
    if (!emailRegex.test(cleanEmail)) {
      setError('Enter a valid email');
      return;
    }
    
    if (!passwordRegex.test(password)) {
      setError('Password must contain 1 uppercase, 1 lowercase and 1 number (min 8 chars)');
      return;
    }
    setLoading(true);
  
    try {
      const { data } = await API.post('/auth/register', {
        name: cleanName,
        email: cleanEmail,
        password,
      });
  
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-black overflow-hidden px-6 pt-40 pb-20">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-30 grayscale"
        >
          <source src="/video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/70" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-lg bg-[#0A0A0A]/80 backdrop-blur-2xl p-12 rounded-[3rem] border border-white/5 shadow-2xl"
      >
        {/* Header */}
        <header className="mb-10 text-center">
          <span className="text-[#BFFF00] text-[10px] uppercase tracking-[0.4em] font-black">
            Get Started
          </span>
          <h1 className="text-5xl font-serif italic text-white leading-tight mt-2">
            Start Your{' '}
            <span className="not-italic font-sans font-black uppercase block">
              Journey
            </span>
          </h1>
        </header>

        {/* Form */}
        <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative md:col-span-2">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name"
              required
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-[#BFFF00]/50 transition-colors"
            />
          </div>

          <div className="relative md:col-span-2">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              required
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-[#BFFF00]/50 transition-colors"
            />
          </div>

          <div className="relative md:col-span-2">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-[#BFFF00]/50 transition-colors"
            />
          </div>

          {error && (
            <p className="md:col-span-2 text-red-500 text-sm text-center">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="md:col-span-2 mt-4 bg-[#BFFF00] text-black font-black py-5 rounded-2xl flex items-center justify-center gap-2 uppercase tracking-widest text-sm shadow-[0_0_30px_rgba(191,255,0,0.3)] hover:shadow-[0_0_50px_rgba(191,255,0,0.5)] transition-all disabled:opacity-60"
          >
            {loading ? 'Creating Account...' : <>Join <ArrowRight size={18} /></>}
          </button>
        </form>

        <p className="text-center mt-8 text-zinc-500 text-sm">
          Already moving?{' '}
          <Link to="/login" className="text-white font-bold hover:text-[#BFFF00]">
            Sign In
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
