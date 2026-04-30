import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Trophy, 
  Target, 
  Zap, 
  Clock, 
  ChevronRight, 
  LogOut, 
  Settings, 
  Plus, 
  BarChart3,
  Calendar
} from 'lucide-react';

const StatCard = ({ label, value, icon: Icon, colorClass, delay = "" }) => (
  <div className={`bg-[#0f0f14] border border-white/5 rounded-2xl p-6 relative group overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700 ${delay}`}>
    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
      <Icon className="w-16 h-16" />
    </div>
    <div className={`p-2.5 rounded-xl bg-white/5 mb-4 inline-block ${colorClass}`}>
      <Icon className="w-5 h-5" />
    </div>
    <div className="flex flex-col">
      <span className="text-2xl font-black text-white tracking-tight">{value}</span>
      <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mt-1">{label}</span>
    </div>
  </div>
);

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalInterviews: 12,
    solvedQuestions: 34,
    accuracy: 88,
    streak: 5
  });

  const recentSessions = [
    { id: 1, topic: 'Arrays & Strings', date: '2024-04-28', score: 92, status: 'Completed' },
    { id: 2, topic: 'Dynamic Programming', date: '2024-04-26', score: 78, status: 'Completed' },
    { id: 3, topic: 'System Design', date: '2024-04-25', score: 85, status: 'Completed' },
  ];

  return (
    <div className="min-h-screen bg-[#060608] text-neutral-200 font-sans relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-96 bg-violet-500/5 blur-[120px] rounded-full pointer-events-none" />
      
      {/* Sidebar/Nav */}
      <div className="fixed top-0 left-0 bottom-0 w-20 bg-[#0a0a0e] border-r border-white/5 flex flex-col items-center py-8 z-50">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center mb-12 shadow-lg shadow-violet-500/20 group cursor-pointer" onClick={() => navigate('/')}>
          <Zap className="w-6 h-6 text-white fill-current" />
        </div>
        
        {/* Navigation options removed as there is only one dashboard */}
        <div className="flex-1" />

        <button 
          onClick={logout}
          className="p-3 text-neutral-500 hover:text-rose-400 transition-colors cursor-pointer"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>

      {/* Main Content */}
      <div className="pl-20">
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-10 bg-[#0a0a0e]/50 backdrop-blur-xl sticky top-0 z-40">
           <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-500 to-cyan-400 flex items-center justify-center text-[10px] font-black text-white">
                {user?.name?.[0] || 'U'}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-white tracking-tight">{user?.name || 'Candidate'}</span>
                <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Premium Engineer</span>
              </div>
           </div>

           <button 
             onClick={() => navigate('/')}
             className="flex items-center gap-2 px-5 py-2 bg-violet-600 hover:bg-violet-500 text-white text-[11px] font-black uppercase tracking-widest rounded-xl transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-violet-600/20"
           >
             <Plus className="w-3.5 h-3.5" />
             New Interview
           </button>
        </header>

        <main className="max-w-6xl mx-auto py-12 px-10 space-y-12">
          {/* Welcome Section */}
          <div className="space-y-2 animate-in fade-in slide-in-from-left-4 duration-700">
            <h1 className="text-4xl font-black text-white tracking-tighter">Command Center</h1>
            <p className="text-neutral-500 text-sm font-medium">Welcome back, {user?.name?.split(' ')[0]}. Your technical growth is exponential.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard label="Total Sessions" value={stats.totalInterviews} icon={Clock} colorClass="text-indigo-400" />
            <StatCard label="Questions Solved" value={stats.solvedQuestions} icon={Trophy} colorClass="text-emerald-400" delay="delay-100" />
            <StatCard label="Avg Accuracy" value={`${stats.accuracy}%`} icon={Target} colorClass="text-cyan-400" delay="delay-200" />
            <StatCard label="Practice Streak" value={`${stats.streak} Days`} icon={Zap} colorClass="text-amber-400" delay="delay-300" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Recent Sessions */}
            <div className="lg:col-span-2 space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-400">
               <div className="flex items-center justify-between">
                  <h3 className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.3em]">Recent Deployments</h3>
                  <button className="text-[10px] font-black text-violet-400 uppercase tracking-widest hover:text-violet-300">View All Archive</button>
               </div>
               
               <div className="space-y-4">
                  {recentSessions.map((session, idx) => (
                    <div key={session.id} className="bg-[#0f0f14] border border-white/5 rounded-2xl p-5 flex items-center justify-between group hover:border-violet-500/30 transition-all cursor-pointer">
                       <div className="flex items-center gap-5">
                          <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-violet-400 group-hover:scale-110 transition-transform">
                             <Target className="w-5 h-5" />
                          </div>
                          <div className="flex flex-col">
                             <span className="text-sm font-bold text-white group-hover:text-violet-300 transition-colors">{session.topic}</span>
                             <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mt-0.5">{session.date}</span>
                          </div>
                       </div>

                       <div className="flex items-center gap-8">
                          <div className="flex flex-col items-end">
                             <span className={`text-sm font-black ${session.score >= 80 ? 'text-emerald-400' : 'text-amber-400'}`}>{session.score}%</span>
                             <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mt-0.5">Performance</span>
                          </div>
                          <ChevronRight className="w-5 h-5 text-neutral-700 group-hover:text-white transition-colors" />
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            {/* Sidebar Cards */}
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-700 delay-500">
               <div className="bg-gradient-to-br from-violet-600 to-indigo-700 rounded-3xl p-8 relative overflow-hidden group shadow-2xl shadow-violet-600/10">
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
                  <h4 className="text-white font-black text-xl tracking-tight mb-2">Upgrade to Pro</h4>
                  <p className="text-violet-100/70 text-xs font-medium leading-relaxed mb-6">Unlock FAANG-specific question sets and unlimited AI reviews.</p>
                  <button className="w-full py-3 bg-white text-violet-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all">Get Lifetime Access</button>
               </div>

               <div className="bg-[#0f0f14] border border-white/5 rounded-3xl p-6 space-y-4">
                  <h3 className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.3em]">Knowledge Base</h3>
                  <div className="space-y-3">
                     {['System Design Patterns', 'Hard DP Problems', 'Concurrency in Java'].map((item, idx) => (
                       <div key={idx} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group">
                          <div className="w-1.5 h-1.5 rounded-full bg-violet-500 group-hover:scale-150 transition-transform" />
                          <span className="text-[11px] font-bold text-neutral-400 group-hover:text-white transition-colors">{item}</span>
                       </div>
                     ))}
                  </div>
               </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
