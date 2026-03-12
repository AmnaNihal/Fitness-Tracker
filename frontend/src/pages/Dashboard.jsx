import { motion } from 'framer-motion';
import { useNavigate, NavLink } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react'; 
import { generatePDFReport } from '../utils/reportGenerator'; 

import { 
  LayoutDashboard, User, Activity, PieChart, 
  Bell, Settings, LogOut, Plus, ChevronRight, History, Download 
} from 'lucide-react';

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import GlowCard from '../components/GlowCard';
import API from '../api/axios'; 
import WorkoutModal from '../components/WorkoutModal';

export default function Dashboard() {
  const navigate = useNavigate();
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal State

  // Get user data from localStorage
  const userString = localStorage.getItem('user');
  const userData = userString ? JSON.parse(userString) : null;
  const userName = userData?.name || 'User'; 

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login', { replace: true });
  }; 



//---------------------------------------------------- Diary --------------------------------------------- 
const [diary, setDiary] = useState('');
const [isSavingDiary, setIsSavingDiary] = useState(false); 


const saveDiary = async () => {
  setIsSavingDiary(true);
  try {
    const token = localStorage.getItem('token');
    await API.put('/auth/profile', { diary }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    // Optional: show a small toast or success state
  } catch (err) {
    console.error("Diary save error:", err);
  } finally {
    setIsSavingDiary(false);
  }
};




// ------------------------ Report Generation ------------------------ 

const handleExport = async () => {
  await generatePDFReport(userProfile, workouts);
};


  //--------------------------------------------- Workouts ---------------------------------------------
  const fetchWorkouts = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return; // Don't even try if there's no token
  
      const { data } = await API.get('/workouts', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log("Workouts fetched:", data); // Check if data actually arrives here
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




  //--------------------------------------------- Stats and Bio --------------------------------------------- 

const [userProfile, setUserProfile] = useState({
  weight: 0,
  height: 0,
  bio: '',
  dailyCalorieGoal: 2500
});

// Fetch profile data (Bio & Stats)
const fetchProfileData = useCallback(async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return;

    const { data } = await API.get('/auth/profile', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    // 1. Set your stats (Weight, Height, etc.)
    setUserProfile(data); 

    // 2. Set the diary text so it appears in the notebook
    // We use || '' just in case the diary is currently empty in the DB
    setDiary(data.diary || ''); 

  } catch (err) {
    console.error("Error fetching profile stats:", err);
  }
}, []);

useEffect(() => {
  fetchProfileData();
}, [fetchProfileData]);






// -------------------------------- Progress Chart -------------------------------

  const [logs, setLogs] = useState([]);

  const fetchLogs = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await API.get('/logs', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLogs(data);
    } catch (err) {
      console.error("Error fetching logs:", err);
    }
  };
  
  useEffect(() => {
    fetchLogs();
  }, []);
  


// Chart Data
const getChartData = () => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  // last 7 days template
  const last7Days = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return { 
      name: days[d.getDay()], 
      volume: 0, 
      rawDate: d.toDateString() 
    };
  }).reverse();

  // Map the Logs to the Chart
  logs.forEach(log => {
    // completedAt as in MongoDB screenshot
    const logDate = new Date(log.completedAt).toDateString();
    const dayEntry = last7Days.find(d => d.rawDate === logDate);
    
    if (dayEntry && log.exercises) {
      // Total volume of log
      const sessionVolume = log.exercises.reduce((acc, ex) => {
        return acc + (Number(ex.sets || 0) * Number(ex.reps || 0));
      }, 0);
      
      dayEntry.volume += sessionVolume;
    }
  });

  return last7Days;
};


// -------------------------------- Notifications ---------------------------------------------
const [showNotifications, setShowNotifications] = useState(false);
const notifications = userProfile.notifications || [];
const unreadCount = notifications.filter(n => !n.read).length;



