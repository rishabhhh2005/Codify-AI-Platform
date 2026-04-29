import { useInterviewSession } from '@/hooks/useInterviewSession';
import SessionSetup from '@/components/SessionSetup';
import SessionDashboard from '@/components/SessionDashboard';
import ChatPanel from '@/components/ChatPanel';
import CodeEditor from '@/components/CodeEditor';
import ResultsScreen from '@/components/ResultsScreen';
import AIMascot from '@/components/AIMascot';
import ReviewPanel from '@/components/ReviewPanel';
import ProblemPanel from '@/components/ProblemPanel';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';

const interviewStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Geist+Mono:wght@300;400;500;600;700&family=Geist:wght@300;400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg-void:      #060608;
    --bg-base:      #0a0a0e;
    --bg-surface:   #0f0f14;
    --bg-elevated:  #141419;
    --bg-overlay:   #1a1a22;

    --border-dim:   rgba(255,255,255,0.04);
    --border-mid:   rgba(255,255,255,0.08);
    --border-hi:    rgba(255,255,255,0.14);

    --text-primary: #f0f0f5;
    --text-secondary: rgba(240,240,245,0.55);
    --text-muted:   rgba(240,240,245,0.28);
    --text-ghost:   rgba(240,240,245,0.14);

    --accent-violet: #7c6ff7;
    --accent-violet-glow: rgba(124,111,247,0.18);
    --accent-violet-dim: rgba(124,111,247,0.08);

    --accent-cyan:  #22d3ee;
    --accent-cyan-glow: rgba(34,211,238,0.15);
    --accent-cyan-dim: rgba(34,211,238,0.06);

    --accent-emerald: #10b981;
    --accent-emerald-glow: rgba(16,185,129,0.15);

    --accent-amber: #f59e0b;
    --accent-red:   #ef4444;

    --radius-sm: 6px;
    --radius-md: 10px;
    --radius-lg: 16px;

    --font-mono: 'Geist Mono', 'JetBrains Mono', monospace;
    --font-sans: 'Geist', system-ui, sans-serif;
  }

  html, body, #root {
    height: 100%;
    background: var(--bg-void);
    color: var(--text-primary);
    font-family: var(--font-sans);
    -webkit-font-smoothing: antialiased;
  }

  /* ─── Root Layout ─── */
  .ir-root {
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow: hidden;
    background: var(--bg-void);
    position: relative;
  }

  /* Deep space background — layered noise + vignette */
  .ir-root::before {
    content: '';
    position: fixed;
    inset: 0;
    background:
      radial-gradient(ellipse 80% 50% at 20% 0%, rgba(124,111,247,0.07) 0%, transparent 60%),
      radial-gradient(ellipse 60% 40% at 80% 100%, rgba(34,211,238,0.05) 0%, transparent 55%),
      radial-gradient(ellipse 100% 100% at 50% 50%, transparent 40%, rgba(0,0,0,0.6) 100%);
    pointer-events: none;
    z-index: 0;
  }

  /* Subtle dot-grid */
  .ir-root::after {
    content: '';
    position: fixed;
    inset: 0;
    background-image: radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px);
    background-size: 28px 28px;
    pointer-events: none;
    z-index: 0;
  }

  /* ─── Top Bar ─── */
  .ir-topbar {
    flex-shrink: 0;
    position: relative;
    z-index: 100;
    background: rgba(10,10,14,0.92);
    border-bottom: 1px solid var(--border-mid);
    backdrop-filter: blur(20px) saturate(1.4);
    -webkit-backdrop-filter: blur(20px) saturate(1.4);
  }

  /* Animated shimmer line at top */
  .ir-topbar::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg,
      transparent 0%,
      var(--accent-violet) 30%,
      var(--accent-cyan) 70%,
      transparent 100%
    );
    opacity: 0.5;
    animation: shimmer-bar 4s ease-in-out infinite alternate;
  }

  @keyframes shimmer-bar {
    from { opacity: 0.3; transform: scaleX(0.95); }
    to   { opacity: 0.65; transform: scaleX(1); }
  }

  /* ─── Split Pane ─── */
  .ir-split {
    flex: 1;
    display: flex;
    min-height: 0;
    overflow: hidden;
    position: relative;
    z-index: 1;
  }

  /* ─── Left Pane ─── */
  .ir-left {
    height: 100%;
    display: flex;
    flex-direction: column;
    background: var(--bg-surface);
    position: relative;
    overflow: hidden;
  }


  /* ─── Tab Bar ─── */
  .ir-tabbar {
    display: flex;
    align-items: center;
    gap: 2px;
    padding: 0 12px;
    height: 42px;
    background: rgba(0,0,0,0.25);
    border-bottom: 1px solid var(--border-dim);
    flex-shrink: 0;
    position: relative;
  }

  .ir-tab {
    display: flex;
    align-items: center;
    gap: 7px;
    padding: 6px 14px;
    border-radius: var(--radius-sm);
    font-family: var(--font-mono);
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.18s ease;
    border: 1px solid transparent;
    background: transparent;
    color: var(--text-muted);
    outline: none;
    position: relative;
    white-space: nowrap;
  }

  .ir-tab:hover {
    color: var(--text-secondary);
    background: rgba(255,255,255,0.03);
  }

  .ir-tab.active {
    color: var(--accent-violet);
    background: var(--accent-violet-dim);
    border-color: rgba(124,111,247,0.2);
  }

  .ir-tab.active::after {
    content: '';
    position: absolute;
    bottom: -7px; left: 14px; right: 14px;
    height: 1px;
    background: var(--accent-violet);
    opacity: 0.7;
    border-radius: 1px;
  }

  .ir-tab-badge {
    width: 5px; height: 5px;
    border-radius: 50%;
    background: var(--accent-violet);
    animation: pulse-badge 2s ease-in-out infinite;
  }

  @keyframes pulse-badge {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(0.7); }
  }

  /* Live indicator */
  .ir-live {
    margin-left: auto;
    display: flex;
    align-items: center;
    gap: 6px;
    font-family: var(--font-mono);
    font-size: 9px;
    font-weight: 600;
    letter-spacing: 0.12em;
    color: var(--accent-emerald);
    opacity: 0.85;
    text-transform: uppercase;
  }

  .ir-live-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: var(--accent-emerald);
    box-shadow: 0 0 6px var(--accent-emerald);
    animation: live-pulse 2.4s ease-in-out infinite;
  }

  @keyframes live-pulse {
    0%, 100% { opacity: 1; box-shadow: 0 0 6px var(--accent-emerald); }
    50% { opacity: 0.5; box-shadow: 0 0 2px var(--accent-emerald); }
  }

  /* ─── Pane Content Wrapper ─── */
  .ir-pane-content {
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  /* ─── Right Pane (Editor) ─── */
  .ir-right {
    height: 100%;
    min-width: 0;
    display: flex;
    flex-direction: column;
    background: var(--bg-base);
    position: relative;
  }

  .ir-editor-header {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 0 16px;
    height: 42px;
    background: rgba(0,0,0,0.3);
    border-bottom: 1px solid var(--border-dim);
    flex-shrink: 0;
    position: relative;
  }

  .ir-editor-header::before {
    content: '';
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg,
      transparent 0%,
      var(--accent-cyan) 50%,
      transparent 100%
    );
    opacity: 0.25;
  }

  .ir-lang-badge {
    display: flex;
    align-items: center;
    gap: 7px;
    font-family: var(--font-mono);
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--accent-cyan);
    opacity: 0.85;
  }

  .ir-lang-dot {
    width: 7px; height: 7px;
    border-radius: 50%;
    background: var(--accent-cyan);
    box-shadow: 0 0 8px var(--accent-cyan-glow);
  }

  .ir-editor-divider {
    height: 14px;
    width: 1px;
    background: var(--border-mid);
    margin: 0 4px;
  }

  .ir-file-label {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--text-muted);
    letter-spacing: 0.02em;
  }

  /* Window chrome dots */
  .ir-chrome-dots {
    margin-left: auto;
    display: flex;
    gap: 5px;
    align-items: center;
  }

  .ir-chrome-dot {
    width: 10px; height: 10px;
    border-radius: 50%;
    opacity: 0.35;
    transition: opacity 0.2s;
  }

  .ir-chrome-dot:hover { opacity: 0.65; }
  .ir-chrome-dot.red    { background: #ff5f57; }
  .ir-chrome-dot.yellow { background: #febc2e; }
  .ir-chrome-dot.green  { background: #28c840; }

  .ir-resize-handle-v {
    position: relative;
    width: 8px;
    background: var(--bg-void);
    z-index: 50;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: col-resize;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 -4px; /* Pull panes together to overlap handle area */
  }

  .ir-resize-handle-v::before {
    content: '';
    position: absolute;
    top: 0; bottom: 0;
    left: 50%;
    width: 1px;
    background: var(--border-mid);
    transform: translateX(-50%);
    transition: background 0.2s;
  }

  .ir-resize-handle-v:hover::before {
    background: var(--accent-violet);
    width: 2px;
    box-shadow: 0 0 10px var(--accent-violet-glow);
  }

  .ir-resize-handle-v:hover .ir-resize-pip {
    opacity: 1;
    background: var(--accent-violet);
    height: 60px;
  }

  .ir-resize-pip {
    width: 2px;
    height: 24px;
    border-radius: 2px;
    background: var(--border-hi);
    opacity: 0.4;
    transition: all 0.2s ease;
  }


  /* ─── Scan line effect on editor pane ─── */
  .ir-scanlines {
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(0,0,0,0.04) 2px,
      rgba(0,0,0,0.04) 4px
    );
    pointer-events: none;
    z-index: 0;
    opacity: 0.6;
  }

  /* ─── Entry animation ─── */
  @keyframes ir-enter {
    from { opacity: 0; transform: translateY(6px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .ir-left, .ir-right {
    animation: ir-enter 0.4s ease both;
  }

  .ir-right { animation-delay: 0.07s; }

  /* ─── Scrollbar ─── */
  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--border-hi); border-radius: 2px; }
  ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
`;

import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';

const Index = () => {
  const { token } = useAuth();
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [reviewData, setReviewData] = useState(null);
  const [isReviewLoading, setIsReviewLoading] = useState(false);
  const [leftTab, setLeftTab] = useState('problem');

  const {
    session,
    questions,
    currentQuestionIndex,
    currentQuestion,
    switchQuestion,
    messages,
    isLoading,
    code,
    setCode,
    hintsUsed,
    score,
    elapsedSeconds,
    timeRemaining,
    phase,
    startSession,
    sendMessage,
    requestHint,
    submitCode,
    endSession,
    resetSession,
    hasRunCode,
    setHasRunCode,
    submissionResults,
    updateSubmissionResult,
    finalReport,
  } = useInterviewSession();

  const handleReview = async () => {
    setIsReviewOpen(true);
    setIsReviewLoading(true);
    try {
      const resp = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/review/code`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            code,
            language: session?.language,
            problemStatement: currentQuestion?.problemStatement || session?.problemStatement,
            sessionId: session?.id,
          }),
        }
      );
      if (!resp.ok) throw new Error('Failed to get review');
      const data = await resp.json();
      setReviewData(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsReviewLoading(false);
    }
  };

  if (phase === 'setup') return <SessionSetup onStart={startSession} />;
  if (phase === 'results') return (
    <ResultsScreen
      session={session}
      messages={messages}
      elapsedSeconds={elapsedSeconds}
      hintsUsed={hintsUsed}
      onReset={resetSession}
      submissionResults={submissionResults}
      questions={questions}
      finalReport={finalReport}
    />
  );

  const langLabel = session?.language || 'JavaScript';
  const fileName = langLabel === 'Python' ? 'solution.py'
    : langLabel === 'Java' ? 'Solution.java'
      : langLabel === 'C++' ? 'solution.cpp'
        : 'solution.js';

  return (
    <div className="ir-root">
      <style>{interviewStyles}</style>

      {/* ── Top Bar ── */}
      <div className="ir-topbar">
        <SessionDashboard
          session={session}
          questions={questions}
          currentQuestionIndex={currentQuestionIndex}
          switchQuestion={switchQuestion}
          timeRemaining={timeRemaining}
          hintsUsed={hintsUsed}
          score={score}
          onSubmit={submitCode}
          onHint={requestHint}
          onEnd={endSession}
          isLoading={isLoading}
          hasRunCode={hasRunCode}
          onReview={handleReview}
          submissionResults={submissionResults}
        />
      </div>

      {/* ── Split Pane ── */}
      <div className="ir-split">
        <PanelGroup direction="horizontal">
          {/* Left Pane */}
          <Panel defaultSize={44} minSize={30}>
            <div className="ir-left h-full w-full">
              {/* Tab Bar */}
              <div className="ir-tabbar">
                <button
                  className={`ir-tab ${leftTab === 'problem' ? 'active' : ''}`}
                  onClick={() => setLeftTab('problem')}
                >
                  <svg width="11" height="11" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M10 1a1 1 0 0 1 1 1v1h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-1v1a1 1 0 0 1-2 0V8H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h1V2a1 1 0 0 1 1-1zM4 7a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-1h1a1 1 0 0 0 0-2h-1V9a2 2 0 0 0-2-2H4z" />
                  </svg>
                  Problem
                </button>

                <button
                  className={`ir-tab ${leftTab === 'chat' ? 'active' : ''}`}
                  onClick={() => setLeftTab('chat')}
                >
                  <svg width="11" height="11" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4.414L1 15.414V4a2 2 0 0 1 1-1.732V2z" />
                  </svg>
                  AI Interviewer
                  {leftTab !== 'chat' && messages.length > 0 && (
                    <span className="ir-tab-badge" />
                  )}
                </button>

                <div className="ir-live">
                  <div className="ir-live-dot" />
                  Live
                </div>
              </div>

              {/* Problem Tab */}
              <div
                className="ir-pane-content"
                style={{ display: leftTab === 'problem' ? 'flex' : 'none' }}
              >
                <ProblemPanel question={currentQuestion} />
              </div>

              {/* Chat Tab */}
              <div
                className="ir-pane-content"
                style={{ display: leftTab === 'chat' ? 'flex' : 'none' }}
              >
                <ChatPanel
                  messages={messages}
                  isLoading={isLoading}
                  onSend={sendMessage}
                  onHint={requestHint}
                />
              </div>
            </div>
          </Panel>

          <PanelResizeHandle className="ir-resize-handle-v">
            <div className="ir-resize-pip" />
          </PanelResizeHandle>

          {/* Right Pane — Editor */}
          <Panel defaultSize={56} minSize={30}>
            <div className="ir-right h-full">
              <div className="ir-scanlines" />

              <div className="ir-editor-header">
                <div className="ir-lang-badge">
                  <div className="ir-lang-dot" />
                  {langLabel}
                </div>
                <div className="ir-editor-divider" />
                <span className="ir-file-label">{fileName}</span>

                <div className="ir-chrome-dots">
                  <div className="ir-chrome-dot red" />
                  <div className="ir-chrome-dot yellow" />
                  <div className="ir-chrome-dot green" />
                </div>
              </div>

              <div style={{ flex: 1, minHeight: 0, position: 'relative', zIndex: 1 }}>
                <CodeEditor
                  code={code}
                  onChange={(val) => setCode(val || '')}
                  language={session?.language || 'javascript'}
                  hasRunCode={hasRunCode}
                  setHasRunCode={setHasRunCode}
                  question={currentQuestion}
                  onSubmissionResult={(res) => updateSubmissionResult(currentQuestionIndex, res)}
                />
              </div>
            </div>
          </Panel>
        </PanelGroup>
      </div>

      <AIMascot phase={phase} />
      <ReviewPanel
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        review={reviewData}
        isLoading={isReviewLoading}
      />
    </div>
  );
};

export default Index;
