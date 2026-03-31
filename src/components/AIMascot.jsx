import React, { useState, useEffect, useRef } from 'react';
import { useUserName } from '@/hooks/useUserName';

const MESSAGES = [
  "Keep going, __NAME__ — you're making progress!",
  "Think about edge cases, __NAME__. What if the input is empty?",
  "You've got this, __NAME__. Trust your instincts.",
  "Take a breath, __NAME__. Break the problem into smaller parts.",
  "What's the time complexity of your current approach, __NAME__?",
  "Could there be a more optimal solution, __NAME__? Think Big O.",
  "Narrate your thought process, __NAME__ — interviewers love that.",
  "Almost there, __NAME__! Check your loop conditions.",
  "Remember, __NAME__ — a working brute force beats no solution.",
  "Great start, __NAME__! Now think about how to optimise it.",
  "What data structure would make this easier, __NAME__?",
  "You're doing great, __NAME__ — keep the momentum going!",
  "Don't forget to handle null or undefined inputs, __NAME__.",
  "Can you write a helper function here, __NAME__? It'll clean things up.",
  "Think recursively, __NAME__. Can this problem be broken into subproblems?",
  "Debug out loud, __NAME__ — trace through a small example by hand.",
  "Solid logic, __NAME__! Now make sure the code matches your thinking.",
  "One step at a time, __NAME__. You're closer than you think!",
];

const AIMascot = ({ phase }) => {
  const { userName } = useUserName();
  const [currentMessage, setCurrentMessage] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (phase !== 'interview') {
      setIsVisible(false);
      setCurrentMessage(null);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      return;
    }

    const showMessage = () => {
      const randomMsg = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
      setCurrentMessage(randomMsg.replace('__NAME__', userName || 'Friend'));
      setIsVisible(true);

      // Hide after 4 seconds
      setTimeout(() => {
        setIsVisible(false);
        
        // Wait 8-12 seconds before next message
        const nextDelay = Math.floor(Math.random() * 4000) + 8000;
        timeoutRef.current = setTimeout(showMessage, nextDelay);
      }, 4000);
    };

    // Initial delay
    timeoutRef.current = setTimeout(showMessage, 5000);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [phase, userName]);

  if (phase !== 'interview') return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center">
      {/* Speech Bubble */}
      <div
        className={`mb-4 max-w-[220px] rounded-2xl border border-white/10 bg-[#1a1a1e] p-4 font-mono text-sm text-white shadow-2xl transition-all duration-500 ease-in-out ${
          isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-4 opacity-0 scale-95 pointer-events-none'
        }`}
        style={{
          boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)',
        }}
      >
        <div className="relative">
          {currentMessage}
          {/* Bubble Tail */}
          <div className="absolute -bottom-6 right-4 h-4 w-4 rotate-45 border-b border-r border-white/10 bg-[#1a1a1e]"></div>
        </div>
      </div>

      {/* Mascot Icon */}
      <div className="relative group">
        <div className={`absolute inset-0 rounded-full bg-indigo-500/20 blur-md transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0 animate-pulse'}`}></div>
        <div className="relative flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-[#1a1a1e] text-indigo-500 shadow-xl transition-transform hover:scale-110">
          <svg
            className="h-8 w-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
            <circle cx="9" cy="9" r="1" fill="currentColor" />
            <circle cx="15" cy="9" r="1" fill="currentColor" />
            <path d="M9 13h6" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      <style>{`
        @keyframes idle-pulse {
          0%, 100% { transform: scale(1); opacity: 0.2; }
          50% { transform: scale(1.2); opacity: 0.4; }
        }
      `}</style>
    </div>
  );
};

export default AIMascot;
