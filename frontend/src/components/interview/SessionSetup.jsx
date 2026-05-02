import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Link } from 'react-router-dom';
import { LayoutDashboard } from 'lucide-react';
import codifyLogo from '../ui/logos/codify-logo.png';
import { TOPICS, DIFFICULTIES, LANGUAGES } from '@/lib/constants';
import pyLogo from '../ui/logos/python.png';
import javaLogo from '../ui/logos/java.png';
import './SessionSetup.css';

const ArrowRight = () => (
  <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
);

const DIFF_CONFIG = {
  easy: { color: '#10b981', glow: 'rgba(16,185,129,0.3)', bars: [6, 10, 5] },
  medium: { color: '#f59e0b', glow: 'rgba(245,158,11,0.3)', bars: [8, 14, 10] },
};

const LANG_LOGOS = {
  python: pyLogo,
  java: javaLogo,
};
const LANG_META = {
  python: { abbr: 'PY', color: '#60a5fa', bg: 'rgba(96,165,250,0.08)', border: 'rgba(96,165,250,0.22)' },
  java: { abbr: 'JV', color: '#fb923c', bg: 'rgba(251,146,60,0.08)', border: 'rgba(251,146,60,0.22)' },
};

export default function SessionSetup({ onStart }) {
  const { user } = useAuth();
  const [topic, setTopic] = useState(TOPICS?.[0]?.id || 'arrays');
  const [difficulty, setDifficulty] = useState('medium');
  const [language, setLanguage] = useState(LANGUAGES?.[0]?.id || 'python');

  const selTopic = TOPICS?.find(t => t.id === topic);
  const selDiff = DIFFICULTIES?.find(d => d.id === difficulty);
  const selLang = LANGUAGES?.find(l => l.id === language);

  return (
    <div className="pg">
      {/* ══ LEFT HERO ══ */}
      <div className="lf">
        <div className="mesh" />
        <div className="gridlines" />




        <div className="nav">
          <div className="flex items-center gap-3">
            <img
              src={codifyLogo}
              alt="Codify"
              className="w-8 h-8 rounded-lg shadow-[0_0_12px_rgba(124,111,247,0.5)]"
            />
            <span className="text-lg font-semibold tracking-wide text-white">
              Codify <span className="text-violet-400 font-bold">AI</span>
            </span>
          </div>

          <div className="flex items-center gap-4 ml-auto">
            <Link
              to="/dashboard"
              className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-violet-500/30 transition-all group"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-violet-400 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-black text-white/50 group-hover:text-white uppercase tracking-widest">DashBoard</span>
            </Link>

          </div>
        </div>

        <div className="hero">
          <div className="ey">
            <div className="ey-ln" /><span className="ey-tx">AI Interview Coach</span>
          </div>
          <h1 className="h1">
            Crack any<br /><em>FAANG</em> interview<br /><u>with confidence</u>.
          </h1>
          <p className="sub">
            Real-time AI feedback, adaptive problems, and detailed code reviews —
            everything you need to land your <strong>dream offer</strong>.
          </p>
          <div className="pills">
            {[{ c: '#7c6ff7', l: 'Adaptive AI' }, { c: '#10b981', l: 'Code Review' }, { c: '#22d3ee', l: 'Live Hints' }, { c: '#f59e0b', l: 'FAANG Problems' }].map(p => (
              <div className="pill" key={p.l}><div className="pill-dot" style={{ background: p.c }} />{p.l}</div>
            ))}
          </div>
          <div className="stats">
            {[{ n: '50', s: ' +', l: 'Problems' }, null, { n: '3', s: ' x', l: 'Topics' }, null, { n: ' 2', s: '', l: 'Levels' }, null, { n: '∞', s: '', l: 'Sessions' }].map((x, i) =>
              x === null
                ? <div className="st-sep" key={i} />
                : <div key={x.l}><div className="st-n">{x.n}<sup>{x.s}</sup></div><div className="st-l">{x.l}</div></div>
            )}
          </div>
        </div>
      </div>

      {/* ══ RIGHT CONFIG ══ */}
      <div className="rt">

        <div className="blk blk1">
          <div className="sec-hd">
            <div className="sec-num">01</div>
            <span className="sec-lbl">Focus area</span>
            <div className="sec-rule" />
          </div>
          <div className="tgrid">
            {(TOPICS || []).map(t => (
              <button key={t.id} className={`tbtn${topic === t.id ? ' on' : ''}`} onClick={() => setTopic(t.id)}>
                <div className="t-top">
                  <span className="t-ico">{t.icon}</span>
                  <div className="t-chk">
                    <svg width="7" height="6" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4l3 3 5-6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
                <div className="t-name">{t.label}</div>
                <div className="t-desc">{t.description}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="blk blk2">
          <div className="sec-hd">
            <div className="sec-num">02</div>
            <span className="sec-lbl">Difficulty</span>
            <div className="sec-rule" />
          </div>
          <div className="drow">
            {(DIFFICULTIES || []).map(d => {
              const cfg = DIFF_CONFIG[d.id] || DIFF_CONFIG.medium;
              const on = difficulty === d.id;
              return (
                <button key={d.id} className="dbtn" onClick={() => setDifficulty(d.id)}
                  style={on ? { borderColor: cfg.color + '55', background: cfg.color + '10', boxShadow: `0 0 0 1px ${cfg.color}1a inset,0 6px 20px ${cfg.glow}` } : {}}>
                  <div className="dbars">
                    {cfg.bars.map((h, i) => (
                      <div key={i} className="dbar" style={{ height: h, background: on ? cfg.color : undefined, opacity: on ? [.4, .65, 1][i] : 1 }} />
                    ))}
                  </div>
                  <div className="dlbl" style={on ? { color: cfg.color } : {}}>{d.label}</div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="blk blk3">
          <div className="sec-hd">
            <div className="sec-num">03</div>
            <span className="sec-lbl">Language</span>
            <div className="sec-rule" />
          </div>
          <div className="lgrid">
            {(LANGUAGES || []).map(l => {
              const cfg = LANG_META[l.id] || { abbr: l.label?.slice(0, 2).toUpperCase(), color: '#888', bg: 'rgba(255,255,255,.05)', border: 'rgba(255,255,255,.1)' };
              const on = language === l.id;
              return (
                <button key={l.id} className={`lbtn${on ? ' on' : ''}`} onClick={() => setLanguage(l.id)}
                  style={on ? { borderColor: cfg.border, background: cfg.bg, boxShadow: `0 0 16px -4px ${cfg.color}44` } : {}}>
                  <img
                    src={LANG_LOGOS[l.id]}
                    alt={l.label}
                    className="limg"
                  />

                </button>
              );
            })}
          </div>
        </div>

        <div className="blk blk4 cta-wrap">
          <button className="cta-btn" onClick={() => onStart({ topic, difficulty, language })}>
            <span className="cta-in">Begin Session<span className="cta-arr"><ArrowRight /></span></span>
          </button>
          <div className="cta-meta">
            <span className="cta-v">{selTopic?.label || '—'}</span>
            <div className="cta-sep" />
            <span className="cta-v">{selDiff?.label || '—'}</span>
            <div className="cta-sep" />
            <span className="cta-v">{selLang?.label || '—'}</span>
          </div>
        </div>

      </div>
    </div>
  );
}