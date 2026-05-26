import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { TOPICS, DIFFICULTIES, LANGUAGES } from '@/lib/constants';
import { LogOut, LayoutDashboard, ArrowRight } from 'lucide-react';

export default function SessionSetup({ onStart }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [topic, setTopic] = useState(TOPICS[0]?.id || 'arrays');
  const [difficulty, setDifficulty] = useState('medium');
  const [language, setLanguage] = useState(LANGUAGES[0]?.id || 'python');
  const [starting, setStarting] = useState(false);

  const selTopic = TOPICS.find((t) => t.id === topic);
  const selDiff = DIFFICULTIES.find((d) => d.id === difficulty);
  const selLang = LANGUAGES.find((l) => l.id === language);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleStart = async () => {
  if (starting) return;

  setStarting(true);

  try {
    await onStart({ topic, difficulty, language });
  } finally {
    setStarting(false);
  }
};  

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <div className="absolute top-0 left-0 right-0 h-px bg-white/10" />

      {/* Nav */}
      <header className="h-16 md:h-20 border-b border-white/10 flex items-center justify-between px-6 md:px-16 sticky top-0 z-50 bg-black/90 backdrop-blur-xl">
        <Link to="/" className="font-serif text-xl font-semibold tracking-tight">
          Codify <span className="text-violet-400">AI</span>
        </Link>
        <div className="flex items-center gap-4 md:gap-6">
          <Link
            to="/dashboard"
            className="hidden sm:flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-neutral-400 hover:text-white transition"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            Dashboard
          </Link>
          <span className="hidden sm:block text-neutral-700">|</span>
          <span className="hidden sm:block text-sm text-neutral-400">{user?.name}</span>
          <button onClick={handleLogout} className="text-neutral-500 hover:text-white transition">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      <div className="grid lg:grid-cols-2 min-h-[calc(100vh-64px)] md:min-h-[calc(100vh-80px)]">

        {/* LEFT — hero */}
<section className="flex flex-col justify-start px-6 md:px-16 pt-16 md:pt-24 border-b lg:border-b-0 lg:border-r border-white/10">          <p className="text-violet-400 tracking-[0.35em] uppercase text-xs mb-6 md:mb-8 flex items-center gap-4">
            <span className="block w-10 h-px bg-violet-400" />
            AI Integrated 
          </p>
          <h1 className="font-serif text-5xl md:text-6xl xl:text-7xl leading-[0.95] tracking-tight">
            Crack any<br />
            <span className="italic text-violet-400">FAANG</span><br />
            Assessment.
          </h1>
          <p className="mt-6 md:mt-8 text-neutral-500 text-base md:text-lg leading-8 max-w-md">
            Real-time AI feedback, adaptive problems, and detailed code reviews —
            everything you need to land your <strong className="text-white font-medium">dream offer</strong>.
          </p>

          {/* Stats */}
          <div className="mt-8 md:mt-12 grid grid-cols-4 border border-white/10">
            {[
              { n: '50+', l: 'Problems' },
              { n: '3', l: 'Topics' },
              { n: '2', l: 'Levels' },
              { n: '∞', l: 'Sessions' },
            ].map((s, i) => (
              <div key={s.l} className={`p-4 md:p-5 ${i < 3 ? 'border-r border-white/10' : ''}`}>
                <p className="font-serif text-xl md:text-2xl text-white">{s.n}</p>
                <p className="text-neutral-600 tracking-[0.15em] uppercase text-xs mt-1">{s.l}</p>
              </div>
            ))}
          </div>
        </section>

        {/* RIGHT — config */}
        <section className="flex flex-col justify-center px-6 md:px-12 lg:px-16 py-10 md:py-12 overflow-y-auto">
          <div className="max-w-lg w-full mx-auto space-y-10">

            {/* 01 Topic */}
            <div>
              <p className="text-neutral-500 tracking-[0.3em] uppercase text-xs mb-5 flex items-center gap-3">
                <span className="text-violet-400">01</span> Focus Area
              </p>
              <div className="space-y-2">
                {TOPICS.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTopic(t.id)}
                    className={`w-full flex items-start gap-5 p-5 border text-left transition ${
                      topic === t.id
                        ? 'border-violet-500 bg-violet-500/5'
                        : 'border-white/10 hover:border-white/20 hover:bg-white/[0.02]'
                    }`}
                  >
                    <span className={`font-mono text-xs font-bold mt-0.5 w-8 shrink-0 ${topic === t.id ? 'text-violet-400' : 'text-neutral-600'}`}>
                      {t.icon}
                    </span>
                    <div>
                      <p className={`text-sm font-medium ${topic === t.id ? 'text-white' : 'text-neutral-300'}`}>{t.label}</p>
                      <p className="text-xs text-neutral-600 mt-0.5">{t.description}</p>
                    </div>
                    {topic === t.id && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-400 mt-1.5 shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* 02 Difficulty */}
            <div>
              <p className="text-neutral-500 tracking-[0.3em] uppercase text-xs mb-5 flex items-center gap-3">
                <span className="text-violet-400">02</span> Difficulty
              </p>
              <div className="grid grid-cols-2 gap-3">
                {DIFFICULTIES.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => setDifficulty(d.id)}
                    className={`p-5 border text-left transition ${
                      difficulty === d.id
                        ? 'border-violet-500 bg-violet-500/5'
                        : 'border-white/10 hover:border-white/20'
                    }`}
                  >
                    <p className={`font-serif text-2xl ${difficulty === d.id ? 'text-white' : 'text-neutral-500'}`}>{d.label}</p>
                    <p className="text-xs text-neutral-600 tracking-widest uppercase mt-1">
                      {d.id === 'easy' ? 'Foundational' : 'Intermediate'}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* 03 Language */}
            <div>
              <p className="text-neutral-500 tracking-[0.3em] uppercase text-xs mb-5 flex items-center gap-3">
                <span className="text-violet-400">03</span> Language
              </p>
              <div className="grid grid-cols-2 gap-3">
                {LANGUAGES.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => setLanguage(l.id)}
                    className={`p-5 border text-left transition ${
                      language === l.id
                        ? 'border-violet-500 bg-violet-500/5'
                        : 'border-white/10 hover:border-white/20'
                    }`}
                  >
                    <p className={`font-serif text-2xl ${language === l.id ? 'text-white' : 'text-neutral-500'}`}>{l.label}</p>
                    <p className="text-xs text-neutral-600 tracking-widest uppercase mt-1">{l.ext}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div>
              <button
  onClick={handleStart}
  disabled={starting}
  className="w-full h-14 bg-violet-500 hover:bg-violet-400 disabled:opacity-70 disabled:cursor-not-allowed text-black uppercase tracking-[0.25em] text-sm font-semibold transition flex items-center justify-center gap-3"
>
  {starting ? (
    <div className="flex items-center gap-1">
      <span className="w-1.5 h-1.5 rounded-full bg-black animate-bounce [animation-delay:0ms]" />
      <span className="w-1.5 h-1.5 rounded-full bg-black animate-bounce [animation-delay:150ms]" />
      <span className="w-1.5 h-1.5 rounded-full bg-black animate-bounce [animation-delay:300ms]" />
    </div>
  ) : (
    <>
      Begin Session
      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
    </>
  )}
</button>
              <p className="mt-4 text-center text-xs text-neutral-600 tracking-widest uppercase">
                {selTopic?.label} · {selDiff?.label} · {selLang?.label}
              </p>
            </div>

          </div>
        </section>
      </div>
    </div>
  );
}
