import React, { useState, useEffect } from 'react';
import { useUserName } from '@/hooks/useUserName';

const NameEntryModal = () => {
  const { userName, setUserName } = useUserName();
  const [inputValue, setInputValue] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const storedName = sessionStorage.getItem('userName');
    if (!storedName) {
      setShowModal(true);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setUserName(inputValue.trim());
      setShowModal(false);
    }
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0d0d0f]">
      <div className="w-full max-w-md px-6 text-center">
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 animate-pulse rounded-full bg-indigo-500/20 blur-xl"></div>
            <svg
              className="relative h-16 w-16 text-indigo-500"
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
            </svg>
          </div>
        </div>

        <h1 className="mb-2 text-3xl font-bold tracking-tight text-white">Welcome to Codify</h1>
        <p className="mb-8 text-neutral-400">Your personal AI coding interview coach.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="text"
              autoFocus
              placeholder="What should we call you?"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 py-4 pl-6 pr-12 text-lg text-white placeholder-white/20 transition-all focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="absolute right-2 top-2 flex h-11 items-center justify-center rounded-lg bg-indigo-600 px-4 font-medium text-white transition-all hover:bg-indigo-500 disabled:opacity-50"
            >
              Let's Go &rarr;
            </button>
          </div>
        </form>
      </div>

      {/* Decorative elements */}
      <div className="pointer-events-none absolute left-0 top-0 h-64 w-64 bg-indigo-500/10 blur-[120px]"></div>
      <div className="pointer-events-none absolute bottom-0 right-0 h-64 w-64 bg-emerald-500/10 blur-[120px]"></div>
    </div>
  );
};

export default NameEntryModal;
