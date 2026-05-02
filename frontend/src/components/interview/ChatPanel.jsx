import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Send, Bot, Sparkles } from 'lucide-react';

export default function ChatPanel({ messages, isLoading, onSend, onHint }) {
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = () => {
    const text = input.trim();
    if (!text || isLoading) return;
    setInput('');
    onSend(text);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const userInitial = 'U';

  return (
    <div className="flex flex-col h-full overflow-hidden bg-[#0f0f12]">
      {/* Panel header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-white/5 bg-white/[0.02]">
        <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
          <Bot className="w-4 h-4" />
        </div>
        <div>
          <span className="font-sans text-xs font-black text-white uppercase tracking-widest">Interviewer</span>
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-tighter">Live Session</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-8 space-y-10 scrollbar-hide">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-40">
            <Sparkles className="w-10 h-10 text-indigo-500" />
            <p className="font-mono text-[10px] uppercase font-black tracking-widest text-neutral-400">Initializing Neural Link...</p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            {/* Avatar */}
            <div className={`w-9 h-9 flex-shrink-0 rounded-2xl flex items-center justify-center text-xs font-black shadow-lg ${msg.role === 'assistant'
              ? 'bg-indigo-600 text-white shadow-indigo-500/10'
              : 'bg-[#1a1a1e] border border-white/10 text-neutral-400'
              }`}>
              {msg.role === 'assistant' ? <Bot className="w-4 h-4" /> : userInitial}
            </div>

            {/* Bubble */}
            <div className={`max-w-[85%] rounded-2xl px-5 py-3.5 text-sm leading-relaxed shadow-sm transition-all hover:shadow-md ${msg.role === 'assistant'
              ? 'bg-[#1a1a1e] border border-white/5 text-neutral-200'
              : 'bg-indigo-600/10 border border-indigo-500/20 text-white'
              }`}>
              <div className="prose prose-sm prose-invert max-w-none 
                  [&_p]:mb-4 [&_p:last-child]:mb-0 
                  [&_code]:font-mono [&_code]:text-indigo-400 [&_code]:bg-indigo-500/5 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded-md [&_code]:before:content-none [&_code]:after:content-none
                  [&_pre]:bg-black/40 [&_pre]:border [&_pre]:border-white/5 [&_pre]:rounded-xl [&_pre]:p-4 [&_pre]:mt-3
                  [&_strong]:text-white [&_strong]:font-black [&_strong]:tracking-tight">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {msg.content}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex gap-4 animate-in fade-in duration-300">
            <div className="w-9 h-9 flex-shrink-0 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/10">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-[#1a1a1e] border border-white/5 rounded-2xl px-5 py-4 flex items-center gap-2">
              <span className="text-[10px] font-mono font-black uppercase text-neutral-500 tracking-widest mr-2">Thinking</span>
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500/60 animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500/60 animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500/60 animate-bounce" />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-6 bg-[#0d0d0f] border-t border-white/5">
        <div className="relative group">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your response here..."
            rows={2}
            className="w-full bg-[#161618] border border-white/5 rounded-2xl pl-5 pr-14 py-4 text-sm text-white placeholder:text-neutral-600 resize-none transition-all focus:outline-none focus:border-indigo-500/40 focus:bg-[#1a1a1e] shadow-inner"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="absolute right-3 bottom-3 p-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 transition-all disabled:opacity-30 flex-shrink-0 shadow-lg shadow-indigo-600/20 z-10"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <div className="mt-3 flex items-center justify-between px-2">
          <p className="text-[10px] font-mono font-bold text-neutral-600 uppercase tracking-widest">ENTER TO SEND</p>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono font-bold text-neutral-600 uppercase tracking-widest">Neural Link</span>
            <span className="h-1 w-1 rounded-full bg-emerald-500" />
          </div>
        </div>
      </div>
    </div>
  );
}
