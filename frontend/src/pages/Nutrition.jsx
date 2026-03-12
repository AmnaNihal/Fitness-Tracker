import { useState, useEffect } from 'react';
import { LayoutDashboard, Activity, PieChart, User, History, LogOut, Utensils, Plus, Trash2 } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import GlowCard from '../components/GlowCard';

export default function Nutrition() {
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [formData, setFormData] = useState({
    foodName: '', calories: '', protein: '', carbs: '', fats: ''
  });

  const fetchLogs = async () => {
    try {
      const token = localStorage.getItem('token'); // Get fresh token manually
      
      const { data } = await API.get('/nutrition', {
        headers: {
          Authorization: `Bearer ${token}` // Force it into the header
        }
      });
      
      setLogs(data);
    } catch (err) { 
      console.error("Fetch Error:", err.response?.data || err.message); 
    }
  };
  useEffect(() => { fetchLogs(); }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/nutrition', formData);
      setFormData({ foodName: '', calories: '', protein: '', carbs: '', fats: '' });
      fetchLogs();
    } catch (err) { console.error(err); }
  };

  const handleClearAll = async () => {
    if (window.confirm("Are you sure you want to delete all nutrition logs?")) {
      try {
        await API.delete('/nutrition');
        setLogs([]); // Clear local state immediately
      } catch (err) {
        console.error("Error clearing logs:", err);
      }
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

      {/* Main Content Area */}
      <main className="flex-1 ml-20 lg:ml-64 p-8 pt-32 lg:pt-12">
        <header className="mb-12">
          <h1 className="text-4xl font-serif italic mb-2">Nutrition</h1>
          <p className="text-zinc-500 font-medium">Track your fuel and macros</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Log Form */}
          <GlowCard className="p-6 h-fit">
            <h3 className="text-[#BFFF00] text-[10px] uppercase font-black tracking-widest mb-6 flex items-center gap-2">
              <Plus size={14} /> Log New Meal
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input 
                type="text" placeholder="Meal Name (e.g. Chicken Salad)"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#BFFF00]/50 outline-none"
                value={formData.foodName}
                onChange={(e) => setFormData({...formData, foodName: e.target.value})}
                required
              />
              
              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="number" placeholder="Calories" 
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#BFFF00]/50"
                  value={formData.calories} 
                  onChange={(e) => setFormData({...formData, calories: e.target.value})} 
                  required 
                />
                <input 
                  type="number" placeholder="Protein (g)" 
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#BFFF00]/50"
                  value={formData.protein} 
                  onChange={(e) => setFormData({...formData, protein: e.target.value})} 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="number" placeholder="Carbs (g)" 
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#BFFF00]/50"
                  value={formData.carbs} 
                  onChange={(e) => setFormData({...formData, carbs: e.target.value})} 
                />
                <input 
                  type="number" placeholder="Fats (g)" 
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#BFFF00]/50"
                  value={formData.fats} 
                  onChange={(e) => setFormData({...formData, fats: e.target.value})} 
                />
              </div>

              <button type="submit" className="w-full bg-[#BFFF00] text-black font-black py-3 rounded-xl uppercase text-xs tracking-widest hover:bg-white transition-all">
                Add to Diary
              </button>
            </form>
          </GlowCard>

          {/* Entries List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between px-2 mb-4">
              <h3 className="text-zinc-500 text-[10px] uppercase font-black tracking-widest">
                Today's Entries
              </h3>
              {logs.length > 0 && (
                <button
                  onClick={handleClearAll}
                  className="text-[10px] uppercase font-black text-red-500 hover:text-red-400 transition-colors flex items-center gap-1"
                >
                  <Trash2 size={12} /> Clear All
                </button>
              )}
            </div>

            {logs.length === 0 ? (
              <div className="p-12 border border-dashed border-white/10 rounded-3xl text-center text-zinc-600">
                No meals logged yet today.
              </div>
            ) : (
              logs.map((log) => (
                <GlowCard key={log._id} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-zinc-900 rounded-xl text-[#BFFF00]">
                      <Utensils size={18} />
                    </div>
                    <div>
                      <h4 className="font-bold">{log.foodName}</h4>
                      <p className="text-xs text-zinc-500">{new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-[#BFFF00]">{log.calories} kcal</p>
                    <p className="text-[9px] text-zinc-600 uppercase font-black">P: {log.protein}g | C: {log.carbs}g | F: {log.fats}g</p>
                  </div>
                </GlowCard>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}