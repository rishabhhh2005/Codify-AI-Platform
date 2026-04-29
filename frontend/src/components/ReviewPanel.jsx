import React from 'react';
import { X, CheckCircle2, AlertTriangle, Lightbulb, BarChart3, Clock, Layout } from 'lucide-react';
import { Progress } from "@/components/ui/progress";

const ScoreBar = ({ label, score, icon: Icon }) => {
  const getProgressColor = (s) => {
    if (s >= 7) return 'bg-emerald-500';
    if (s >= 4) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider">
        <div className="flex items-center gap-2 text-neutral-400">
          <Icon className="w-3 h-3 text-indigo-400" />
          {label}
        </div>
        <span className={score >= 7 ? 'text-emerald-400' : score >= 4 ? 'text-amber-400' : 'text-red-400'}>
          {score}/10
        </span>
      </div>
      <Progress value={score * 10} className="h-1 bg-white/5" indicatorClassName={getProgressColor(score)} />
    </div>
  );
};

const ReviewPanel = ({ isOpen, onClose, review, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-end bg-black/60 backdrop-blur-sm">
      <div 
        className={`w-full max-w-xl h-full bg-[#0f0f12] border-l border-white/10 shadow-2xl flex flex-col transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white leading-tight">AI Code Analysis</h2>
              <p className="text-[10px] text-neutral-500 font-mono uppercase tracking-widest mt-0.5">FAANG Engineer Review</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-full text-neutral-500 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-10">
          {isLoading ? (
            <div className="h-full flex flex-col items-center justify-center space-y-4">
              <div className="relative">
                <div className="h-12 w-12 rounded-full border-2 border-indigo-500/20 animate-ping absolute" />
                <div className="h-12 w-12 rounded-full border-2 border-t-indigo-500 animate-spin" />
              </div>
              <p className="text-neutral-400 font-mono text-sm animate-pulse tracking-wide">Reviewing your code Architecture...</p>
            </div>
          ) : review ? (
            <>
              {/* Summary Card */}
              <div className="relative overflow-hidden rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-6 group">
                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Lightbulb className="w-12 h-12 text-indigo-400" />
                </div>
                <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Overall Summary
                </h3>
                <p className="text-base text-white/90 leading-relaxed font-sans">{review.summary}</p>
                <div className="mt-6 flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-white">{review.overallScore}</span>
                  <span className="text-neutral-500 text-sm font-mono uppercase tracking-tighter">/ 10 Overall Score</span>
                </div>
              </div>

              {/* Matrix Blocks */}
              <div className="grid grid-cols-2 gap-4">
                 <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2">
                    <div className="flex items-center gap-2 text-[10px] text-neutral-500 uppercase tracking-widest font-bold">
                        <Clock className="w-3 h-3 text-emerald-400" />
                        Time Complexity
                    </div>
                    <div className="text-sm font-mono text-emerald-400">{review.timeComplexity}</div>
                 </div>
                 <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2">
                    <div className="flex items-center gap-2 text-[10px] text-neutral-500 uppercase tracking-widest font-bold">
                        <Layout className="w-3 h-3 text-cyan-400" />
                        Space Complexity
                    </div>
                    <div className="text-sm font-mono text-cyan-400">{review.spaceComplexity}</div>
                 </div>
              </div>

              {/* Metrics */}
              <div className="space-y-6">
                <ScoreBar label="Correctness" score={review.correctness.score} icon={CheckCircle2} />
                <ScoreBar label="Code Quality" score={review.codeQuality.score} icon={Code2} />
                <ScoreBar label="Best Practices" score={review.bestPractices.score} icon={Lightbulb} />
              </div>

              {/* Feedback Points */}
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-4">
                   <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                      Critical Feedback
                   </h3>
                   <div className="grid gap-3">
                      {[review.correctness.feedback, review.codeQuality.feedback, review.bestPractices.feedback].map((fb, i) => (
                        <div key={i} className="flex gap-3 text-sm text-neutral-400 leading-relaxed">
                            <span className="w-1.5 h-1.5 rounded-full bg-white/10 mt-2 shrink-0" />
                            {fb}
                        </div>
                      ))}
                   </div>
                </div>

                <div className="space-y-4 mt-6">
                   <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-emerald-500" />
                      Actionable Suggestions
                   </h3>
                   <ul className="grid gap-3">
                      {review.suggestions.map((sug, i) => (
                        <li key={i} className="flex gap-3 text-sm text-white/80 leading-relaxed p-3 rounded-lg bg-white/5 border border-white/5">
                            <span className="text-emerald-500 font-bold"># {i+1}</span>
                            {sug}
                        </li>
                      ))}
                   </ul>
                </div>
              </div>
            </>
          ) : null}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/5 bg-white/5">
           <button 
             onClick={onClose}
             className="w-full py-4 rounded-xl bg-indigo-600 font-bold text-white hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/10"
           >
             Continue Improving
           </button>
        </div>
      </div>
    </div>
  );
};

// Simple Code icon placeholder if needed
const Code2 = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
  </svg>
);

export default ReviewPanel;
