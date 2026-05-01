import { useEffect, useState } from 'react';
import { Trophy, Clock, Lightbulb, RotateCcw, Download, Share2, History, ChevronRight, CheckCircle2 } from 'lucide-react';
import { TOPICS, DIFFICULTIES, LANGUAGES } from '@/lib/constants';

function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

const StatCard = ({ label, value, icon: Icon, colorClass }) => (
  <div className="bg-[#121214] border border-white/5 rounded-2xl p-4 flex flex-col items-center justify-center transition-all hover:border-white/10 hover:bg-[#161618] group">
    <div className={`p-2 rounded-xl bg-white/5 mb-3 group-hover:scale-110 transition-transform ${colorClass}`}>
      <Icon className="w-5 h-5" />
    </div>
    <span className="font-mono text-xl font-black text-white">{value}</span>
    <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest mt-1">{label}</span>
  </div>
);

export default function ResultsScreen({ session, messages, elapsedSeconds, hintsUsed, onReset, submissionResults, questions, finalReport }) {
  const [displayScore, setDisplayScore] = useState(0);
  
  const topic = TOPICS.find(t => t.id === session?.topic);
  const difficulty = DIFFICULTIES.find(d => d.id === session?.difficulty);
  const language = LANGUAGES.find(l => l.id === session?.language);

  // Final score from end-session evaluator
  const lastAiMsg = [...messages].reverse().find(m => m.role === 'assistant');
  const extractedScore = finalReport?.finalScore || 0;

  useEffect(() => {
    if (extractedScore) {
      const duration = 1500;
      const steps = 60;
      const increment = extractedScore / steps;
      let current = 0;
      const timer = setInterval(() => {
        current += increment;
        if (current >= extractedScore) {
          setDisplayScore(extractedScore);
          clearInterval(timer);
        } else {
          setDisplayScore(Math.floor(current));
        }
      }, duration / steps);
      return () => clearInterval(timer);
    }
  }, [extractedScore]);

  const getScoreColor = (s) => {
    if (s >= 80) return 'text-emerald-400';
    if (s >= 50) return 'text-amber-400';
    return 'text-red-400';
  };

  const [showLongWaitMsg, setShowLongWaitMsg] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowLongWaitMsg(true), 10000);
    return () => clearTimeout(timer);
  }, []);

  if (!finalReport) {
    return (
      <div className="min-h-screen bg-[#0d0d0f] flex flex-col items-center justify-center px-6 relative overflow-hidden font-sans">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
        
        <div className="flex flex-col items-center gap-8 relative z-10">
           <div className="relative">
              {/* Outer glow ring */}
              <div className="absolute -inset-4 bg-indigo-500/20 blur-3xl rounded-full animate-pulse" />
              <div className="w-24 h-24 rounded-full border-4 border-white/5 border-t-indigo-500 animate-[spin_1.5s_linear_infinite] relative" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full animate-ping" />
                </div>
              </div>
           </div>
           
           <div className="text-center space-y-3 max-w-xs animate-in fade-in slide-in-from-bottom-4 duration-700">
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Analyzing Performance</h2>
              <p className="text-neutral-500 text-[10px] font-black uppercase tracking-[0.2em] leading-relaxed">
                {showLongWaitMsg 
                  ? "Almost there! Large solutions take a bit more processing power..."
                  : "Compiling final report and AI reviews..."}
              </p>
              
              {showLongWaitMsg && (
                <div className="pt-4 animate-in fade-in duration-500">
                  <div className="h-1 w-32 bg-white/5 rounded-full mx-auto overflow-hidden">
                    <div className="h-full bg-indigo-500/50 animate-[shimmer_2s_infinite]" />
                  </div>
                </div>
              )}
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0d0f] flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-96 bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-2xl space-y-8 relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        {/* Main Score Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-2">
            <CheckCircle2 className="w-3 h-3" />
            Interview Synchronized
          </div>
          
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-white/5 blur-2xl rounded-full" />
            <h1 className={`relative text-8xl font-black tracking-tighter transition-all duration-300 ${getScoreColor(displayScore)}`}>
              {displayScore}<span className="text-2xl opacity-40 ml-1">%</span>
            </h1>
          </div>
          
          <div className="space-y-1">
             <h2 className="text-2xl font-black text-white tracking-tight uppercase">Session Evaluation</h2>
             <p className="text-neutral-500 text-sm font-medium tracking-wide">
               Analysis complete for {topic?.label} · {difficulty?.label} · Solved {finalReport?.solvedCount ?? 0}/{finalReport?.totalQuestions ?? questions?.length ?? 0}
             </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard label="Duration" value={formatTime(elapsedSeconds)} icon={Clock} colorClass="text-indigo-400" />
          <StatCard label="Hints" value={hintsUsed} icon={Lightbulb} colorClass="text-amber-400" />
          <StatCard label="Language" value={language?.label || 'N/A'} icon={History} colorClass="text-cyan-400" />
          <StatCard label="Solved" value={`${finalReport?.solvedCount ?? 0}/${finalReport?.totalQuestions ?? questions?.length ?? 0}`} icon={Trophy} colorClass="text-emerald-400" />
        </div>

        {/* Feedback Section */}
        <div className="bg-[#121214] border border-white/5 rounded-3xl p-6 shadow-2xl relative group">
          <div className="absolute top-0 left-10 h-px w-20 bg-indigo-500/50" />
          <h3 className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
            <Bot className="w-3.5 h-3.5 text-indigo-400" /> Executive Summary
          </h3>
          <div className="text-sm text-neutral-300 leading-relaxed font-sans line-clamp-4">
             {finalReport?.reviews?.length
               ? (finalReport.reviews[0].summary || 'Good effort. Continue refining correctness and complexity.')
               : (lastAiMsg ? lastAiMsg.content.replace(/```[\s\S]*?```/g, '').trim() : 'AI review was unavailable for this session.')}
          </div>
          <button className="mt-4 text-[11px] font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 uppercase tracking-wider transition-colors">
             Read Full Breakdown <ChevronRight className="w-3 h-3" />
          </button>
          {finalReport?.reviews?.[0]?.suggestions?.length > 0 && (
            <ul className="mt-4 list-disc pl-5 text-xs text-neutral-400 space-y-1">
              {finalReport.reviews[0].suggestions.slice(0, 3).map((tip, idx) => (
                <li key={idx}>{tip}</li>
              ))}
            </ul>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <button
            onClick={onReset}
            className="flex-1 group relative py-5 bg-indigo-600 rounded-2xl overflow-hidden transition-all hover:bg-indigo-500 hover:shadow-[0_0_40px_-5px_rgba(79,70,229,0.5)] active:scale-[0.98]"
          >
            <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:animate-shimmer" />
            <span className="relative flex items-center justify-center gap-2 text-white text-sm font-black uppercase tracking-widest">
              <RotateCcw className="w-4 h-4 transition-transform group-hover:rotate-180 duration-500" />
              Practice Again
            </span>
          </button>
          
          <button
            className="flex-1 py-5 bg-white/5 border border-white/10 rounded-2xl text-neutral-400 text-sm font-black uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            View History
          </button>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-150%) skewX(-12deg); }
          100% { transform: translateX(250%) skewX(-12deg); }
        }
        .animate-shimmer {
          animation: shimmer 1.5s infinite;
        }
      `}</style>
    </div>
  );
}

const Bot = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
  </svg>
);
