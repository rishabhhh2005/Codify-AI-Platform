import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Trophy,
  Target,
  Clock,
  ChevronRight,
  LogOut,
  Plus,
  Calendar,
  X,
  CheckCircle2,
  XCircle,
  Flame
} from 'lucide-react';
import codifyLogo from '@/components/ui/logos/codify-logo.png';

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

// Session History Detail Modal
function SessionHistoryModal({ session, onClose }) {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    if (!session) return;
    const fetchDetail = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/session/${session.id}/history`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.ok) {
          setDetail(await res.json());
        }
      } catch (err) {
        console.error('Failed to load session history:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [session, token]);

  if (!session) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={onClose}>
      <div
        className="bg-[#0f0f14] border border-white/10 rounded-3xl w-full max-w-lg max-h-[80vh] overflow-hidden shadow-2xl shadow-violet-500/10 animate-in fade-in zoom-in-95 duration-300"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white tracking-tight">
                {session.topic?.replace(/_/g, ' ')}
              </h3>
              <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                {new Date(session.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                {' '} - {session.difficulty}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl text-neutral-500 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-80px)] space-y-6">
          {loading ? (
            <div className="text-center py-12 text-neutral-500 text-xs font-bold uppercase tracking-widest animate-pulse">
              Loading session data...
            </div>
          ) : detail ? (
            <>
              {/* Score Header */}
              <div className="flex items-center justify-between p-4 bg-white/[0.02] rounded-2xl border border-white/5">
                <div className="flex items-center gap-3">
                  <span className={`text-3xl font-black ${(detail.score || 0) >= 80 ? 'text-emerald-400' :
                      (detail.score || 0) >= 50 ? 'text-amber-400' : 'text-rose-400'
                    }`}>
                    {detail.score !== null ? `${detail.score}%` : 'N/A'}
                  </span>
                  <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Final Score</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-white">{detail.solvedCount}/{detail.totalQuestions}</span>
                  <span className="text-[10px] text-neutral-500 uppercase tracking-widest ml-2">Solved</span>
                </div>
              </div>

              {/* Questions Breakdown */}
              {detail.questionsData && detail.questionsData.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.3em]">Questions</h4>
                  {detail.questionsData.map((q, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-white/[0.02] rounded-xl border border-white/5">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${q.solved ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                        }`}>
                        {q.solved ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-bold text-white truncate block">
                          {q.title || `Question ${idx + 1}`}
                        </span>
                      </div>
                      {q.score !== null && q.score !== undefined && (
                        <span className="text-[10px] font-black text-neutral-400">{q.score}/10</span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* AI Feedback */}
              {detail.aiFeedback && (
                <div className="space-y-3">
                  <h4 className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.3em]">AI Feedback</h4>
                  <div className="p-4 bg-violet-500/5 border border-violet-500/10 rounded-2xl">
                    <p className="text-sm text-neutral-300 leading-relaxed whitespace-pre-wrap">
                      {detail.aiFeedback}
                    </p>
                  </div>
                </div>
              )}

              {/* Session Meta */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-white/[0.02] rounded-xl border border-white/5 text-center">
                  <span className="text-xs font-bold text-white block">{detail.language}</span>
                  <span className="text-[10px] text-neutral-500 uppercase tracking-widest">Language</span>
                </div>
                <div className="p-3 bg-white/[0.02] rounded-xl border border-white/5 text-center">
                  <span className="text-xs font-bold text-white block">{detail.hintsUsed || 0}</span>
                  <span className="text-[10px] text-neutral-500 uppercase tracking-widest">Hints</span>
                </div>
                <div className="p-3 bg-white/[0.02] rounded-xl border border-white/5 text-center">
                  <span className="text-xs font-bold text-white block">{detail.status}</span>
                  <span className="text-[10px] text-neutral-500 uppercase tracking-widest">Status</span>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-neutral-500 text-xs font-bold uppercase tracking-widest">
              No detailed data available for this session.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user, logout, token } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalInterviews: 0,
    solvedQuestions: 0,
    accuracy: 0,
    streak: 0
  });
  const [recentSessions, setRecentSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;
      try {
        const headers = { Authorization: `Bearer ${token}` };

        const [statsRes, sessionsRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/session/stats`, { headers }),
          fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/session/mine`, { headers })
        ]);

        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }

        if (sessionsRes.ok) {
          const sessionsData = await sessionsRes.json();
          setRecentSessions(sessionsData.sessions || []);
        }
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  return (
    <div className="min-h-screen bg-[#060608] text-neutral-200 font-sans relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-96 bg-violet-500/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Sidebar/Nav */}
      <div className="fixed top-0 left-0 bottom-0 w-20 bg-[#0a0a0e] border-r border-white/5 flex flex-col items-center py-8 z-50">
        <div
          className="w-10 h-10 rounded-xl overflow-hidden mb-12 shadow-lg shadow-violet-500/20 cursor-pointer hover:scale-110 transition-transform"
          onClick={() => navigate('/')}
        >
          <img src={codifyLogo} alt="Codify" className="w-full h-full object-cover" />
        </div>

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
              <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">{user?.email || 'Premium Member'}</span>
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

        <main className="max-w-5xl mx-auto py-12 px-10 space-y-12">
          {/* Welcome Section */}
          <div className="space-y-2 animate-in fade-in slide-in-from-left-4 duration-700">
            <h1 className="text-4xl font-black text-white tracking-tighter">Dashboard</h1>
            <p className="text-neutral-500 text-sm font-medium">Welcome back, {user?.name?.split(' ')[0] || 'Engineer'}. Your technical growth is exponential.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard label="Total Sessions" value={stats.totalInterviews} icon={Clock} colorClass="text-indigo-400" />
            <StatCard label="Questions Solved" value={stats.solvedQuestions} icon={Trophy} colorClass="text-emerald-400" delay="delay-100" />
            <StatCard label="Avg Accuracy" value={`${stats.accuracy}%`} icon={Target} colorClass="text-cyan-400" delay="delay-200" />
            <StatCard label="Practice Streak" value={`${stats.streak} Days`} icon={Flame} colorClass="text-amber-400" delay="delay-300" />
          </div>

          {/* Session History - Full width */}
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-400">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.3em]">Session History</h3>
              <span className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest">
                {recentSessions.length} sessions
              </span>
            </div>

            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-12 text-neutral-500 text-xs font-bold uppercase tracking-widest animate-pulse">
                  Loading sessions...
                </div>
              ) : recentSessions.length === 0 ? (
                <div className="bg-[#0f0f14] border border-white/5 rounded-2xl p-10 flex flex-col items-center justify-center text-center space-y-4">
                  <Calendar className="w-10 h-10 text-neutral-700" />
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-white">No sessions yet</p>
                    <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-black">Your journey begins with the first line of code</p>
                  </div>
                  <button
                    onClick={() => navigate('/')}
                    className="px-4 py-2 bg-violet-600/10 text-violet-400 text-[10px] font-black uppercase tracking-widest rounded-lg border border-violet-500/20 hover:bg-violet-600/20 transition-all"
                  >
                    Start First Session
                  </button>
                </div>
              ) : (
                recentSessions.map((session) => (
                  <div
                    key={session.id}
                    onClick={() => setSelectedSession(session)}
                    className="bg-[#0f0f14] border border-white/5 rounded-2xl p-5 flex items-center justify-between group hover:border-violet-500/30 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-violet-400 group-hover:scale-110 transition-transform">
                        <Target className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-white group-hover:text-violet-300 transition-colors">
                          {session.topic
                            .replace(/_/g, ' ')
                            .replace(/\b\w/g, (c) => c.toUpperCase())
                          }
                        </span>
                        <div className="flex items-center gap-3 mt-0.5">
                          <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                            {new Date(session.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                          <span className="text-[10px] font-bold text-neutral-600">{session.difficulty}</span>
                          <span className="text-[10px] font-bold text-neutral-600">{session.language}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-8">
                      <div className="flex flex-col items-end">
                        <span className={`text-sm font-black ${session.score >= 80 ? 'text-emerald-400' : session.score >= 50 ? 'text-amber-400' : 'text-rose-400'}`}>
                          {session.score !== null && session.score !== undefined ? `${session.score}%` : 'N/A'}
                        </span>
                        <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mt-0.5">
                          {session.solvedCount || 0}/{session.totalQuestions || 1} solved
                        </span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-neutral-700 group-hover:text-white transition-colors" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Session History Detail Modal */}
      {selectedSession && (
        <SessionHistoryModal
          session={selectedSession}
          onClose={() => setSelectedSession(null)}
        />
      )}
    </div>
  );
}
