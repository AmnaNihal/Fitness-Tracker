import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import API from '../api/axios';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';


const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const nameRegex = /^[A-Za-z\s]+$/;


export default function Login() {
  const navigate = useNavigate();


  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard', { replace: true }); 
    }
  }, [navigate]);


  // ✅ State (required)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
  
    // ✅ Minimal frontend validation (no UI changes)
    const cleanEmail = email.trim();
  
    if (!cleanEmail || !password) {
      setError('Email and password are required');
      return;
    }
  
    if (!emailRegex.test(cleanEmail)) {
      setError('Enter a valid email');
      return;
    }
  
    setLoading(true);
  
    try {
      const { data } = await API.post('/auth/login', {
        email: cleanEmail,
        password,
      });
  
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-black overflow-hidden px-6 pt-32 pb-20">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-30 grayscale">
          <source src="/video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/70" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md bg-[#0A0A0A]/80 backdrop-blur-2xl p-10 rounded-[2.5rem] border border-white/5 shadow-2xl"
      >
        {/* Header */}
        <div className="flex flex-col items-center mb-10 text-center">
          <svg className="w-7 h-7 heartbeat" viewBox="0 0 64 32" fill="none">
            <polyline
              style={{ filter: 'drop-shadow(0 0 6px #BFFF00)' }}
              points="0,16 10,16 14,8 20,24 26,4 32,28 38,16 64,16"
              stroke="#BFFF00"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <h1 className="text-4xl font-serif italic text-white tracking-tight">
            Welcome Back
          </h1>
          <p className="text-zinc-500 text-sm mt-2 font-medium">
            Find your rhythm again
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                required
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-[#BFFF00]/50"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-[#BFFF00]/50"
              />
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#BFFF00] text-black font-black py-4 rounded-2xl flex items-center justify-center gap-2 uppercase tracking-widest text-sm shadow-[0_0_30px_rgba(191,255,0,0.3)] disabled:opacity-60"
          >
            {loading ? 'Logging in...' : <>LOGIN <ArrowRight size={18} /></>}
          </button>
        </form>

        <p className="text-center mt-8 text-zinc-500 text-sm">
          New to Fitness Tracker?{' '}
          <Link to="/register" className="text-white font-bold hover:text-[#BFFF00]">
            Create Account
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
