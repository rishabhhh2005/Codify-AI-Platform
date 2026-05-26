import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, LogOut, Plus, X, CheckCircle2, XCircle, Trash2 } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function SessionDetailModal({ session, onClose }) {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    if (!session) return;
    fetch(`${API}/api/session/${session.id}/history`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.ok ? r.json() : null)
      .then(setDetail)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [session, token]);

  if (!session) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-6" onClick={onClose}>
      <div
        className="bg-[#0c0b09] border border-white/10 w-full sm:max-w-lg max-h-[90vh] overflow-hidden sm:rounded-none rounded-t-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-white/10">
          <div>
            <p className="text-violet-400 tracking-[0.25em] uppercase text-xs mb-1">Session Detail</p>
            <h3 className="font-serif text-xl text-white">
              {session.topic?.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
            </h3>
          </div>
          <button onClick={onClose} className="text-neutral-500 hover:text-white transition p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-8 overflow-y-auto max-h-[calc(90vh-80px)] space-y-8">
          {loading ? (
            <p className="text-neutral-500 tracking-[0.2em] uppercase text-xs animate-pulse">Loading…</p>
          ) : detail ? (
            <>
              {/* Score row */}
              <div className="grid grid-cols-2 border border-white/10">
                <div className="p-6 border-r border-white/10">
                  <p className={`font-serif text-4xl ${(detail.score || 0) >= 80 ? 'text-emerald-400' : (detail.score || 0) >= 50 ? 'text-amber-400' : 'text-rose-400'}`}>
                    {detail.score !== null ? `${detail.score}%` : '—'}
                  </p>
                  <p className="text-neutral-500 tracking-[0.2em] uppercase text-xs mt-2">Final Score</p>
                </div>
                <div className="p-6">
                  <p className="font-serif text-4xl text-white">{detail.solvedCount}/{detail.totalQuestions}</p>
                  <p className="text-neutral-500 tracking-[0.2em] uppercase text-xs mt-2">Solved</p>
                </div>
              </div>

              {/* Questions */}
              {detail.questionsData?.length > 0 && (
                <div>
                  <p className="text-neutral-500 tracking-[0.25em] uppercase text-xs mb-4">Questions</p>
                  <div className="space-y-2">
                    {detail.questionsData.map((q, i) => (
                      <div key={i} className="flex items-center gap-4 py-3 border-b border-white/5">
                        {q.solved
                          ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          : <XCircle className="w-4 h-4 text-rose-400 shrink-0" />}
                        <span className="text-sm text-neutral-300 flex-1 truncate">{q.title || `Question ${i + 1}`}</span>
                        {q.score != null && <span className="text-xs text-neutral-500">{q.score}/10</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* AI Feedback */}
              {detail.aiFeedback && (
                <div>
                  <p className="text-neutral-500 tracking-[0.25em] uppercase text-xs mb-4">AI Feedback</p>
                  <p className="text-neutral-400 text-sm leading-7 border-l border-violet-400 pl-5 whitespace-pre-wrap">
                    {detail.aiFeedback}
                  </p>
                </div>
              )}

              {/* Meta */}
              <div className="grid grid-cols-3 border border-white/10">
                {[
                  { label: 'Language', value: detail.language },
                  { label: 'Hints', value: detail.hintsUsed || 0 },
                  { label: 'Status', value: detail.status },
                ].map((m, i) => (
                  <div key={m.label} className={`p-4 text-center ${i < 2 ? 'border-r border-white/10' : ''}`}>
                    <p className="text-sm text-white font-medium">{m.value}</p>
                    <p className="text-neutral-500 tracking-[0.2em] uppercase text-xs mt-1">{m.label}</p>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-neutral-500 tracking-[0.2em] uppercase text-xs">No data available.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user, logout, token } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalInterviews: 0, solvedQuestions: 0, accuracy: 0, streak: 0 });
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const deleteSession = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this session?')) return;
    await fetch(`${API}/api/session/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    setSessions((prev) => prev.filter((s) => s.id !== id));
  };

  useEffect(() => {
    if (!token) return;
    const h = { Authorization: `Bearer ${token}` };
    Promise.all([
      fetch(`${API}/api/session/stats`, { headers: h }).then((r) => r.ok ? r.json() : null),
      fetch(`${API}/api/session/mine`, { headers: h }).then((r) => r.ok ? r.json() : null),
    ]).then(([s, m]) => {
      if (s) setStats(s);
      if (m) setSessions(m.sessions || []);
    }).finally(() => setLoading(false));
  }, [token]);

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* Top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-white/10" />

      {/* Nav */}
      <header className="h-16 md:h-20 border-b border-white/10 flex items-center justify-between px-6 md:px-16 sticky top-0 z-50 bg-black/90 backdrop-blur-xl">
        <span
  onClick={() => navigate('/home')}
  className="font-serif text-xl md:text-1xl font-semibold tracking-tight cursor-pointer hover:opacity-80 transition"
>
  Codify <span className="text-violet-400">AI</span>
</span>

        {/* Desktop actions */}
        <div className="hidden md:flex items-center gap-6">
          <div className="text-right">
            <p className="text-sm text-white font-medium">{user?.name || 'Engineer'}</p>
            <p className="text-xs text-neutral-500 tracking-widest uppercase">{user?.email}</p>
          </div>
          <button
            onClick={() => navigate('/home')}
            className="bg-violet-500 hover:bg-violet-400 text-black px-6 py-2.5 text-xs uppercase tracking-[0.2em] font-semibold transition flex items-center gap-2"
          >
            <Plus className="w-3.5 h-3.5" /> New Session
          </button>
          <button onClick={logout} className="text-neutral-500 hover:text-white transition">
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden text-neutral-400 hover:text-white transition" onClick={() => setMenuOpen(!menuOpen)}>
          <div className="space-y-1.5">
            <span className="block w-5 h-px bg-current" />
            <span className="block w-5 h-px bg-current" />
          </div>
        </button>
      </header>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-b border-white/10 bg-black px-6 py-4 space-y-3">
          <p className="text-sm text-white">{user?.name}</p>
          <button onClick={() => { navigate('/home'); setMenuOpen(false); }}
            className="w-full bg-violet-500 text-black py-3 text-xs uppercase tracking-[0.2em] font-semibold">
            New Session
          </button>
          <button onClick={logout} className="w-full text-left text-sm text-neutral-500 hover:text-white transition py-1">
            Sign Out
          </button>
        </div>
      )}

      <main className="max-w-5xl mx-auto px-6 md:px-16 py-12 md:py-16">

        {/* Page header */}
        <div className="mb-12 md:mb-16 border-b border-white/10 pb-10">
          <p className="text-violet-400 tracking-[0.35em] uppercase text-xs mb-4">Performance Overview</p>
          <h1 className="font-serif text-5xl md:text-7xl leading-[0.95] tracking-tight">
            {user?.name?.split(' ')[0] || 'Engineer'}<span className="text-neutral-600">'s</span><br />
            <span className="italic text-violet-400">Dashboard</span>
          </h1>
        </div>

        {/* Stats — editorial grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 border border-white/10 mb-16">
          {[
            { label: 'Sessions', value: stats.totalInterviews },
            { label: 'Solved', value: stats.solvedQuestions },
            { label: 'Accuracy', value: `${stats.accuracy}%` },
            { label: 'Streak', value: `${stats.streak}d` },
          ].map((s, i) => (
            <div key={s.label} className={`p-6 md:p-8 ${i < 3 ? 'border-r border-white/10' : ''} ${i < 2 ? 'border-b md:border-b-0 border-white/10' : ''}`}>
              <p className="font-serif text-3xl md:text-4xl text-white">{s.value}</p>
              <p className="text-neutral-500 tracking-[0.2em] uppercase text-xs mt-3">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Session history */}
       <div className="grid gap-5 md:grid-cols-2">
  {sessions.map((s) => {
    const scoreColor =
      s.score >= 80
        ? 'text-emerald-400'
        : s.score >= 50
        ? 'text-amber-400'
        : 'text-rose-400';

    return (
      <div
        key={s.id}
        onClick={() => setSelected(s)}
        className="group relative border border-white/10 bg-[#0d0d10] hover:border-violet-500/30 hover:bg-[#121216] transition cursor-pointer p-6"
      >
        {/* top */}
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.25em] text-violet-400 mb-3">
              Session
            </p>

            <h3 className="font-serif text-2xl text-white leading-tight group-hover:text-violet-300 transition">
              {s.topic
                .replace(/_/g, ' ')
                .replace(/\b\w/g, (c) => c.toUpperCase())}
            </h3>

            <p className="text-sm text-neutral-500 mt-2">
              {new Date(s.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
          </div>

          <button
            onClick={(e) => deleteSession(s.id, e)}
            className="text-neutral-600 hover:text-rose-400 transition"
            title="Delete session"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* middle */}
        <div className="grid grid-cols-3 border border-white/10 mt-6">
          <div className="p-4 border-r border-white/10">
            <p className={`font-serif text-2xl ${scoreColor}`}>
              {s.score != null ? `${s.score}%` : '—'}
            </p>
            <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-600 mt-2">
              Score
            </p>
          </div>

          <div className="p-4 border-r border-white/10">
            <p className="font-serif text-2xl text-white">
              {s.solvedCount || 0}/{s.totalQuestions || 1}
            </p>
            <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-600 mt-2">
              Solved
            </p>
          </div>

          <div className="p-4">
            <p className="font-serif text-lg text-white capitalize">
              {s.difficulty}
            </p>
            <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-600 mt-2">
              Level
            </p>
          </div>
        </div>

        {/* footer */}
        <div className="flex items-center justify-between mt-6 pt-5 border-t border-white/10">
          <span className="text-xs uppercase tracking-[0.2em] text-neutral-500">
            {s.language}
          </span>

          <div className="flex items-center gap-2 text-violet-400 group-hover:translate-x-1 transition">
            <span className="text-xs uppercase tracking-[0.2em]">
              View Detail
            </span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    );
  })}
</div>
      </main>

      {selected && <SessionDetailModal session={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
