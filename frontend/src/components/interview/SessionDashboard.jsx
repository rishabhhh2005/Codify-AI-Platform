import { useMemo } from 'react';
import { Clock, Lightbulb } from 'lucide-react';
import { TOPICS, DIFFICULTIES, LANGUAGES } from '@/lib/constants';
import { useAuth } from '@/context/AuthContext';

function formatTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return h > 0 ? `${h}:${m}:${s}` : `${m}:${s}`;
}

export default function SessionDashboard({
  session, questions, currentQuestionIndex, switchQuestion,
  timeRemaining, hintsUsed, score, onSubmit, onHint, hintUsed,
  onEnd, onNavigateDashboard, isLoading, submissionResults,
}) {
  const { user } = useAuth();
  const topic = TOPICS.find(t => t.id === session?.topic);
  const difficulty = DIFFICULTIES.find(d => d.id === session?.difficulty);
  const language = LANGUAGES.find(l => l.id === session?.language);

  const timeColor = useMemo(() => {
    if (timeRemaining > 3600) return 'text-emerald-400';
    if (timeRemaining > 900) return 'text-amber-400';
    return 'text-rose-400';
  }, [timeRemaining]);

  return (
    <div className="bg-black border-b border-white/10 px-4 md:px-8 py-0 flex items-center h-14 gap-4 md:gap-6">

      {/* Brand */}
    <span

        className="font-serif text-base font-semibold tracking-tight cursor-pointer shrink-0 hidden sm:block"
      >
        Codify <span className="text-violet-400">AI</span>
      </span>

      <div className="w-px h-4 bg-white/10 hidden sm:block shrink-0" />

      {/* Question tabs */}
      {questions?.length > 1 && (
        <div className="flex items-center gap-1 shrink-0">
          {questions.map((_, idx) => {
            const solved = submissionResults?.[idx]?.isAccepted;
            const active = idx === currentQuestionIndex;
            return (
              <button
                key={idx}
                onClick={() => switchQuestion(idx)}
                className={`px-3 py-1 text-xs font-mono font-bold border transition-all ${
                  solved
                    ? 'border-emerald-500/40 text-emerald-400 bg-emerald-500/5'
                    : active
                      ? 'border-violet-500 text-white bg-violet-500/10'
                      : 'border-white/10 text-neutral-500 hover:border-white/20 hover:text-white'
                }`}
              >
                Q{idx + 1}
              </button>
            );
          })}
        </div>
      )}

      {/* Meta breadcrumb */}
      <div className="hidden md:flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-neutral-600 shrink-0">
        <span className={`${difficulty?.color}`}>{difficulty?.label}</span>
        <span>·</span>
        <span>{topic?.label}</span>
        <span>·</span>
        <span>{language?.label}</span>
      </div>

      {/* Right side */}
      <div className="ml-auto flex items-center gap-4 md:gap-6 shrink-0">

        {/* Timer */}
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-neutral-600" />
          <span className={`font-mono text-sm font-bold ${timeColor} ${timeRemaining < 300 ? 'animate-pulse' : ''}`}>
            {formatTime(timeRemaining || 0)}
          </span>
        </div>

        {/* Hints */}
        <div className="flex items-center gap-1.5">
          <Lightbulb className="w-3.5 h-3.5 text-neutral-600" />
          <span className="font-mono text-xs text-neutral-500">{hintsUsed}</span>
        </div>

        <div className="w-px h-4 bg-white/10" />

        {/* Get Hint */}
        <button
          onClick={onHint}
          disabled={isLoading || hintUsed}
          title={hintUsed ? 'One hint per question' : 'Get a hint'}
          className="text-xs font-mono uppercase tracking-widest border px-3 py-1.5 transition hidden sm:block disabled:opacity-30 disabled:cursor-not-allowed border-white/10 text-neutral-400 hover:text-white hover:border-white/20"
        >
          {hintUsed ? 'Hint Used' : 'Hint'}
        </button>

        {/* End */}
        <button
          onClick={onEnd}
          className="text-xs font-mono uppercase tracking-widest text-neutral-500 hover:text-rose-400 transition"
        >
          End
        </button>

        {/* User */}
        <div className="w-px h-4 bg-white/10 hidden md:block" />
        <span className="hidden md:block text-xs font-mono uppercase tracking-widest text-neutral-600">
          {user?.name?.split(' ')[0] || 'U'}
        </span>
      </div>
    </div>
  );
}
