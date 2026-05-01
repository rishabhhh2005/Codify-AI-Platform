import React from 'react';
import CodeEditor from './CodeEditor';

const EditorPanel = ({ 
  code, 
  setCode, 
  language, 
  hasRunCode, 
  setHasRunCode, 
  currentQuestion, 
  currentQuestionIndex, 
  updateSubmissionResult,
  fileName,
  langLabel
}) => {
  return (
    <div className="h-full flex flex-col bg-[#0a0a0e] relative overflow-hidden animate-fade-in [animation-delay:70ms]">
      {/* Scanline Effect */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-60 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,0,0,0.04)_2px,rgba(0,0,0,0.04)_4px)]" />
      
      {/* Editor Header */}
      <div className="flex items-center gap-2.5 px-4 h-[42px] bg-black/30 border-b border-white/[0.04] shrink-0 relative z-10">
        <div className="flex items-center gap-1.5 font-mono text-[10px] font-semibold tracking-widest text-[#22d3ee]/85 uppercase">
          <div className="w-1.5 h-1.5 rounded-full bg-[#22d3ee] shadow-[0_0_8px_#22d3ee/50]" />
          {langLabel}
        </div>
        <div className="h-3.5 w-[1px] bg-white/10 mx-1" />
        <span className="font-mono text-[11px] text-white/30 tracking-tight">{fileName}</span>

        <div className="ml-auto flex gap-1.5 items-center">
          <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57] opacity-35 hover:opacity-65 transition-opacity" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e] opacity-35 hover:opacity-65 transition-opacity" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#28c840] opacity-35 hover:opacity-65 transition-opacity" />
        </div>
        
        {/* Animated Glow Line */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#22d3ee]/25 to-transparent" />
      </div>

      {/* Editor Area */}
      <div className="flex-1 min-h-0 relative z-10">
        <CodeEditor
          code={code}
          onChange={(val) => setCode(val || '')}
          language={language?.toLowerCase() || 'python'}
          hasRunCode={hasRunCode}
          setHasRunCode={setHasRunCode}
          question={currentQuestion}
          onSubmissionResult={(res) => updateSubmissionResult(currentQuestionIndex, res)}
        />
      </div>
    </div>
  );
};

export default EditorPanel;
