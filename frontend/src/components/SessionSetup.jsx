import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Link } from 'react-router-dom';
import { LayoutDashboard } from 'lucide-react';
import { TOPICS, DIFFICULTIES, LANGUAGES } from '@/lib/constants';
import jsLogo from '../components/ui/logos/javascript.png';
import pyLogo from '../components/ui/logos/python.png';
import javaLogo from '../components/ui/logos/java.png';
import cppLogo from '../components/ui/logos/cpp.svg';

const ArrowRight = () => (
  <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
);

const DIFF_CONFIG = {
  easy: { color: '#10b981', glow: 'rgba(16,185,129,0.3)', bars: [6, 10, 5] },
  medium: { color: '#f59e0b', glow: 'rgba(245,158,11,0.3)', bars: [8, 14, 10] },
  hard: { color: '#ef4444', glow: 'rgba(239,68,68,0.3)', bars: [12, 16, 16] },
  'very-hard': { color: '#a855f7', glow: 'rgba(168,85,247,0.3)', bars: [14, 20, 24] },
};

const LANG_LOGOS = {
  javascript: jsLogo,
  python: pyLogo,
  java: javaLogo,
  cpp: cppLogo,
};
const LANG_META = {
  javascript: { abbr: 'JS', color: '#f7df1e', bg: 'rgba(247,223,30,0.08)', border: 'rgba(247,223,30,0.22)' },
  python: { abbr: 'PY', color: '#60a5fa', bg: 'rgba(96,165,250,0.08)', border: 'rgba(96,165,250,0.22)' },
  java: { abbr: 'JV', color: '#fb923c', bg: 'rgba(251,146,60,0.08)', border: 'rgba(251,146,60,0.22)' },
  cpp: { abbr: 'C+', color: '#c084fc', bg: 'rgba(192,132,252,0.08)', border: 'rgba(192,132,252,0.22)' },
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=DM+Mono:wght@300;400;500&family=Instrument+Serif:ital@0;1&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}

:root{
  --ink:#07070b;
  --card:#0c0c12;
  --lift:#111118;
  --raise:#16161f;
  --border:rgba(255,255,255,0.06);
  --border2:rgba(255,255,255,0.11);
  --border3:rgba(255,255,255,0.18);
  --t1:#ededf5;
  --t2:rgba(237,237,245,0.52);
  --t3:rgba(237,237,245,0.28);
  --t4:rgba(237,237,245,0.13);
  --v:#7c6ff7;--v2:#a899ff;--c:#22d3ee;--g:#10b981;
  --mono:'DM Mono',monospace;
  --dsp:'Instrument Serif',serif;
  --ui:'Space Grotesk',sans-serif;
}

html,body,#root{height:100%;background:var(--ink);}

.pg{
  min-height:100vh;
  display:grid;
  grid-template-columns:1fr 480px;
  background:var(--ink);
  font-family:var(--ui);
  -webkit-font-smoothing:antialiased;
  position:relative;
  overflow:hidden;
}

/* ─── LEFT ─── */
.lf{
  position:relative;display:flex;flex-direction:column;
  padding:48px 56px;border-right:1px solid var(--border);overflow:hidden;
}

.mesh{
  position:absolute;inset:0;pointer-events:none;
  background:
    radial-gradient(ellipse 70% 60% at 15% 20%, rgba(124,111,247,0.17) 0%, transparent 65%),
    radial-gradient(ellipse 55% 50% at 75% 80%, rgba(16,185,129,0.09) 0%, transparent 60%),
    radial-gradient(ellipse 40% 40% at 82% 12%, rgba(34,211,238,0.07) 0%, transparent 60%);
}

.gridlines{
  position:absolute;inset:0;pointer-events:none;
  background-image:
    linear-gradient(rgba(255,255,255,0.024) 1px,transparent 1px),
    linear-gradient(90deg,rgba(255,255,255,0.024) 1px,transparent 1px);
  background-size:58px 58px;
  mask-image:radial-gradient(ellipse 80% 70% at 30% 50%,black 10%,transparent 100%);
}

