import { useEffect, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { TOPICS, DIFFICULTIES, LANGUAGES } from '@/lib/constants';

function formatTime(s) {
  return `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;
}

function perfMessage(score) {
  if (score >= 85) return 'Excellent technical performance with strong problem-solving clarity.';
  if (score >= 70) return 'Strong performance with some opportunities for optimization.';
  if (score >= 50) return 'Decent fundamentals, but algorithmic refinement is needed.';
  return 'Foundational understanding exists, but more structured practice is needed.';
}

export default function ResultsScreen({ session, messages, elapsedSeconds, hintsUsed, onReset, questions, finalReport }) {
  const [displayScore, setDisplayScore] = useState(0);
  const [longWait, setLongWait] = useState(false);

  const topic = TOPICS.find((t) => t.id === session?.topic);
  const difficulty = DIFFICULTIES.find((d) => d.id === session?.difficulty);
  const language = LANGUAGES.find((l) => l.id === session?.language);
  const extractedScore = finalReport?.finalScore || 0;

  const lastAiMsg = [...messages].reverse().find((m) => m.role === 'assistant');

  useEffect(() => {
    const t = setTimeout(() => setLongWait(true), 10000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!extractedScore) return;
    const steps = 50;
    const inc = extractedScore / steps;
    let cur = 0;
    const t = setInterval(() => {
      cur += inc;
      if (cur >= extractedScore) { setDisplayScore(extractedScore); clearInterval(t); }
      else setDisplayScore(Math.floor(cur));
    }, 1400 / steps);
    return () => clearInterval(t);
  }, [extractedScore]);

  /* ── ANALYZING SCREEN ── */
  if (!finalReport) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col">
        <div className="absolute top-0 left-0 right-0 h-px bg-white/10" />

        <header className="h-16 md:h-20 border-b border-white/10 flex items-center px-6 md:px-16">
          <span className="font-serif text-xl md:text-2xl font-semibold tracking-tight">
            Codify <span className="text-violet-400">AI</span>
          </span>
        </header>

        <div className="flex-1 flex items-center justify-center px-6">
          <div className="max-w-lg text-center">
            <p className="text-violet-400 tracking-[0.35em] uppercase text-xs mb-10">Session Analysis</p>

            <h1 className="font-serif text-5xl md:text-7xl leading-tight">
              Analyzing<br />
              <span className="italic text-violet-400">performance</span>
            </h1>

            <p className="mt-8 text-neutral-500 text-base md:text-lg leading-8 max-w-md mx-auto">
              {longWait
                ? 'Large solutions require deeper analysis. Final evaluation is almost ready.'
                : 'Reviewing code quality, correctness, efficiency, and interview communication.'}
            </p>

            {/* Progress bar */}
            <div className="mt-12 w-full max-w-xs mx-auto h-px bg-white/10 overflow-hidden relative">
              <div className="absolute inset-y-0 w-1/3 bg-violet-400 animate-[slide_1.8s_linear_infinite]" />
            </div>
          </div>
        </div>

        <style>{`@keyframes slide { 0%{transform:translateX(-150%)} 100%{transform:translateX(400%)} }`}</style>
      </div>
    );
  }

  /* ── RESULTS SCREEN ── */
  const solvedCount = finalReport?.solvedCount ?? 0;
  const totalQuestions = finalReport?.totalQuestions ?? questions?.length ?? 0;
  const summary = finalReport?.reviews?.[0]?.summary || lastAiMsg?.content?.replace(/```[\s\S]*?```/g, '').trim() || 'AI review unavailable for this session.';
  const suggestions = finalReport?.reviews?.[0]?.suggestions || [];

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="absolute top-0 left-0 right-0 h-px bg-white/10" />
      {/* Vertical center line — desktop only */}
      <div className="absolute top-0 bottom-0 left-1/2 w-px bg-white/10 hidden lg:block" />

      {/* Nav */}
      <header className="relative z-10 h-16 md:h-24 flex items-center justify-between px-6 md:px-16 border-b border-white/10">
        <span className="font-serif text-xl md:text-3xl font-semibold tracking-tight">
          Codify <span className="text-violet-400">AI</span>
        </span>
        <button
          onClick={onReset}
          className="bg-violet-500 hover:bg-violet-400 text-black px-5 md:px-8 py-2.5 md:py-3 text-xs uppercase tracking-[0.2em] font-semibold transition"
        >
          New Session
        </button>
      </header>

      <div className="relative z-10 px-6 md:px-16 py-10 md:py-16 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 md:gap-16 items-start">

          {/* LEFT — score + stats */}
          <section>
            <p className="text-violet-400 tracking-[0.35em] uppercase text-xs mb-8">Session Analysis</p>

            <h1 className="font-serif text-7xl md:text-8xl leading-[0.9] tracking-tight">
              {displayScore}<span className="text-neutral-600">%</span>
            </h1>

            <p className="mt-6 text-neutral-400 text-base md:text-lg leading-8 max-w-xl">
              {perfMessage(displayScore)}
            </p>

            <div className="mt-6 flex flex-wrap gap-3 text-xs uppercase tracking-[0.25em] text-neutral-500">
              <span>{topic?.label || 'Unknown'}</span>
              <span>·</span>
              <span>{difficulty?.label || 'Unknown'}</span>
              <span>·</span>
              <span>{solvedCount}/{totalQuestions} Solved</span>
            </div>

            {/* Stats grid */}
            <div className="mt-10 md:mt-14 grid grid-cols-2 md:grid-cols-4 border border-white/10">
              {[
                { label: 'Duration', value: formatTime(elapsedSeconds) },
                { label: 'Hints', value: hintsUsed },
                { label: 'Language', value: language?.label || 'N/A' },
                { label: 'Solved', value: `${solvedCount}/${totalQuestions}` },
              ].map((s, i) => (
                <div key={s.label} className={`p-5 md:p-7 ${i < 3 ? 'border-r border-white/10' : ''} ${i < 2 ? 'border-b md:border-b-0 border-white/10' : ''}`}>
                  <p className="font-serif text-2xl md:text-3xl text-white">{s.value}</p>
                  <p className="text-neutral-500 tracking-[0.2em] uppercase text-xs mt-3">{s.label}</p>
                </div>
              ))}
            </div>
          </section>

          {/* RIGHT — AI review */}
          <section>
            <div className="border border-white/10 p-7 md:p-10">
              <p className="text-neutral-500 tracking-[0.3em] uppercase text-xs mb-6">AI Review</p>
              <p className="text-neutral-300 text-base md:text-lg leading-8 md:leading-9 whitespace-pre-wrap">{summary}</p>

              {suggestions.length > 0 && (
                <div className="mt-10 border-t border-white/10 pt-8">
                  <p className="text-neutral-500 tracking-[0.3em] uppercase text-xs mb-6">Improvement Areas</p>
                  <div className="space-y-5">
                    {suggestions.slice(0, 4).map((tip, i) => (
                      <div key={i} className="border-l border-violet-400 pl-5 text-neutral-400 text-sm leading-7">{tip}</div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={onReset}
              className="mt-6 w-full h-14 bg-violet-500 hover:bg-violet-400 text-black uppercase tracking-[0.25em] text-xs font-semibold transition flex items-center justify-center gap-3"
            >
              <RotateCcw className="w-4 h-4" />
              Practice Again
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}
