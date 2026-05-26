import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Send } from 'lucide-react';

export default function ChatPanel({ messages, isLoading, onSend }) {
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);
  const messagesRef = useRef(null);
  const [cooldown, setCooldown] = useState(false);
  useEffect(() => {
    const container = messagesRef.current;
    if (!container) return;

    const threshold = 120;
    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight < threshold;

    if (isNearBottom) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  const handleSend = () => {
  const text = input.trim();

  if (!text || isLoading || cooldown) return;

  setInput('');
  onSend(text);

  setCooldown(true);

  setTimeout(() => {
    setCooldown(false);
  }, 6000);
};

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-black text-white">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-white/10 bg-black">
        <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-[10px] font-bold tracking-widest text-neutral-300">
          IV
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white">
            CODIFY AI 
          </p>
          <div className="flex items-center gap-2 mt-1">
          
            
          </div>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={messagesRef}
        className="flex-1 overflow-y-auto px-6 py-8 space-y-8 scrollbar-hide"
      >
        {messages.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-70">
            <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">
              Ask Your Doubts
            </p>
            <p className="text-sm text-neutral-400 max-w-sm">
              Ask clarifications about the problem, constraints, or approach.
            </p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-3 items-end ${
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {/* Assistant Avatar Only */}
            {msg.role === 'assistant' && (
              <div className="w-10 h-10 flex-shrink-0 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-[10px] font-bold tracking-widest text-neutral-300">
                IV
              </div>
            )}

            {/* Message */}
            <div
              className={`max-w-[75%] rounded-2xl px-5 py-4 text-sm leading-relaxed ${
                msg.role === 'assistant'
                  ? 'bg-[#141416] border border-white/10 text-neutral-200'
                  : 'bg-[#8B5CF6] text-black'
              }`}
            >
              <div
                className={`prose prose-sm max-w-none ${
                  msg.role === 'assistant' ? 'prose-invert' : ''
                }
                  [&_p]:mb-4
                  [&_p:last-child]:mb-0
                  [&_code]:font-mono
                  [&_code]:px-1.5
                  [&_code]:py-0.5
                  [&_code]:rounded-md
                  [&_code]:before:content-none
                  [&_code]:after:content-none
                  [&_pre]:rounded-xl
                  [&_pre]:p-4
                  [&_pre]:mt-3
                `}
              >
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {msg.content}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        ))}

        {/* Loading */}
        {isLoading && (
          <div className="flex gap-4 items-end">
            <div className="w-10 h-10 flex-shrink-0 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-[10px] font-bold tracking-widest text-neutral-300">
              IV
            </div>

            <div className="bg-[#141416] border border-white/10 rounded-2xl px-5 py-4 flex items-center gap-3">
              <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-500">
                Reviewing Response
              </span>

              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-bounce" />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-6 border-t border-white/10 bg-black">
        <div className="relative">
          <textarea
            value={input}
            disabled={cooldown}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
         placeholder={
  cooldown
    ? 'Please wait...'
    : 'Ask Codify AI..'
}
            rows={2}
            className="w-full bg-[#121214] border border-white/10 rounded-2xl pl-5 pr-16 py-4 text-sm text-white placeholder:text-neutral-600 resize-none focus:outline-none focus:border-[#8B5CF6] transition"
          />

          <button
            onClick={handleSend}
            disabled={isLoading || cooldown || !input.trim()}
            className="absolute right-3 bottom-3 p-2.5 bg-[#8B5CF6] text-black rounded-xl hover:bg-[#9F67FF] transition disabled:opacity-30"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-3 flex items-center justify-between px-1">
          <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-600">
            Enter to send
          </p>

          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-600">
              Live interview
            </span>
            <span className="h-1 w-1 rounded-full bg-emerald-500" />
          </div>
        </div>
      </div>
    </div>
  );
}