/* Floating stat cards */
.fc{
  position:absolute;
  background:rgba(12,12,18,0.84);border:1px solid var(--border2);
  border-radius:14px;padding:14px 18px;
  backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);
  opacity:0;animation:rise .65s cubic-bezier(.22,1,.36,1) forwards;
}
.fc1{top:27%;left:6%;animation-delay:1.1s}
.fc2{top:50%;right:5%;animation-delay:1.4s}
.fc3{bottom:27%;left:13%;animation-delay:1.7s}
.fc-val{font-family:var(--mono);font-size:22px;font-weight:500;color:var(--t1);line-height:1;margin-bottom:5px;}
.fc-sub{font-size:10px;font-weight:500;color:var(--t3);letter-spacing:.07em;display:flex;align-items:center;gap:7px;}
.fc-dot{width:5px;height:5px;border-radius:50%;flex-shrink:0;}
.fc-tag{font-size:9px;font-weight:600;padding:2px 6px;border-radius:4px;margin-left:auto;}

@keyframes rise{
  from{opacity:0;transform:translateY(14px) scale(.97);}
  to{opacity:1;transform:translateY(0) scale(1);}
}

/* Nav */
.nav{display:flex;align-items:center;gap:12px;position:relative;z-index:2;margin-bottom:auto;opacity:0;animation:rise .5s ease .05s forwards;}
.logo-box{
  width:40px;height:40px;border-radius:11px;
  background:linear-gradient(135deg,rgba(124,111,247,0.2),rgba(34,211,238,0.1));
  border:1px solid rgba(124,111,247,0.3);
  display:flex;align-items:center;justify-content:center;color:var(--v2);
  box-shadow:0 0 24px rgba(124,111,247,0.18);
}
.logo-name{font-family:var(--mono);font-size:14px;font-weight:500;letter-spacing:.14em;color:var(--t1);}
.logo-name em{font-style:normal;color:var(--v2);}
.badge-live{
  margin-left:auto;display:flex;align-items:center;gap:6px;
  padding:5px 11px;border-radius:99px;border:1px solid var(--border2);
  font-family:var(--mono);font-size:9px;font-weight:500;letter-spacing:.1em;text-transform:uppercase;color:var(--t3);
}
.ld{width:5px;height:5px;border-radius:50%;background:var(--g);box-shadow:0 0 7px var(--g);animation:blink 2.2s ease-in-out infinite;}
@keyframes blink{0%,100%{opacity:1;}50%{opacity:.3;}}

/* Hero copy */
.hero{
  position:relative;z-index:2;display:flex;flex-direction:column;
  justify-content:center;flex:1;padding:60px 0 40px;
}

.ey{display:flex;align-items:center;gap:10px;margin-bottom:20px;opacity:0;animation:rise .55s ease .2s forwards;}
.ey-ln{height:1px;width:30px;background:linear-gradient(90deg,var(--v),transparent);}
.ey-tx{font-family:var(--mono);font-size:10px;font-weight:500;letter-spacing:.2em;text-transform:uppercase;color:var(--v2);}

h1.h1{
  font-family:var(--dsp);font-size:clamp(42px,4.8vw,64px);
  line-height:1.04;letter-spacing:-.01em;color:var(--t1);margin-bottom:20px;
  opacity:0;animation:rise .6s ease .32s forwards;
}
h1.h1 em{
  font-style:italic;
  background:linear-gradient(120deg,var(--v2) 0%,var(--c) 100%);
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
}
h1.h1 u{text-decoration:none;position:relative;display:inline-block;}
h1.h1 u::after{
  content:'';position:absolute;left:0;bottom:-3px;right:0;height:2px;
  background:linear-gradient(90deg,var(--v),var(--c));border-radius:2px;
}

.sub{
  font-size:15px;font-weight:400;color:var(--t2);line-height:1.68;max-width:400px;
  opacity:0;animation:rise .6s ease .44s forwards;
}
.sub strong{color:var(--t1);font-weight:600;}

.pills{
  display:flex;flex-wrap:wrap;gap:8px;margin-top:28px;
  opacity:0;animation:rise .55s ease .56s forwards;
}
.pill{
  display:flex;align-items:center;gap:7px;padding:6px 13px;border-radius:99px;
  border:1px solid var(--border2);background:rgba(255,255,255,0.024);
  font-size:12px;font-weight:500;color:var(--t2);
}
.pill-dot{width:5px;height:5px;border-radius:50%;}

