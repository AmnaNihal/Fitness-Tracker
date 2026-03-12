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
            <p className="text-zinc-500 font-medium tracking-wide">Manage your custom routines</p>
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


{/* --- SEARCH & FILTER BAR --- */}
<div className="flex flex-col md:flex-row gap-4 mb-8">
  <div className="flex-1 relative">
    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
    <input 
      type="text"
      placeholder="Search by name or #tag..."
      className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-[#BFFF00]/50 transition-colors"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
    />
  </div>

  {/* NEW DROPDOWN CATEGORY FILTER */}
  <div className="relative min-w-[160px]">
    <select
      value={activeCategory}
      onChange={(e) => setActiveCategory(e.target.value)}
      className="w-full appearance-none bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-widest text-zinc-400 focus:outline-none focus:border-[#BFFF00]/50 cursor-pointer"
    >
      <option value="All" className="bg-black">All Categories</option>
      <option value="Strength" className="bg-black">Strength</option>
      <option value="Cardio" className="bg-black">Cardio</option> 
      <option value="Cardio" className="bg-black">Flexibility</option>
      <option value="Cardio" className="bg-black">HIIT</option>
      {/* Add more <option> tags here as you grow */}
    </select>
    {/* Custom arrow icon for the dropdown */}
    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" size={14} />
  </div>
</div>


{/* Routine List Area */}
<div className="space-y-4">
  {loading ? (
    <p className="text-zinc-500 animate-pulse">Loading...</p>
  ) : filteredWorkouts.length > 0 ? (
    /* CHANGE THIS LINE FROM workouts.map TO filteredWorkouts.map */
    filteredWorkouts.map((workout) => (
      <GlowCard key={workout._id} className="p-6">
        {/* ... the rest of your card code remains exactly the same ... */}
        <div className="flex items-center justify-between">
          <div 
            className="flex items-center gap-4 cursor-pointer flex-1"
            onClick={() => setExpandedId(expandedId === workout._id ? null : workout._id)}
          >
            <Activity size={20} className="text-[#BFFF00]" />
            <div>
              <h3 className="font-bold text-lg">{workout.name}</h3>
              <div className="flex items-center gap-3">
                <p className="text-zinc-600 text-[10px] uppercase font-black tracking-widest">
                  {workout.category}
                </p>
                {workout.tags && workout.tags.length > 0 && (
                  <div className="flex gap-2">
                    {workout.tags.map((tag, index) => (
                      <span key={index} className="text-[#BFFF00] text-[9px] font-bold uppercase tracking-tighter opacity-70">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
            {expandedId === workout._id ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
          </div>

          <div className="flex gap-2">
            <button onClick={() => { setEditingWorkout(workout); setIsModalOpen(true); }} className="p-2 text-zinc-500 hover:text-white">
              <Edit3 size={18} />
            </button>
            <button onClick={() => handleDelete(workout._id)} className="p-2 text-zinc-500 hover:text-red-500">
              <Trash2 size={18} />
            </button>
          </div>
        </div>

        {expandedId === workout._id && (
          <div className="mt-6 border-t border-white/5 pt-4 space-y-3"> 
            {workout.notes && (
              <div className="bg-[#BFFF00]/5 border-l-2 border-[#BFFF00] p-3 rounded-r-lg mb-3">
                <p className="text-[10px] uppercase font-black text-[#BFFF00] tracking-widest mb-1">
                  Coaching Notes
                </p>
                <p className="text-zinc-400 text-sm italic">"{workout.notes}"</p>
              </div>
            )}
         
         
           {workout.exercises?.map((ex, i) => (
  <div key={i} className="flex items-center justify-between bg-white/[0.02] p-3 rounded-lg border border-white/5">
    <div className="flex items-center gap-3">
       <input 
         type="checkbox" 
         className="accent-[#BFFF00] w-4 h-4 cursor-pointer"
         // CONNECTED LOGIC
         checked={ex.completed || false}
         onChange={() => handleToggleExercise(workout._id, ex._id, ex.completed)}
       />
       <span className={`text-sm font-medium ${ex.completed ? 'text-zinc-500 line-through' : 'text-white'}`}>
         {ex.exerciseName}
       </span>
    </div>
    <div className="text-zinc-500 text-xs font-mono">
      {ex.sets}s × {ex.reps}r — {ex.weight}kg
    </div>
  </div>
))}

{/* Workout Logs */}

<button 
  onClick={() => handleCompleteWorkout(workout)}
  className="w-full mt-6 bg-[#BFFF00] text-black py-4 rounded-xl font-black uppercase text-xs tracking-[0.2em] hover:bg-white transition-all active:scale-[0.98] flex items-center justify-center gap-3"
>
  <div className="w-1.5 h-1.5 bg-black rounded-full animate-pulse" />
  Complete Session & Sync Log
</button>


          </div>
        )}
      </GlowCard>
    ))
  ) : (
    /* Helpful message if search returns nothing */
    <div className="text-center py-12 border border-dashed border-white/5 rounded-2xl">
      <p className="text-zinc-500">No routines found matching your filters.</p>
    </div>
  )}
</div>

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