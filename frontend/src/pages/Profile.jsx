import { useState, useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { LayoutDashboard, Activity, Clock, PieChart, User as UserIcon, LogOut, Save, Camera } from 'lucide-react';
import API from '../api/axios';

export default function Profile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    profilePicture: '',
    bio: '',
    weight: '',
    height: '',
    dailyCalorieGoal: ''
  });

  // Fetch from DATABASE on load, not just localStorage
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data } = await API.get('/auth/profile'); // Create this endpoint if needed
        setFormData({
          name: data.name || '',
          email: data.email || '',
          profilePicture: data.profilePicture || '',
          bio: data.bio || '',
          weight: data.weight || '',
          height: data.height || '',
          dailyCalorieGoal: data.dailyCalorieGoal || 2500
        });
      } catch (err) {
        // Fallback to localstorage if fetch fails
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) setFormData(prev => ({ ...prev, ...user }));
      }
    };
    fetchUserData();
  }, []);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2000000) { 
      alert("Image is too large (Under 2MB please)");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, profilePicture: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.put('/auth/profile', formData);
      localStorage.setItem('user', JSON.stringify(data));
      alert('Profile updated successfully!');
    } catch (err) {
      console.error("Update Error:", err);
      alert('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex">
      {/* Sidebar - Remains exactly as your provided code */}
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
            { icon: UserIcon, label: 'Profile', path: '/profile' },
            { icon: Clock, label: 'History', path: '/history' },
          ].map((item) => (
            <NavLink key={item.label} to={item.path} className={({ isActive }) => `w-full flex items-center gap-4 p-3 rounded-xl transition-colors ${isActive ? 'bg-[#BFFF00] text-black font-bold' : 'text-zinc-500 hover:bg-white/5 hover:text-[#BFFF00]'}`}>
              <item.icon size={20} />
              <span className="hidden lg:block text-sm uppercase tracking-widest font-bold">{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <button onClick={handleLogout} className="flex items-center gap-4 p-3 text-zinc-500 hover:text-[#BFFF00] transition-colors mt-auto group">
          <LogOut size={20} />
          <span className="hidden lg:block text-sm uppercase tracking-widest font-bold">Logout</span>
        </button>
      </aside>

      <main className="flex-1 ml-20 lg:ml-64 p-8 flex justify-center items-start pt-20">
        <div className="max-w-2xl w-full pb-20">
          <header className="mb-10 text-center lg:text-left">
            <h1 className="text-4xl font-serif italic mb-2">Profile Settings</h1>
            <p className="text-zinc-500">Keep your information up to date</p>
          </header>

          <form onSubmit={handleUpdate} className="space-y-6 bg-white/[0.02] border border-white/5 p-8 rounded-3xl">
            {/* Profile Pic Header */}
            <div className="flex flex-col items-center gap-6 mb-10">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#BFFF00]/20 group-hover:border-[#BFFF00] transition-all relative">
                  <img 
                    src={formData.profilePicture || 'https://via.placeholder.com/150'} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                  <label htmlFor="file-upload" className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                    <Camera className="text-[#BFFF00] mb-1" size={20} />
                    <span className="text-[10px] font-bold uppercase text-white">Change</span>
                  </label>
                </div>
              </div>
              <input id="file-upload" type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Full Name</label>
                <input type="text" className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#BFFF00] outline-none" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Email Address</label>
                <input type="email" className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#BFFF00] outline-none" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
              </div>
            </div>

            {/* Physical Stats Section */}
            <div className="pt-4 border-t border-white/5">
              <h3 className="text-[#BFFF00] text-[10px] uppercase font-black tracking-widest mb-6">Physical Stats & Goals</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Weight (kg)</label>
                  <input type="number" className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#BFFF00] outline-none" value={formData.weight} onChange={(e) => setFormData({...formData, weight: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Height (cm)</label>
                  <input type="number" className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#BFFF00] outline-none" value={formData.height} onChange={(e) => setFormData({...formData, height: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Calorie Goal</label>
                  <input type="number" className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#BFFF00] outline-none font-bold text-[#BFFF00]" value={formData.dailyCalorieGoal} onChange={(e) => setFormData({...formData, dailyCalorieGoal: e.target.value})} />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Bio</label>
              <textarea rows="3" className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#BFFF00] outline-none resize-none" value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})} />
            </div>

            <button type="submit" disabled={loading} className="w-full bg-[#BFFF00] text-black font-black uppercase tracking-widest text-xs py-4 rounded-xl hover:bg-white transition-all flex items-center justify-center gap-2">
              {loading ? "Updating..." : <><Save size={16} /> Save Profile Changes</>}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}