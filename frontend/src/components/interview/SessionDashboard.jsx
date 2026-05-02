import { useMemo } from 'react';
import { Clock, Lightbulb, Trophy, ChevronRight, Brain, User, LayoutDashboard, LogOut } from 'lucide-react';
import { TOPICS, DIFFICULTIES, LANGUAGES } from '@/lib/constants';
import { useAuth } from '@/context/AuthContext';
import { Link } from 'react-router-dom';

function formatTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return h > 0 ? `${h}:${m}:${s}` : `${m}:${s}`;
}

export default function SessionDashboard({
  session,
  questions,
  currentQuestionIndex,
  switchQuestion,
  timeRemaining,
  hintsUsed,
  score,
  onSubmit,
  onHint,
  onEnd,
  isLoading,
  hasRunCode,
  onReview,
  submissionResults,
}) {
  const { user, logout } = useAuth();
  const topic = TOPICS.find(t => t.id === session?.topic);
  const difficulty = DIFFICULTIES.find(d => d.id === session?.difficulty);
  const language = LANGUAGES.find(l => l.id === session?.language);

  const timeColor = useMemo(() => {
    if (timeRemaining > 3600) return 'text-emerald-400';
    if (timeRemaining > 900) return 'text-amber-400';
    return 'text-rose-400';
  }, [timeRemaining]);

  return (
    <div className="flex flex-col gap-3 p-3 h-full bg-[#0a0a0e] border-b border-white/5 relative z-[110]">
      {/* Session meta row */}
      <div className="flex items-center gap-2 flex-wrap">
        {questions?.length > 1 && questions.map((q, idx) => {
          const solved = submissionResults?.[idx]?.isAccepted;
          const isActive = idx === currentQuestionIndex;
          const btnClass = solved
            ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40'
            : isActive
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
              : 'bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white';
          return (
          <button
            key={idx}
            onClick={() => switchQuestion(idx)}
            className={`px-3 py-1 text-xs font-bold font-mono tracking-wider rounded cursor-pointer transition-all ${btnClass}`}
          >
            Q{idx + 1}
          </button>
          );
        })}
        {questions?.length > 1 && <div className="w-px h-4 bg-white/10 mx-2" />}

        <span className={`font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${difficulty?.border} ${difficulty?.bg} ${difficulty?.color}`}>
          {difficulty?.label}
        </span>
        <span className="font-mono text-[10px] uppercase font-bold text-neutral-500">{topic?.label}</span>
        <ChevronRight className="w-3 h-3 text-neutral-600" />
        <span className="font-mono text-[10px] uppercase font-bold text-neutral-500">{language?.label}</span>
        
        {/* User Profile Badge */}
        <div className="ml-auto flex items-center gap-4">
           <Link 
             to="/dashboard"
             className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all group"
           >
              <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-violet-500 to-cyan-400 flex items-center justify-center text-[8px] font-black text-white group-hover:scale-110 transition-transform">
                {user?.name?.[0] || 'U'}
              </div>
              <span className="text-[10px] font-black text-white/60 group-hover:text-white uppercase tracking-widest hidden sm:block">
                {user?.name || 'Candidate'}
              </span>
           </Link>
        </div>
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-6">
        {/* Timer */}
        <div className="flex items-center gap-2 group">
          <Clock className="w-3.5 h-3.5 text-neutral-500" />
          <span className={`font-mono text-sm font-bold tracking-tighter ${timeColor} ${timeRemaining < 300 ? 'animate-pulse' : ''}`}>
            {formatTime(timeRemaining || 0)}
          </span>
        </div>

        {/* Hints */}
        <div className="flex items-center gap-2">
          <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-mono text-sm text-neutral-400 font-bold">
            {hintsUsed} <span className="text-[10px] text-neutral-600">HINTS</span>
          </span>
        </div>

        {/* Score */}
        {score !== null && (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20">
            <Trophy className="w-3.5 h-3.5 text-indigo-400" />
            <span className="font-mono text-sm font-black text-indigo-400">{score}%</span>
          </div>
        )}

        {/* Actions */}
        <div className="ml-auto flex items-center gap-3">

          
          <button
            onClick={onHint}
            disabled={isLoading}
            className="px-4 py-1.5 text-xs font-bold font-mono border border-amber-500/20 text-amber-500/80 rounded-lg hover:bg-amber-500/10 transition-all disabled:opacity-30"
          >
            Get Hint
          </button>
          
          <button
            onClick={onEnd}
            className="px-4 py-1.5 text-xs font-black font-mono text-neutral-500 hover:text-rose-400 transition-all"
          >
            End
          </button>
        </div>
      </div>
    </div>
  );
}
