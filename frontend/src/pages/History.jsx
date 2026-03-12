import { useEffect, useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { LayoutDashboard, Activity, PieChart, User, LogOut, Clock, Trash2, Calendar } from 'lucide-react';
import API from '../api/axios';
import GlowCard from '../components/GlowCard';

export default function History() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchLogs = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await API.get('/logs', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLogs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = async () => {
    if (window.confirm("Are you sure you want to wipe your entire workout history? This cannot be undone.")) {
      try {
        const token = localStorage.getItem('token');
        await API.delete('/logs', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setLogs([]);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  useEffect(() => { fetchLogs(); }, []);

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
            { icon: Clock, label: 'History', path: '/history' },
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

      <main className="flex-1 ml-20 lg:ml-64 p-8">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-serif italic mb-2">History</h1>
            <p className="text-zinc-500 font-medium">Your past achievements</p>
          </div>
          {logs.length > 0 && (
            <button 
              onClick={clearHistory}
              className="flex items-center gap-2 px-4 py-2 border border-red-500/20 text-red-500 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
            >
              <Trash2 size={14} /> Clear All
            </button>
          )}
        </header>

        <div className="space-y-6">
          {loading ? (
            <p className="text-zinc-500 animate-pulse">Loading history...</p>
          ) : logs.length > 0 ? (
            logs.map((log) => (
              <GlowCard key={log._id} className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/5 rounded-full text-[#BFFF00]">
                      <Calendar size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{log.workoutName}</h3>
                      <p className="text-zinc-500 text-xs uppercase tracking-widest font-bold">
                        {new Date(log.completedAt).toLocaleDateString('en-US', { 
                          weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 text-[10px] font-black uppercase tracking-widest bg-[#BFFF00]/10 text-[#BFFF00] px-3 py-1 rounded-full border border-[#BFFF00]/20">
                    {log.category}
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-white/5">
                  {log.exercises.map((ex, i) => (
                    <div key={i} className="bg-white/[0.02] p-2 rounded-lg">
                      <p className="text-white text-sm font-medium truncate">{ex.exerciseName}</p>
                      <p className="text-zinc-500 text-[10px] font-mono">{ex.sets} sets • {ex.reps} reps</p>
                    </div>
                  ))}
                </div>
              </GlowCard>
            ))
          ) : (
            <div className="text-center py-20 border border-dashed border-white/5 rounded-3xl">
              <Clock size={48} className="mx-auto text-zinc-800 mb-4" />
              <p className="text-zinc-500">No sessions logged yet. Complete a workout to see it here!</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}