const markNotificationsRead = async () => {
  try {
    const token = localStorage.getItem('token');
    await API.put('/auth/notifications/read', {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    // Update local state to hide the dot immediately
    setUserProfile(prev => ({
      ...prev,
      notifications: prev.notifications.map(n => ({ ...n, read: true }))
    }));
  } catch (err) {
    console.error("Error marking notifications as read", err);
  }
};





// ------------------------------- Nutrition Data ------------------------------- 

const [nutritionLogs, setNutritionLogs] = useState([]);

const fetchNutrition = async () => {
  try {
    const token = localStorage.getItem('token');
    const { data } = await API.get('/nutrition', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setNutritionLogs(data);
  } catch (err) {
    console.error("Error fetching nutrition:", err);
  }
};

useEffect(() => {
  fetchNutrition();
}, []);


// Live Nutrition Data

const getTodayNutrition = () => {
  const today = new Date().toDateString();
  
  return nutritionLogs
    .filter(log => new Date(log.createdAt).toDateString() === today)
    .reduce((acc, curr) => ({
      calories: acc.calories + (curr.calories || 0),
      protein: acc.protein + (curr.protein || 0),
      carbs: acc.carbs + (curr.carbs || 0),
      fats: acc.fats + (curr.fats || 0),
    }), { calories: 0, protein: 0, carbs: 0, fats: 0 });
};

const dailyTotals = getTodayNutrition();
const calorieGoal = 2500;  

const percentage = Math.min(dailyTotals.calories / calorieGoal, 1);
const dynamicOffset = 440 - (440 * percentage);





//------------------------ Alerts --------------------------------------

const calorieAlert = dailyTotals.calories > userProfile.dailyCalorieGoal ? {
  message: "Calorie limit exceeded! ⚠️",
  type: "alert"
} : null;


useEffect(() => {
  const checkCalorieGoal = async () => {
    // 1. Basic check: Are we over the limit?
    if (dailyTotals.calories > userProfile.dailyCalorieGoal && userProfile.dailyCalorieGoal > 0) {
      
      // 2. Prevention: Have we already alerted for today?
      const alreadyNotified = userProfile.notifications?.some(n => 
        n.message.includes("Calorie limit") && 
        new Date(n.createdAt).toDateString() === new Date().toDateString()
      );

      if (!alreadyNotified) {
        try {
          const token = localStorage.getItem('token');
          
          // 3. The API call to save the alert
          await API.post('/auth/notifications', {
            message: `Calorie limit exceeded! (${dailyTotals.calories} / ${userProfile.dailyCalorieGoal}) ⚠️`,
            type: 'alert'
          }, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          // 4. THE FIX: Refresh the local state immediately
          // This makes the bell icon update without a page refresh
          fetchProfileData(); 

        } catch (err) {
          console.error("Failed to send calorie alert", err);
        }
      }
    }
  };

  checkCalorieGoal();
}, [dailyTotals.calories, userProfile.dailyCalorieGoal, fetchProfileData]); 



const handleReminderToggle = async (type) => {
  // 'type' will be either 'workout' or 'meal'
  const currentSetting = userProfile.settings?.reminders[type];
  
  // Construct the updated settings object
  const updatedSettings = {
    settings: {
      reminders: {
        [type]: {
          ...currentSetting,
          enabled: !currentSetting.enabled
        }
      }
    }
  };

  try {
    const token = localStorage.getItem('token');
    const { data } = await API.put('/auth/profile', updatedSettings, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    // Update local state so the UI toggle flips immediately
    setUserProfile(data);
  } catch (err) {
    console.error(`Error toggling ${type} reminder:`, err);
  }
};



const triggerReminder = async (message) => {
  try {
    const token = localStorage.getItem('token');
    
    // 1. Persist the reminder to the database
    await API.post('/auth/notifications', {
      message: message,
      type: 'info'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    // 2. Refresh the UI to show the new notification dot
    fetchProfileData();

    // 3. Optional: Play a subtle notification sound
    // new Audio('/notification-sound.mp3').play().catch(() => {});
    
    console.log("Reminder Triggered:", message);
  } catch (err) {
    console.error("Failed to trigger reminder", err);
  }
}; 



const [lastTriggered, setLastTriggered] = useState(null);

useEffect(() => {
  const timer = setInterval(() => {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const today = now.toDateString();

    const workout = userProfile.settings?.reminders?.workout;
    const meal = userProfile.settings?.reminders?.meal;

    // Check Workout Reminder
    if (workout?.enabled && workout?.time === currentTime) {
      const lockKey = `workout-${today}-${workout.time}`;
      if (lastTriggered !== lockKey) {
        triggerReminder("Time for your scheduled workout! 🏋️‍♂️");
        setLastTriggered(lockKey);
      }
    }

    // Check Meal Reminder
    if (meal?.enabled && meal?.time === currentTime) {
      const lockKey = `meal-${today}-${meal.time}`;
      if (lastTriggered !== lockKey) {
        triggerReminder("Don't forget to log your meal! 🥗");
        setLastTriggered(lockKey);
      }
    }
  }, 10000); // Checks every 10 seconds

  return () => clearInterval(timer);
}, [userProfile.settings, lastTriggered, triggerReminder]);





//-------------------------------------- Time Logic ------------------------------------ 

const handleTimeChange = async (type, newTime) => {
  // Construct the nested update object
  const updatedSettings = {
    settings: {
      reminders: {
        [type]: {
          ...userProfile.settings.reminders[type],
          time: newTime
        }
      }
    }
  };

  try {
    const token = localStorage.getItem('token');
    const { data } = await API.put('/auth/profile', updatedSettings, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    // Sync local state so the input shows the new time
    setUserProfile(data);
  } catch (err) {
    console.error(`Error updating ${type} time:`, err);
  }
};








// --------------------------------------------------------------------------------

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
       {/* Header Section */}
<header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-12">
  <div>
    <h1 className="text-4xl font-serif italic mb-2">Morning, {userName}</h1>
    <p className="text-zinc-500 font-medium tracking-wide">Ready to hit your targets today?</p>
  </div>
  <div className="flex items-center gap-4">
    <button onClick={() => {setShowNotifications(!showNotifications); if (!showNotifications) markNotificationsRead();}}
     className="p-3 bg-zinc-900 border border-white/5 rounded-xl text-zinc-400 relative">
      <Bell size={20} /> 
        {unreadCount > 0 && (
      <span className="absolute top-2 right-2 w-2 h-2 bg-[#BFFF00] rounded-full border-2 border-black" />
        )} 

{/* Dropdown Menu */}
{showNotifications && (
    <div className="absolute right-0 mt-4 w-72 bg-black border border-white/10 rounded-2xl shadow-2xl z-50 p-4 max-h-80 overflow-y-auto">
      <h4 className="text-[10px] uppercase font-black tracking-widest text-zinc-500 mb-4">Notifications</h4>
      {notifications.length > 0 ? (
        notifications.reverse().map((n, i) => (
          <div key={i} className="mb-3 p-3 bg-white/[0.02] border border-white/5 rounded-xl text-xs">
            <p className="text-zinc-300">{n.message}</p>
            <span className="text-[8px] text-zinc-600 uppercase font-bold">{new Date(n.createdAt).toLocaleTimeString()}</span>
          </div>
        ))
      ) : (
        <p className="text-zinc-600 text-[10px] italic">No new activity.</p>
      )}
    </div>
  )}

    </button>
    
    
    <div 
      className="w-12 h-12 rounded-xl overflow-hidden border-2 border-[#BFFF00]/20 hover:border-[#BFFF00] transition-all cursor-pointer bg-zinc-900"
      onClick={() => navigate('/profile')}
    >
      <img 
        src={userData?.profilePicture || 'https://via.placeholder.com/150'} 
        alt="User Profile" 
        className="w-full h-full object-cover"
      />
    </div>
  </div>
</header> 



{/* Alert */}
{calorieAlert && (
  <motion.div 
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500 text-sm font-bold"
  >
    <Bell size={16} />
    {calorieAlert.message}
  </motion.div>
)}



{/* NEW: Bio and Stats Row */}
<div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
    {/* Athlete Bio Card */}
    <GlowCard className="lg:col-span-2 p-6 flex flex-col justify-center">
      <h3 className="text-[#BFFF00] text-[10px] uppercase font-black tracking-widest mb-3">Athlete Bio</h3>
      <p className="text-zinc-400 text-sm italic leading-relaxed">
        {userProfile.bio || "No bio set. Visit your profile to add a personal touch to your fitness journey."}
      </p>
    </GlowCard>

    {/* Physical Stats Card */}
    <GlowCard className="p-6">
      <h3 className="text-zinc-500 text-[10px] uppercase font-black tracking-widest mb-6">Quick Stats</h3>
      <div className="space-y-4">
        <div className="flex justify-between items-end border-b border-white/5 pb-2">
          <span className="text-zinc-600 text-[10px] uppercase font-black">Weight</span>
          <span className="text-xl font-black">{userProfile.weight}<span className="text-[10px] text-[#BFFF00] ml-1">KG</span></span>
        </div>
        <div className="flex justify-between items-end border-b border-white/5 pb-2">
          <span className="text-zinc-600 text-[10px] uppercase font-black">Height</span>
          <span className="text-xl font-black">{userProfile.height}<span className="text-[10px] text-[#BFFF00] ml-1">CM</span></span>
        </div>
        <div className="flex justify-between items-end">
          <span className="text-zinc-600 text-[10px] uppercase font-black">BMI</span>
          <span className="text-xl font-black text-[#BFFF00]">
            {userProfile.height > 0 
              ? (userProfile.weight / ((userProfile.height / 100) ** 2)).toFixed(1) 
              : "--"}
          </span>
        </div>
      </div>
    </GlowCard>
  </div> 


{/* ------------- Diary/Notebook ---------------  */}


<GlowCard className="p-6 mt-8 mb-8">
  <div className="flex justify-between items-center mb-4">
    <h3 className="text-[#BFFF00] text-[10px] uppercase font-black tracking-widest">Journey Diary</h3>
    <button 
      onClick={saveDiary}
      disabled={isSavingDiary}
      className="text-[10px] uppercase font-black tracking-widest px-3 py-1 bg-[#BFFF00] text-black rounded-md hover:bg-white transition-colors"
    >
      {isSavingDiary ? 'Saving...' : 'Save Notes'}
    </button>
  </div>
  <textarea
    value={diary}
    onChange={(e) => setDiary(e.target.value)}
    placeholder="How are you feeling today? Any specific wins or struggles?..."
    className="w-full h-32 bg-white/[0.02] border border-white/5 rounded-2xl p-4 text-zinc-400 text-sm focus:outline-none focus:border-[#BFFF00]/30 transition-all resize-none"
  /> 
</GlowCard>

{/* Progress Chart & Nutrition Row */}
<div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <GlowCard className="lg:col-span-2 p-8">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-zinc-500 text-[10px] uppercase font-black tracking-widest">Recent Activity</h3>
              <button 
                onClick={() => navigate('/workouts')} 
                className="text-[#BFFF00] text-[10px] uppercase font-black tracking-widest flex items-center gap-1">
                View All <ChevronRight size={12} />
              </button>
            </div>
            
            <div className="space-y-4">
              {loading ? (
                <p className="text-zinc-500 animate-pulse">Loading your progress...</p>
              ) : workouts.length > 0 ? (
                workouts.slice(0, 3).map((workout) => ( // Showing top 3 for layout balance
                  <div key={workout._id} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-[#BFFF00]/10 rounded-full flex items-center justify-center">
                        <Activity size={18} className="text-[#BFFF00]" />
                      </div>
                      <div>
                        <p className="font-bold text-sm">{workout.name}</p>
                        <p className="text-zinc-600 text-[10px] uppercase font-black tracking-widest">
                          {new Date(workout.createdAt).toLocaleDateString()} • {workout.category}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                        <span className="font-black text-sm block">{workout.exercises?.length || 0} Exercises</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 border border-dashed border-white/10 rounded-2xl">
                  <p className="text-zinc-500 text-sm italic">No workouts found.</p>
                </div>
              )}
            </div>
          </GlowCard>

          {/* RESTORED NUTRITION LOG CARD */}
          <GlowCard className="p-8 flex flex-col">
            <h3 className="text-zinc-500 text-[10px] uppercase font-black tracking-widest mb-8">Nutrition Logs</h3>
            <div className="flex-1 flex flex-col justify-center items-center">
              <div className="relative w-40 h-40 flex items-center justify-center mb-6">
                <svg className="absolute inset-0 w-full h-full -rotate-90">
                  <circle cx="80" cy="80" r="70" stroke="#18181b" strokeWidth="12" fill="none" />
                  <motion.circle 
                    cx="80" cy="80" r="70" 
                    stroke="#BFFF00" strokeWidth="12" fill="none" 
                    strokeDasharray="440" 
                    initial={{ strokeDashoffset: 440 }} 
                    animate={{ strokeDashoffset: dynamicOffset }} 
                    transition={{ duration: 1, ease: "easeOut" }}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="text-center">
                  <span className="block text-3xl font-black">{dailyTotals.calories.toLocaleString()}</span>
                  <span className="text-zinc-500 text-[10px] uppercase font-black">kcal</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 w-full text-center">
                <div>
                  <p className="text-white font-bold text-sm">{dailyTotals.protein}g</p>
                  <p className="text-zinc-600 text-[9px] uppercase font-black">Protein</p>
                </div>
                <div>
                  <p className="text-white font-bold text-sm">{dailyTotals.carbs}g</p>
                  <p className="text-zinc-600 text-[9px] uppercase font-black">Carbs</p>
                </div>
                <div>
                  <p className="text-white font-bold text-sm">{dailyTotals.fats}g</p>
                  <p className="text-zinc-600 text-[9px] uppercase font-black">Fats</p>
                </div>
              </div>
            </div>
          </GlowCard>
        </div>

        {/* Total Volume Chart Section */}
        <GlowCard className="p-8 mb-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h3 className="text-zinc-500 text-[10px] uppercase font-black tracking-widest mb-1">Total Volume</h3>
              <p className="text-white text-lg font-bold">Exercises Completed</p>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="text-[#BFFF00] text-[10px] uppercase font-black tracking-widest flex items-center gap-2 px-4 py-2 bg-[#BFFF00]/10 rounded-lg hover:bg-[#BFFF00]/20 transition-all"
            >
              <Plus size={14} /> New Session
            </button>
          </div>

          <div id="volume-chart-id" className="h-64 w-full bg-[#09090b] p-4 rounded-xl">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={getChartData()}>
                <defs>
                  <linearGradient id="colorEx" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#BFFF00" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#BFFF00" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#3f3f46', fontSize: 10, fontWeight: 900}} 
                />
                <YAxis hide domain={[0, 'auto']} />
                <Tooltip 
                  formatter={(value) => [`${value} reps`, 'Total Volume']}
                  contentStyle={{ backgroundColor: '#050505', border: '1px solid #ffffff10', borderRadius: '12px' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="volume" 
                  stroke="#BFFF00" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#colorEx)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlowCard>

       {/* Reminders & PDF Export */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
    <GlowCard className="p-6">  
        <h3 className="text-zinc-500 text-[10px] uppercase font-black tracking-widest mb-6">Reminders & Alerts</h3>
        <div className="space-y-6">
            
            {/* Workout Reminder Row */}
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <p className="text-sm font-bold">Workout Reminder</p>
                    <div className="flex items-center gap-2">
                      <input 
                          type="time"
                          value={userProfile.settings?.reminders?.workout?.time || "08:00"}
                          onChange={(e) => handleTimeChange('workout', e.target.value)}
                          className="bg-transparent text-[#BFFF00] text-sm font-black tracking-widest focus:outline-none cursor-pointer border-b border-white/10 hover:border-[#BFFF00]/50 transition-all py-1"
                          style={{ colorScheme: 'dark' }} 
                      />
                    </div>
                </div>
                <div onClick={() => handleReminderToggle('workout')} className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${userProfile.settings?.reminders?.workout?.enabled ? 'bg-[#BFFF00]' : 'bg-zinc-800'}`}>
                    <motion.div animate={{ x: userProfile.settings?.reminders?.workout?.enabled ? 22 : 4 }} className="absolute top-1 w-3 h-3 bg-black rounded-full" />
                </div>
            </div>

            {/* RESTORED: Nutrition Check Row */}
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <p className="text-sm font-bold">Nutrition Check</p>
                    <div className="flex items-center gap-2">
                      <input 
                          type="time"
                          value={userProfile.settings?.reminders?.meal?.time || "12:00"}
                          onChange={(e) => handleTimeChange('meal', e.target.value)}
                          className="bg-transparent text-[#BFFF00] text-sm font-black tracking-widest focus:outline-none cursor-pointer border-b border-white/10 hover:border-[#BFFF00]/50 transition-all py-1"
                          style={{ colorScheme: 'dark' }} 
                      />
                    </div>
                </div>
                <div onClick={() => handleReminderToggle('meal')} className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${userProfile.settings?.reminders?.meal?.enabled ? 'bg-[#BFFF00]' : 'bg-zinc-800'}`}>
                    <motion.div animate={{ x: userProfile.settings?.reminders?.meal?.enabled ? 22 : 4 }} className="absolute top-1 w-3 h-3 bg-black rounded-full" />
                </div>
            </div>
        </div>
    </GlowCard>

    {/* PDF Export Card */}
    <GlowCard className="p-6 flex flex-col justify-center items-center gap-4">
        <h3 className="text-zinc-500 text-[10px] uppercase font-black tracking-widest">Reports</h3>
        <button 
          onClick={handleExport}
          className="w-full flex items-center justify-center gap-2 px-4 py-4 bg-zinc-800 hover:bg-[#BFFF00] hover:text-black text-white rounded-xl border border-white/10 transition-all group"
        >
          <Download size={20} />
          <span className="text-sm font-black uppercase tracking-widest">Export PDF Report</span>
        </button>
    </GlowCard>
</div>

        <WorkoutModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          refreshWorkouts={fetchWorkouts} 
        />

      </main>
    </div>
  );
}