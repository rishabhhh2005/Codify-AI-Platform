import React, { useState } from 'react';
import { X, CheckCircle2, XCircle, AlertCircle, ChevronRight, Terminal } from 'lucide-react';

const CodeResultsPanel = ({ results, isLoading, onClose }) => {
  const [activeTab, setActiveTab] = useState('result');
  const [selectedTestCase, setSelectedTestCase] = useState(0);

  if (isLoading) {
    return (
      <div className="flex h-full flex-col border-t border-white/10 bg-[#0d0d10] font-mono">
        <div className="flex items-center justify-between px-4 py-2 border-b border-white/5">
          <div className="flex items-center gap-2 text-neutral-400 text-xs font-bold uppercase">
             <Terminal className="w-3.5 h-3.5" />
             Console
          </div>
          <button onClick={onClose} className="text-neutral-500 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-neutral-400">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent"></div>
            <span className="text-[11px] font-bold uppercase tracking-widest animate-pulse">Running...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!results) {
     return (
      <div className="flex h-full flex-col border-t border-white/10 bg-[#0d0d10] font-mono">
        <div className="flex items-center justify-between px-4 py-2 border-b border-white/5">
          <div className="flex items-center gap-2 text-neutral-400 text-xs font-bold uppercase">
             <Terminal className="w-3.5 h-3.5" />
             Console
          </div>
          <button onClick={onClose} className="text-neutral-500 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1 flex items-center justify-center text-neutral-600 text-[11px] uppercase font-bold tracking-widest">
            Run your code to see results
        </div>
      </div>
    );
  }

  const isAccepted = results.isBatch ? results.statusText === 'Accepted' : results.status?.id === 3;
  const currentTC = results.isBatch ? (results.testResults?.[selectedTestCase] || null) : null;

  return (
    <div className="flex h-full flex-col border-t border-white/10 bg-[#0d0d10] font-mono overflow-hidden">
      {/* Console Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 flex-shrink-0">
        <div className="flex items-center gap-6">
           <div className="flex items-center gap-2 text-neutral-400 text-xs font-bold uppercase">
             <Terminal className="w-3.5 h-3.5" />
             Console
          </div>
          <div className="flex items-center gap-1">
             <button 
                onClick={() => setActiveTab('testcase')}
                className={`px-3 py-1 text-[10px] font-bold uppercase rounded-md transition-all ${activeTab === 'testcase' ? 'bg-white/10 text-white' : 'text-neutral-500 hover:text-neutral-300'}`}
             >
                Testcase
             </button>
             <button 
                onClick={() => setActiveTab('result')}
                className={`px-3 py-1 text-[10px] font-bold uppercase rounded-md transition-all ${activeTab === 'result' ? 'bg-white/10 text-white' : 'text-neutral-500 hover:text-neutral-300'}`}
             >
                Result
             </button>
          </div>
        </div>
        <button onClick={onClose} className="text-neutral-500 hover:text-white transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {activeTab === 'result' ? (
          <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
             {/* Status Header */}
             <div className="flex items-start justify-between">
                <div>
                   <h3 className={`text-lg font-bold flex items-center gap-2 ${isAccepted ? 'text-emerald-400' : 'text-red-400'}`}>
                     {isAccepted ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                     {results.isBatch ? results.statusText : results.status?.description}
                   </h3>
                   {results.isBatch && (
                     <p className="text-xs text-neutral-500 mt-1">
                       {results.passed}/{results.total} test cases passed
                     </p>
                   )}
                </div>
                {results.time && (
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[10px] text-neutral-500 uppercase font-bold tracking-tighter">Runtime</span>
                    <span className="text-xs text-neutral-300">{results.time}s</span>
                  </div>
                )}
             </div>

             {/* Batch Test Case Selector */}
             {results.isBatch && results.testResults && (
                <div className="flex gap-2 p-1 bg-white/5 rounded-lg border border-white/10 w-fit">
                   {results.testResults.map((tc, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedTestCase(idx)}
                        className={`px-3 py-1.5 rounded-md text-[10px] font-bold transition-all flex items-center gap-2 ${
                            selectedTestCase === idx 
                            ? 'bg-neutral-700 text-white shadow-lg' 
                            : 'text-neutral-500 hover:bg-white/5'
                        }`}
                      >
                         <div className={`w-1.5 h-1.5 rounded-full ${tc.status.id === 3 ? 'bg-emerald-500' : 'bg-red-500'}`} />
                         Case {idx + 1}
                      </button>
                   ))}
                </div>
             )}

             {/* Result Content */}
             <div className="flex flex-col gap-5">
                {results.status?.id === 6 ? (
                  <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="flex items-center gap-2 text-red-500 font-bold uppercase text-[10px] tracking-widest">
                       <AlertCircle className="w-4 h-4" />
                       Compilation Error
                    </div>
                    <pre className="p-4 bg-red-500/5 border border-red-500/10 rounded-xl text-xs text-red-400 font-mono whitespace-pre-wrap leading-relaxed">
                       {results.compile_output || results.stderr || 'An unknown compilation error occurred.'}
                    </pre>
                  </div>
                ) : results.isBatch && currentTC ? (
                   <>
                      <div className="flex flex-col gap-2">
                         <span className="text-[10px] text-neutral-500 font-bold uppercase">Input</span>
                         <div className="p-3 bg-white/5 rounded-lg border border-white/5 text-[12px] text-neutral-200">
                            {currentTC.input}
                         </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div className="flex flex-col gap-2">
                           <span className="text-[10px] text-neutral-500 font-bold uppercase">Expected</span>
                           <div className="p-3 bg-emerald-500/5 rounded-lg border border-emerald-500/10 text-[12px] text-emerald-400 font-bold">
                              {currentTC.expected_output}
                           </div>
                         </div>
                         <div className="flex flex-col gap-2">
                           <span className="text-[10px] text-neutral-500 font-bold uppercase">Actual Output</span>
                           <div className={`p-3 rounded-lg border text-[12px] font-bold ${currentTC.status.id === 3 ? 'bg-emerald-500/5 border-emerald-500/10 text-emerald-400' : 'bg-red-500/5 border-red-500/10 text-red-400'}`}>
                              {currentTC.stdout || currentTC.stderr || 'No output'}
                           </div>
                         </div>
                      </div>
                   </>
                ) : (
                   <div className="flex flex-col gap-4">
                      {results.stdout && (
                        <div className="flex flex-col gap-2">
                           <span className="text-[10px] text-neutral-500 font-bold uppercase">Standard Output</span>
                           <pre className="p-4 bg-white/5 rounded-lg border border-white/5 text-xs text-neutral-300 whitespace-pre-wrap">{results.stdout}</pre>
                        </div>
                      )}
                      {(results.stderr || results.compile_output) && (
                        <div className="flex flex-col gap-2">
                           <div className="flex items-center gap-2 text-[10px] text-red-500 font-bold uppercase">
                              <AlertCircle className="w-3 h-3" />
                              Runtime Error
                           </div>
                           <pre className="p-4 bg-red-500/5 rounded-lg border border-red-500/10 text-xs text-red-400 whitespace-pre-wrap">
                              {results.stderr || results.compile_output}
                           </pre>
                        </div>
                      )}
                      {!results.stdout && !results.stderr && !results.compile_output && (
                         <div className="text-neutral-600 italic text-xs">The script executed but produced no output.</div>
                      )}
                   </div>
                )}
             </div>
          </div>
        ) : (
           /* Testcase Tab */
           <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex flex-col gap-6">
                 {results.isBatch && results.testResults ? (
                    results.testResults.map((tc, idx) => (
                       <div key={idx} className="flex flex-col gap-2">
                          <span className="text-[10px] text-neutral-500 font-bold uppercase">Test Case {idx + 1}</span>
                          <div className="p-3 bg-white/5 rounded-lg border border-white/5 text-[12px] text-neutral-200">
                             {tc.input}
                          </div>
                       </div>
                    ))
                 ) : (
                    <div className="p-3 bg-white/5 rounded-lg border border-white/5 text-[12px] text-neutral-200">
                       {results.stdout || 'N/A'}
                    </div>
                 )}
              </div>
           </div>
        )}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.06); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.1); }
      `}</style>
    </div>
  );
};

export default CodeResultsPanel;