.stats{
  display:flex;align-items:flex-end;gap:24px;margin-top:42px;
  opacity:0;animation:rise .55s ease .66s forwards;position:relative;z-index:2;
}
.st-n{font-family:var(--mono);font-size:28px;font-weight:500;color:var(--t1);line-height:1;}
.st-n sup{font-size:15px;background:linear-gradient(90deg,var(--v),var(--c));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
.st-l{font-size:10px;font-weight:500;color:var(--t3);letter-spacing:.06em;text-transform:uppercase;margin-top:4px;}
.st-sep{width:1px;height:32px;background:var(--border2);align-self:center;}

/* ─── RIGHT ─── */
.rt{
  display:flex;flex-direction:column;
  padding:36px 32px;background:var(--card);
  border-left:1px solid var(--border);overflow-y:auto;gap:28px;position:relative;
}
.rt::before{
  content:'';position:absolute;top:0;left:0;right:0;height:1px;
  background:linear-gradient(90deg,transparent 0%,var(--v) 40%,var(--c) 70%,transparent 100%);opacity:.55;
}
.rt::-webkit-scrollbar{width:3px;}
.rt::-webkit-scrollbar-track{background:transparent;}
.rt::-webkit-scrollbar-thumb{background:var(--border2);border-radius:2px;}

.sec-hd{display:flex;align-items:center;gap:9px;margin-bottom:14px;}
.sec-num{
  width:21px;height:21px;border-radius:6px;
  background:var(--lift);border:1px solid var(--border2);
  font-family:var(--mono);font-size:8px;font-weight:500;color:var(--v2);
  display:flex;align-items:center;justify-content:center;flex-shrink:0;
}
.sec-lbl{font-family:var(--mono);font-size:10px;font-weight:500;letter-spacing:.14em;text-transform:uppercase;color:var(--t3);}
.sec-rule{flex:1;height:1px;background:var(--border);}

.blk{opacity:0;animation:rise .5s ease forwards;}
.blk1{animation-delay:.12s}.blk2{animation-delay:.22s}.blk3{animation-delay:.32s}.blk4{animation-delay:.42s}

/* Topics */
.tgrid{display:grid;grid-template-columns:1fr 1fr;gap:7px;}
.tbtn{
  position:relative;display:flex;flex-direction:column;gap:5px;
  padding:13px 12px;border-radius:12px;border:1px solid var(--border);
  background:var(--lift);cursor:pointer;outline:none;text-align:left;overflow:hidden;
  transition:border-color .18s,background .18s,transform .18s,box-shadow .18s;
}
.tbtn::after{
  content:'';position:absolute;inset:0;border-radius:12px;
  background:radial-gradient(ellipse at 50% -20%,rgba(124,111,247,.14),transparent 65%);
  opacity:0;transition:opacity .2s;
}
.tbtn:hover{border-color:var(--border2);background:var(--raise);transform:translateY(-1px);}
.tbtn:hover::after,.tbtn.on::after{opacity:1;}
.tbtn.on{
  border-color:rgba(124,111,247,.38);background:rgba(124,111,247,.07);
  box-shadow:0 0 0 1px rgba(124,111,247,.12) inset,0 6px 20px rgba(124,111,247,.1);
}
.t-top{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:4px;}
.t-ico{font-size:18px;line-height:1;transition:transform .2s;}
.tbtn:hover .t-ico,.tbtn.on .t-ico{transform:scale(1.1);}
.t-chk{
  width:14px;height:14px;border-radius:50%;background:var(--v);
  display:flex;align-items:center;justify-content:center;
  opacity:0;transform:scale(.3);transition:all .22s cubic-bezier(.34,1.56,.64,1);
}
.tbtn.on .t-chk{opacity:1;transform:scale(1);}
.t-name{font-size:12px;font-weight:600;color:var(--t2);transition:color .18s;letter-spacing:-.01em;}
.tbtn.on .t-name{color:var(--t1);}
.t-desc{font-family:var(--mono);font-size:9.5px;color:var(--t3);line-height:1.45;transition:color .18s;}
.tbtn.on .t-desc{color:rgba(237,237,245,.3);}

/* Difficulty */
.drow{display:flex;gap:7px;}
.dbtn{
  flex:1;padding:12px 8px;border-radius:11px;border:1px solid var(--border);
  background:var(--lift);cursor:pointer;outline:none;
  display:flex;flex-direction:column;align-items:center;gap:8px;
  transition:all .2s;overflow:hidden;
}
.dbtn:hover{border-color:var(--border2);transform:translateY(-1px);}
.dbars{display:flex;align-items:flex-end;gap:3px;height:18px;}
.dbar{width:5px;border-radius:2px;background:var(--border2);transition:background .2s;}
.dlbl{font-family:var(--mono);font-size:9px;font-weight:500;letter-spacing:.12em;text-transform:uppercase;color:var(--t3);transition:color .2s;}

/* Language */
.limg {
  width: 28px;
  height: 28px;
  object-fit: contain;
  filter: grayscale(40%);
  transition: all 0.2s ease;
}

.lbtn.on .limg {
  filter: none;
  transform: scale(1.1);
}
.lgrid{display:grid;grid-template-columns:repeat(4,1fr);gap:7px;}
.lbtn{
  display:flex;flex-direction:column;align-items:center;gap:6px;
  padding:12px 6px;border-radius:11px;border:1px solid var(--border);
  background:var(--lift);cursor:pointer;outline:none;transition:all .2s;
}
.lbtn:hover{border-color:var(--border2);transform:translateY(-1px);}
.labr{
  font-family:var(--mono);font-size:11px;font-weight:700;
  width:34px;height:26px;border-radius:6px;
  display:flex;align-items:center;justify-content:center;letter-spacing:.02em;
  transition:all .2s;border:1px solid var(--border);
  background:rgba(255,255,255,.03);color:var(--t3);
}
.lname{font-family:var(--mono);font-size:9px;font-weight:500;letter-spacing:.1em;text-transform:uppercase;color:var(--t3);transition:color .2s;}
.lbtn.on .lname{color:var(--t2);}

/* CTA */
.cta-wrap{display:flex;flex-direction:column;gap:12px;}
.cta-btn{
  position:relative;width:100%;padding:16px 24px;border-radius:12px;
  border:1px solid rgba(124,111,247,.32);
  background:linear-gradient(135deg,#4d45d4 0%,#7c6ff7 55%,#22d3ee 150%);
  background-size:200% 100%;
  color:#fff;font-family:var(--mono);font-size:12px;font-weight:600;
  letter-spacing:.16em;text-transform:uppercase;cursor:pointer;outline:none;
  overflow:hidden;transition:transform .2s,box-shadow .2s,background-position .4s;
  box-shadow:0 4px 28px rgba(77,69,212,.38),0 1px 0 rgba(255,255,255,.1) inset;
}
.cta-btn::before{
  content:'';position:absolute;top:0;left:-80%;width:60%;height:100%;
  background:linear-gradient(90deg,transparent,rgba(255,255,255,.13),transparent);
  transform:skewX(-22deg);
}
.cta-btn:hover{transform:translateY(-2px);box-shadow:0 10px 40px rgba(77,69,212,.52),0 1px 0 rgba(255,255,255,.12) inset;background-position:100% 0;}
.cta-btn:hover::before{animation:sheen .55s ease forwards;}
@keyframes sheen{from{left:-80%;}to{left:140%;}}
.cta-btn:active{transform:translateY(0);}
.cta-in{display:flex;align-items:center;justify-content:center;gap:9px;position:relative;z-index:1;}
.cta-arr{transition:transform .2s;}
.cta-btn:hover .cta-arr{transform:translateX(4px);}
.cta-meta{
  display:flex;align-items:center;justify-content:center;gap:8px;
  font-family:var(--mono);font-size:9px;font-weight:400;
  letter-spacing:.09em;text-transform:uppercase;color:var(--t4);
}
.cta-sep{width:2px;height:2px;border-radius:50%;background:var(--t4);}
.cta-v{color:var(--t3);}
`;

export default function SessionSetup({ onStart }) {
  const { user } = useAuth();
  const [topic, setTopic] = useState(TOPICS?.[0]?.id || 'arrays');
  const [difficulty, setDifficulty] = useState('medium');
  const [language, setLanguage] = useState(LANGUAGES?.[0]?.id || 'javascript');

  const selTopic = TOPICS?.find(t => t.id === topic);
  const selDiff = DIFFICULTIES?.find(d => d.id === difficulty);
  const selLang = LANGUAGES?.find(l => l.id === language);

  return (
    <div className="pg">
      <style>{CSS}</style>

      {/* ══ LEFT HERO ══ */}
      <div className="lf">
        <div className="mesh" />
        <div className="gridlines" />




        <div className="nav">
          <div className="logo-box">
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <polyline points="4 17 10 11 4 5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              <line x1="12" y1="19" x2="20" y2="19" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </div>
          <span className="logo-name">SkillForge&nbsp;<em>AI</em></span>
          
          <div className="flex items-center gap-4 ml-auto">
            <Link 
              to="/dashboard"
              className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-violet-500/30 transition-all group"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-violet-400 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-black text-white/50 group-hover:text-white uppercase tracking-widest">Command Center</span>
            </Link>
            <div className="badge-live"><div className="ld" />Live</div>
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
            {[{ n: '100', s: ' +', l: 'Problems' }, null, { n: '4', s: ' x', l: 'Topics' }, null, { n: ' 3', s: '', l: 'Levels' }, null, { n: '∞', s: '', l: 'Sessions' }].map((x, i) =>
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