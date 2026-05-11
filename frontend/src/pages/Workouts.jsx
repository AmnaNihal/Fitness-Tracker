import { motion } from 'framer-motion';
import { useNavigate, NavLink } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react'; 
import { 
  LayoutDashboard, User, Activity, PieChart, 
  Bell, LogOut, Plus, Trash2, Edit3, ChevronDown, ChevronUp, Search, History
} from 'lucide-react';

import GlowCard from '../components/GlowCard';
import API from '../api/axios'; 
import WorkoutModal from '../components/WorkoutModal';

export default function Workouts() {
  const navigate = useNavigate();
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState(null);
  const [expandedId, setExpandedId] = useState(null); 
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');


  const [view, setView] = useState('custom'); // 'custom' or 'ai'
const [aiPrefs, setAiPrefs] = useState({
    weight: userData?.weight || '', 
    height: userData?.height || '',
    age: '', goal: 'weight loss', modality: 'HIIT'
});
const [aiResults, setAiResults] = useState([]);
const [aiHealthData, setAiHealthData] = useState(null);
const [aiLoading, setAiLoading] = useState(false);

const handleAIDiscovery = async () => {
  setAiLoading(true);
  try {
    const token = localStorage.getItem('token');
    // Calling your Express Proxy (Step 2 from previous message)
    const { data } = await API.post('/workouts/recommend', aiPrefs, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setAiResults(data.videos);
    setAiHealthData(data.health_profile);
  } catch (err) {
    console.error("AI discovery failed", err);
  } finally {
    setAiLoading(false);
  }
};

// Logging workout session

const handleCompleteWorkout = async (workout) => {
  try {
    const token = localStorage.getItem('token');
    await API.post('/logs', {
      workoutName: workout.name,
      category: workout.category,
      exercises: workout.exercises
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    // Optional: Visual feedback
    alert(`Workout "${workout.name}" logged successfully!`);
    setExpandedId(null); 
  } catch (err) {
    console.error("Failed to log workout:", err);
  }
};





  const userString = localStorage.getItem('user');
  const userData = userString ? JSON.parse(userString) : null;
  const userName = userData?.name || 'User';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login', { replace: true });
  };

  const fetchWorkouts = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const { data } = await API.get('/workouts', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWorkouts(data);
    } catch (err) {
      console.error("Fetch error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWorkouts();
  }, [fetchWorkouts]); 


  
  const filteredWorkouts = workouts.filter(workout => {
    const matchesCategory = activeCategory === 'All' || workout.category === activeCategory;
    const matchesSearch = 
      workout.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      workout.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  }); 

  const handleDelete = async (id) => {
    if (window.confirm("Delete this routine?")) {
      try {
        const token = localStorage.getItem('token');
        await API.delete(`/workouts/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchWorkouts();
      } catch (err) { console.error(err); }
    }
  }; 

  

  const handleToggleExercise = async (workoutId, exerciseId, currentStatus) => {
    try {
      const token = localStorage.getItem('token');
      await API.put(`/workouts/${workoutId}/exercises/${exerciseId}`, 
        { completed: !currentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Immediately refresh data so the UI and Chart sync up
      fetchWorkouts(); 
    } catch (err) {
      console.error("Failed to update exercise status:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex">
      {/* Sidebar Navigation */}
      <aside className="w-20 lg:w-64 border-r border-white/5 flex flex-col p-6 fixed h-full bg-black z-20">
        <div className="flex items-center gap-3 mb-12">
          <svg className="w-7 h-7 heartbeat" viewBox="0 0 64 32" fill="none">
            <polyline 
              style={{ filter: "drop-shadow(0 0 6px #BFFF00)" }}
              points="0,16 10,16 14,8 20,24 26,4 32,28 38,16 64,16"
              stroke="#BFFF00" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
            />
          </svg>
          <span className="hidden lg:block text-xl font-black tracking-tighter">Fitness Tracker</span>
        </div>

        <nav className="flex-1 space-y-2">
          {[
            { icon: LayoutDashboard, label: 'Overview', path: '/dashboard' },
            { icon: Activity, label: 'Workouts', path: '/workouts' },
            { icon: PieChart, label: 'Nutrition', path: '/nutrition' },
            { icon: User, label: 'Profile', path: '/profile' },
            { icon: History, label: 'History', path: '/history' },
          ].map((item) => (
            <NavLink 
              key={item.label} 
              to={item.path}
              className={({ isActive }) => `
                w-full flex items-center gap-4 p-3 rounded-xl transition-colors
                ${isActive 
                  ? 'bg-[#BFFF00] text-black font-bold' 
                  : 'text-zinc-500 hover:bg-white/5 hover:text-[#BFFF00]'}
              `}
            >
              <item.icon size={20} />
              <span className="hidden lg:block text-sm uppercase tracking-widest font-bold">
                {item.label}
              </span>
            </NavLink>
          ))}
        </nav>

        <button onClick={handleLogout} className="flex items-center gap-4 p-3 text-zinc-500 hover:text-[#BFFF00] transition-colors mt-auto group">
          <LogOut size={20} />
          <span className="hidden lg:block text-sm uppercase tracking-widest font-bold">Logout</span>
        </button>
      </aside>

      <main className="flex-1 ml-20 lg:ml-64 p-8 pt-32 lg:pt-12">
  <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-12">
    <div>
      <h1 className="text-4xl font-serif italic mb-2">Workouts</h1>
      <p className="text-zinc-500 font-medium tracking-wide">Manage your custom routines or discover AI plans</p>
    </div>
    <div className="flex gap-4">
      <button 
        onClick={() => { setEditingWorkout(null); setIsModalOpen(true); }}
        className="bg-[#BFFF00] text-black px-6 py-3 rounded-xl font-black uppercase text-xs tracking-widest flex items-center gap-2 hover:bg-[#a6d900] transition-colors"
      >
        <Plus size={16} /> New Routine
      </button>
    </div>
  </header>

  {/* TAB SWITCHER */}
  <div className="flex gap-2 mb-8 bg-white/5 p-1 rounded-2xl w-fit">
    <button 
      onClick={() => setView('custom')}
      className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${view === 'custom' ? 'bg-[#BFFF00] text-black' : 'text-zinc-500'}`}
    >
      My Routines
    </button>
    <button 
      onClick={() => setView('ai')}
      className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${view === 'ai' ? 'bg-[#BFFF00] text-black' : 'text-zinc-500'}`}
    >
      AI Discovery
    </button>
  </div>

  {view === 'custom' ? (
    <>
      {/* --- SEARCH & FILTER BAR --- */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
          <input 
            type="text"
            placeholder="Search routines..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-[#BFFF00]/50 transition-colors"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Routine List Area */}
      <div className="space-y-4">
        {loading ? (
          <p className="text-zinc-500 animate-pulse">Loading...</p>
        ) : filteredWorkouts.map((workout) => (
          <GlowCard key={workout._id} className="p-6">
             {/* ... (Your existing workout card code) ... */}
          </GlowCard>
        ))}
      </div>
    </>
  ) : (
    /* THIS IS THE 'AI' VIEW AREA */
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <GlowCard className="p-8">
        <h3 className="text-[#BFFF00] font-black uppercase text-xs tracking-[0.3em] mb-6">AI Parameter Config</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          <section>
            <label className="text-[10px] text-zinc-500 uppercase font-black block mb-2">Weight (kg)</label>
            <input type="number" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm focus:border-[#BFFF00] outline-none" value={aiPrefs.weight} onChange={(e) => setAiPrefs({...aiPrefs, weight: e.target.value})} />
          </section>
          <section>
            <label className="text-[10px] text-zinc-500 uppercase font-black block mb-2">Height (cm)</label>
            <input type="number" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm focus:border-[#BFFF00] outline-none" value={aiPrefs.height} onChange={(e) => setAiPrefs({...aiPrefs, height: e.target.value})} />
          </section>
          <section>
            <label className="text-[10px] text-zinc-500 uppercase font-black block mb-2">Age</label>
            <input type="number" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm focus:border-[#BFFF00] outline-none" value={aiPrefs.age} onChange={(e) => setAiPrefs({...aiPrefs, age: e.target.value})} />
          </section>
          <section>
            <label className="text-[10px] text-zinc-500 uppercase font-black block mb-2">Goal</label>
            <select className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm focus:border-[#BFFF00] outline-none" value={aiPrefs.goal} onChange={(e) => setAiPrefs({...aiPrefs, goal: e.target.value})}>
              <option value="weight loss">Weight Loss</option>
              <option value="muscle gain">Muscle Gain</option>
              <option value="fitness">General Fitness</option>
            </select>
          </section>
          <section>
            <label className="text-[10px] text-zinc-500 uppercase font-black block mb-2">Modality</label>
            <select className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm focus:border-[#BFFF00] outline-none" value={aiPrefs.modality} onChange={(e) => setAiPrefs({...aiPrefs, modality: e.target.value})}>
              <option value="HIIT">HIIT</option>
              <option value="Strength">Strength</option>
              <option value="Yoga">Yoga</option>
            </select>
          </section>
        </div>
        <button 
          onClick={handleAIDiscovery}
          disabled={aiLoading}
          className="w-full mt-8 bg-white text-black py-4 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-[#BFFF00] transition-colors disabled:opacity-50"
        >
          {aiLoading ? "Generating AI Plan..." : "Generate Smart Routine"}
        </button>
      </GlowCard>

      {/* HEALTH INSIGHTS BOXES */}
      {aiHealthData && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-in fade-in duration-700">
          <GlowCard className="p-4 text-center border-[#BFFF00]/20">
            <p className="text-[10px] font-black text-zinc-500 uppercase mb-1">BMI</p>
            <p className="text-xl font-bold text-[#BFFF00]">{aiHealthData.bmi}</p>
          </GlowCard>
          <GlowCard className="p-4 text-center border-[#BFFF00]/20">
            <p className="text-[10px] font-black text-zinc-500 uppercase mb-1">TDEE</p>
            <p className="text-xl font-bold text-[#BFFF00]">{aiHealthData.tdee} kcal</p>
          </GlowCard>
          <GlowCard className="p-4 text-center border-[#BFFF00]/20">
            <p className="text-[10px] font-black text-zinc-500 uppercase mb-1">Daily Target</p>
            <p className="text-xl font-bold text-[#BFFF00]">{aiHealthData.target_calories} kcal</p>
          </GlowCard>
          <GlowCard className="p-4 text-center border-[#BFFF00]/20">
            <p className="text-[10px] font-black text-zinc-500 uppercase mb-1">Status</p>
            <p className="text-xl font-bold text-[#BFFF00]">{aiHealthData.status}</p>
          </GlowCard>
        </div>
      )}

      {/* AI VIDEOS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {aiResults.map((video, idx) => (
           <GlowCard key={idx} className="p-4 bg-black/40">
              <h4 className="font-bold mb-4 text-[#BFFF00] uppercase text-xs tracking-widest">{video.title}</h4>
              <div className="aspect-video rounded-xl overflow-hidden bg-zinc-900">
                 <iframe className="w-full h-full" src={video.embed_url} allowFullScreen title={video.title} />
              </div>
           </GlowCard>
         ))}
      </div>
    </div>
  )}

  <WorkoutModal 
    isOpen={isModalOpen} 
    onClose={() => setIsModalOpen(false)} 
    refreshWorkouts={fetchWorkouts}
    initialData={editingWorkout} 
  />
</main> 

    </div>
  );
}