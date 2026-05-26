import { Link } from 'react-router-dom';

const features = [
  {
    num: '01',
    title: 'AI Interviewer',
    desc: 'A Gemini-powered interviewer that adapts to your reasoning in real time — gives contextual hints and evaluates your solution like a senior FAANG engineer would.',
  },
  {
    num: '02',
    title: 'Live Code Execution',
    desc: 'Write Python or Java in a Monaco editor backed by a sandboxed E2B environment. Test results surface instantly with granular pass/fail breakdowns.',
  },
  {
    num: '03',
    title: 'Instant AI Review',
    desc: 'Every submission is scored across correctness, time & space complexity, edge case coverage, and overall code quality — no waiting, no ambiguity.',
  },
  {
    num: '04',
    title: 'Progress Tracking',
    desc: "Your sessions, accuracy trends, and streaks are logged and visualized over time. See exactly which problem types you've mastered — and which you haven't.",
  },
];

export default function Landing() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@400;500&family=Syne:wght@400;500;700;800&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --ink: #ffffff;
          --ink-dim: #ffffff;
          --ink-muted: #ffffff;
          --paper: #0c0b09;
          --surface: #131210;
          --line: rgba(232,228,220,0.08);
          --accent: #a35ec6;
          --accent-dim: rgba(200,184,135,0.15);
          --red: #c0392b;
        }

        html { scroll-behavior: smooth; }

        body {
          background: var(--paper);
          color: var(--ink);
          font-family: 'Syne', sans-serif;
          -webkit-font-smoothing: antialiased;
          overflow-x: hidden;
        }

        /* ─── NAV ─── */
        .nav {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 4rem;
          height: 64px;
          border-bottom: 1px solid var(--line);
          background: rgba(12,11,9,0.85);
          backdrop-filter: blur(20px);
        }

        .nav-logo {
          font-family: 'DM Serif Display', serif;
          font-size: 1.15rem;
          letter-spacing: 0.02em;
          color: var(--ink);
          text-decoration: none;
        }

        .nav-logo span {
          color: var(--accent);
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .nav-sign-in {
          padding: 0.45rem 1.1rem;
          font-family: 'Syne', sans-serif;
          font-size: 0.78rem;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--ink-dim);
          text-decoration: none;
          transition: color 0.2s;
        }
        .nav-sign-in:hover { color: var(--ink); }

        .nav-cta {
          padding: 0.5rem 1.4rem;
          font-family: 'Syne', sans-serif;
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--paper);
          background: var(--accent);
          text-decoration: none;
          transition: background 0.2s, transform 0.15s;
        }
        .nav-cta:hover { background: #d4c49a; }
        .nav-cta:active { transform: scale(0.97); }

        /* ─── HERO ─── */
        .hero {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
          border-bottom: 1px solid var(--line);
          overflow: hidden;
        }

        .hero-left {
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 0 5rem 5rem 4rem;
          border-right: 1px solid var(--line);
          animation: fadeUp 1s cubic-bezier(0.16,1,0.3,1) both;
        }

        .hero-eyebrow {
          font-family: 'DM Mono', monospace;
          font-size: 0.7rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--accent);
          margin-bottom: 2.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .hero-eyebrow::before {
          content: '';
          display: block;
          width: 3rem;
          height: 1px;
          background: var(--accent);
          flex-shrink: 0;
        }

        .hero-h1 {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(3.2rem, 5.5vw, 5.5rem);
          line-height: 1.02;
          letter-spacing: -0.01em;
          color: var(--ink);
          margin-bottom: 2.5rem;
        }

        .hero-h1 em {
          font-style: italic;
          color: var(--accent);
        }

        .hero-sub {
          font-size: 0.95rem;
          font-weight: 400;
          line-height: 1.75;
          color: var(--ink-dim);
          max-width: 36ch;
          margin-bottom: 3.5rem;
        }

        .hero-actions {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .btn-primary {
          display: inline-block;
          padding: 0.85rem 2.2rem;
          background: var(--accent);
          color: var(--paper);
          font-family: 'Syne', sans-serif;
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          text-decoration: none;
          transition: background 0.2s, transform 0.15s;
        }
        .btn-primary:hover { background: #d4c49a; }
        .btn-primary:active { transform: scale(0.97); }

        .btn-ghost {
          display: inline-block;
          padding: 0.85rem 2.2rem;
          border: 1px solid var(--line);
          color: var(--ink-dim);
          font-family: 'Syne', sans-serif;
          font-size: 0.78rem;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          text-decoration: none;
          transition: border-color 0.2s, color 0.2s;
        }
        .btn-ghost:hover { border-color: rgba(232,228,220,0.25); color: var(--ink); }

        /* ─── HERO RIGHT ─── */
        .hero-right {
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 0 4rem 5rem 5rem;
          gap: 3rem;
          animation: fadeUp 1s 0.15s cubic-bezier(0.16,1,0.3,1) both;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0;
          border: 1px solid var(--line);
        }

        .stat-cell {
          padding: 2rem 1.75rem;
          border-right: 1px solid var(--line);
          border-bottom: 1px solid var(--line);
        }
        .stat-cell:nth-child(2n) { border-right: none; }
        .stat-cell:nth-child(3), .stat-cell:nth-child(4) { border-bottom: none; }

        .stat-val {
          font-family: 'DM Serif Display', serif;
          font-size: 2.4rem;
          color: var(--ink);
          line-height: 1;
          margin-bottom: 0.5rem;
        }

        .stat-label {
          font-family: 'DM Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--ink-dim);
        }

        .hero-note {
          font-family: 'DM Mono', monospace;
          font-size: 0.7rem;
          color: var(--ink-muted);
          letter-spacing: 0.04em;
          line-height: 1.6;
          padding-left: 1rem;
          border-left: 1px solid var(--ink-muted);
        }

        /* ─── FEATURES ─── */
        .features {
          padding: 8rem 4rem;
        }

        .section-header {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: end;
          margin-bottom: 5rem;
          padding-bottom: 3rem;
          border-bottom: 1px solid var(--line);
        }

        .section-label {
          font-family: 'DM Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--accent);
          margin-bottom: 1.5rem;
        }

        .section-h2 {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(2.2rem, 3.5vw, 3.5rem);
          line-height: 1.08;
          color: var(--ink);
        }

        .section-desc {
          font-size: 0.9rem;
          line-height: 1.8;
          color: var(--ink-dim);
          max-width: 42ch;
          align-self: end;
        }

        .features-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0;
          border-top: 1px solid var(--line);
          border-left: 1px solid var(--line);
        }

        .feature-card {
          padding: 3rem;
          border-right: 1px solid var(--line);
          border-bottom: 1px solid var(--line);
          transition: background 0.3s;
          position: relative;
          overflow: hidden;
        }
        .feature-card::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 1px;
          background: var(--accent);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.4s cubic-bezier(0.16,1,0.3,1);
        }
        .feature-card:hover { background: rgba(200,184,135,0.04); }
        .feature-card:hover::after { transform: scaleX(1); }

        .feature-num {
          font-family: 'DM Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.15em;
          color: var(--ink-muted);
          margin-bottom: 2.5rem;
        }

        .feature-title {
          font-family: 'DM Serif Display', serif;
          font-size: 1.4rem;
          color: var(--ink);
          margin-bottom: 1rem;
          line-height: 1.2;
        }

        .feature-desc {
          font-size: 0.875rem;
          line-height: 1.8;
          color: var(--ink-dim);
        }

        /* ─── HOW IT WORKS ─── */
        .how {
          padding: 8rem 4rem;
          background: var(--surface);
          border-top: 1px solid var(--line);
          border-bottom: 1px solid var(--line);
        }

        .how-inner {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 8rem;
          align-items: start;
        }

        .how-sticky {
          position: sticky;
          top: 8rem;
        }

        .how-steps {
          display: flex;
          flex-direction: column;
          gap: 0;
          border-top: 1px solid var(--line);
        }

        .how-step {
          display: grid;
          grid-template-columns: 4rem 1fr;
          gap: 2rem;
          align-items: start;
          padding: 3rem 0;
          border-bottom: 1px solid var(--line);
          transition: background 0.3s;
        }
        .how-step:hover { padding-left: 1rem; transition: padding 0.3s, background 0.3s; }

        .step-num {
          font-family: 'DM Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.15em;
          color: var(--accent);
          padding-top: 0.2rem;
        }

        .step-title {
          font-family: 'DM Serif Display', serif;
          font-size: 1.2rem;
          color: var(--ink);
          margin-bottom: 0.75rem;
        }

        .step-desc {
          font-size: 0.875rem;
          line-height: 1.8;
          color: var(--ink-dim);
        }

        /* ─── CTA ─── */
        .cta {
          padding: 10rem 4rem;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6rem;
          align-items: center;
          border-bottom: 1px solid var(--line);
        }

        .cta-h2 {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(2.8rem, 4.5vw, 4.5rem);
          line-height: 1.04;
          color: var(--ink);
        }

        .cta-h2 em {
          font-style: italic;
          color: var(--accent);
        }

        .cta-right {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .cta-sub {
          font-size: 0.95rem;
          line-height: 1.75;
          color: var(--ink-dim);
        }

        .cta-actions {
          display: flex;
          gap: 1.25rem;
        }

        /* ─── FOOTER ─── */
        .footer {
          padding: 2.5rem 4rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .footer-brand {
          font-family: 'DM Serif Display', serif;
          font-size: 0.9rem;
          color: var(--ink-dim);
        }

        .footer-copy {
          font-family: 'DM Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.1em;
          color: var(--ink-muted);
          text-transform: uppercase;
        }

        /* ─── ANIMATIONS ─── */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(32px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-in {
          animation: fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) both;
        }

        .delay-1 { animation-delay: 0.1s; }
        .delay-2 { animation-delay: 0.2s; }
        .delay-3 { animation-delay: 0.3s; }
        .delay-4 { animation-delay: 0.4s; }

        /* ─── RESPONSIVE ─── */
        @media (max-width: 900px) {
          .nav { padding: 0 1.5rem; }
          .hero { grid-template-columns: 1fr; min-height: auto; padding-top: 64px; }
          .hero-left { padding: 4rem 1.5rem 3rem; border-right: none; border-bottom: 1px solid var(--line); }
          .hero-right { padding: 3rem 1.5rem 4rem; }
          .section-header { grid-template-columns: 1fr; gap: 1.5rem; }
          .features { padding: 5rem 1.5rem; }
          .features-grid { grid-template-columns: 1fr; }
          .how { padding: 5rem 1.5rem; }
          .how-inner { grid-template-columns: 1fr; gap: 3rem; }
          .how-sticky { position: static; }
          .cta { grid-template-columns: 1fr; padding: 6rem 1.5rem; gap: 3rem; }
          .footer { padding: 2rem 1.5rem; flex-direction: column; gap: 1rem; text-align: center; }
          .stats-grid { grid-template-columns: 1fr 1fr; }
        }
      `}</style>

      <div style={{ background: 'var(--paper)', minHeight: '100vh' }}>

        {/* Nav */}
        <nav className="nav">
          <a href="/" className="nav-logo">Codify <span>AI</span></a>
          <div className="nav-links">
            <Link to="/signin" className="nav-sign-in">Sign In</Link>
            <Link to="/signup" className="nav-cta">Get Started</Link>
          </div>
        </nav>

        {/* Hero */}
        <section className="hero" style={{ paddingTop: '64px' }}>
          <div className="hero-left">
            <p className="hero-eyebrow">AI-Powered Interview Platform</p>
            <h1 className="hero-h1">
              Ace your next<br />
              <em>coding interview</em>
            </h1>
            <p className="hero-sub">
              Practice with a real AI interviewer, run your code live,
              and receive FAANG-level feedback after every session.
              Built for engineers who want to progress with precision.
            </p>
            <div className="hero-actions">
              <Link to="/signup" className="btn-primary">Start Practicing Free</Link>
              <Link to="/signin" className="btn-ghost">Sign In</Link>
            </div>
          </div>

          <div className="hero-right">
            <div className="stats-grid">
              <div className="stat-cell">
                <div className="stat-val">90</div>
                <div className="stat-label">Min sessions</div>
              </div>
              <div className="stat-cell">
                <div className="stat-val">2</div>
                <div className="stat-label">Languages</div>
              </div>
              <div className="stat-cell">
                <div className="stat-val">∞</div>
                <div className="stat-label">Practice rounds</div>
              </div>
              <div className="stat-cell">
                <div className="stat-val">AI</div>
                <div className="stat-label">Live review</div>
              </div>
            </div>
            <p className="hero-note">
              Python & Java supported. Sandboxed execution via E2B.<br />
              Powered by Gemini. No setup required.
            </p>
          </div>
        </section>

        {/* Features */}
        <section className="features">
          <div className="section-header">
            <div>
              <p className="section-label">Platform Capabilities</p>
              <h2 className="section-h2">
                Everything you need<br />to get hired
              </h2>
            </div>
            <p className="section-desc">
              A complete interview preparation platform — not just a code editor.
              Every component is designed around the real conditions of technical hiring.
            </p>
          </div>

          <div className="features-grid">
            {features.map(({ num, title, desc }) => (
              <div key={num} className="feature-card">
                <p className="feature-num">{num}</p>
                <h3 className="feature-title">{title}</h3>
                <p className="feature-desc">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="how">
          <div className="how-inner">
            <div className="how-sticky">
              <p className="section-label">Process</p>
              <h2 className="section-h2" style={{ fontSize: 'clamp(2rem, 2.5vw, 2.8rem)' }}>
                How it<br />works
              </h2>
            </div>

            <div className="how-steps">
              {[
                {
                  step: '01',
                  title: 'Choose your challenge',
                  desc: 'Select a topic, difficulty level, and programming language. Codify generates a genuine interview-style problem tailored to your preferences.',
                },
                {
                  step: '02',
                  title: 'Code with AI guidance',
                  desc: 'Write your solution in the Monaco editor. The AI interviewer engages conversationally — clarify requirements, request hints, or walk through your approach out loud.',
                },
                {
                  step: '03',
                  title: 'Submit, run & get scored',
                  desc: 'Execute all test cases and receive a detailed review: correctness score, complexity analysis, edge case breakdown, and specific suggestions for improvement.',
                },
              ].map(({ step, title, desc }) => (
                <div key={step} className="how-step">
                  <span className="step-num">{step}</span>
                  <div>
                    <h3 className="step-title">{title}</h3>
                    <p className="step-desc">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="cta">
          <h2 className="cta-h2">
            Ready to<br />
            <em>start practicing?</em>
          </h2>
          <div className="cta-right">
            <p className="cta-sub">
              Join engineers who prepare smarter.
              No credit card, no setup — just open a session and code.
            </p>
            <div className="cta-actions">
              <Link to="/signup" className="btn-primary">Create Free Account</Link>
              <Link to="/signin" className="btn-ghost">Sign In</Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="footer">
          <span className="footer-brand">Codify AI</span>
          <span className="footer-copy">Made by Rishabh Puri · {new Date().getFullYear()}</span>
        </footer>

      </div>
    </>
  );
}