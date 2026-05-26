import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@/context/SessionContext';

import ContentPanel from '@/components/interview/ContentPanel';
import EditorPanel from '@/components/interview/EditorPanel';
import InterviewLayout from '@/components/interview/InterviewLayout';
import SessionDashboard from '@/components/interview/SessionDashboard';
import ResultsScreen from '@/components/interview/ResultsScreen';

// ── Leave confirmation modal ──────────────────────────────────────────────────
function LeaveModal({ onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center bg-black/80 backdrop-blur-sm px-6">
      <div className="bg-black border border-white/10 w-full max-w-sm p-8">
        <p className="text-violet-400 tracking-[0.3em] uppercase text-xs mb-4">Warning</p>
        <h2 className="font-serif text-2xl text-white mb-3">Leave session?</h2>
        <p className="text-neutral-500 text-sm leading-7 mb-8">
          Your current session progress will be lost. This cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 h-11 border border-white/10 text-neutral-400 hover:text-white text-xs uppercase tracking-widest font-mono transition"
          >
            Stay
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 h-11 bg-rose-500 hover:bg-rose-400 text-white text-xs uppercase tracking-widest font-mono transition"
          >
            Leave
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Session() {
  const navigate = useNavigate();
  const [leftTab, setLeftTab] = useState('problem');
  // mobile: 'problem' | 'chat' | 'editor'
  const [mobileTab, setMobileTab] = useState('problem');
  const [leaveTarget, setLeaveTarget] = useState(null); // path to navigate after confirm

  const {
    session, questions, currentQuestionIndex, currentQuestion, switchQuestion,
    messages, isLoading, code, setCode, hintsUsed, hintUsedForQuestion,
    score, timeRemaining, phase, sendMessage, requestHint, submitCode,
    endSession, resetSession, hasRunCode, setHasRunCode,
    submissionResults, updateSubmissionResult, finalReport, elapsedSeconds,
  } = useSession();

  // Redirect if no session
  useEffect(() => {
    if (phase === 'setup') navigate('/home', { replace: true });
  }, [phase, navigate]);

  // Browser unload warning
  useEffect(() => {
    if (phase !== 'interview') return;
    const handler = (e) => { e.preventDefault(); e.returnValue = ''; };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [phase]);

  // Auto-switch to chat when AI responds (new assistant message)
  useEffect(() => {
    if (messages.length > 0 && messages[messages.length - 1]?.role === 'assistant') {
      setLeftTab('chat');
      setMobileTab('chat');
    }
  }, [messages.length]);

  const handleHint = () => {
    setLeftTab('chat');
    setMobileTab('chat');
    requestHint();
  };

  const confirmAndNavigate = (path) => {
    if (phase === 'interview') {
      setLeaveTarget(path);
    } else {
      navigate(path);
    }
  };

  if (phase === 'results') {
    return (
      <ResultsScreen
        session={session}
        messages={messages}
        elapsedSeconds={elapsedSeconds}
        hintsUsed={hintsUsed}
        onReset={() => { resetSession(); navigate('/home'); }}
        submissionResults={submissionResults}
        questions={questions}
        finalReport={finalReport}
      />
    );
  }

  if (!session) return null;

  const langLabel = session?.language || 'Python';
  const fileName = langLabel.toLowerCase() === 'python' ? 'solution.py' : 'Solution.java';
  const hintUsed = hintUsedForQuestion?.[currentQuestionIndex] ?? false;

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-black">
      {/* Leave modal */}
      {leaveTarget && (
        <LeaveModal
          onConfirm={() => navigate(leaveTarget)}
          onCancel={() => setLeaveTarget(null)}
        />
      )}

      <header className="shrink-0 relative z-[100]">
        <SessionDashboard
          session={session}
          questions={questions}
          currentQuestionIndex={currentQuestionIndex}
          switchQuestion={switchQuestion}
          timeRemaining={timeRemaining}
          hintsUsed={hintsUsed}
          score={score}
          onSubmit={submitCode}
          onHint={handleHint}
          hintUsed={hintUsed}
          onEnd={endSession}
          onNavigateDashboard={() => confirmAndNavigate('/dashboard')}
          isLoading={isLoading}
          hasRunCode={hasRunCode}
          submissionResults={submissionResults}
        />
      </header>

      {/* ── DESKTOP layout ── */}
      <div className="hidden md:flex flex-1 min-h-0">
        <InterviewLayout
          leftPanel={
            <ContentPanel
              activeTab={leftTab}
              setActiveTab={setLeftTab}
              messages={messages}
              isLoading={isLoading}
              sendMessage={sendMessage}
              requestHint={handleHint}
              currentQuestion={currentQuestion}
            />
          }
          rightPanel={
            <EditorPanel
              code={code}
              setCode={setCode}
              language={session?.language}
              langLabel={langLabel}
              fileName={fileName}
              hasRunCode={hasRunCode}
              setHasRunCode={setHasRunCode}
              currentQuestion={currentQuestion}
              currentQuestionIndex={currentQuestionIndex}
              updateSubmissionResult={updateSubmissionResult}
            />
          }
        />
      </div>

      {/* ── MOBILE layout ── */}
      <div className="flex md:hidden flex-col flex-1 min-h-0">
        {/* Mobile tab bar */}
        <div className="flex border-b border-white/10 bg-black shrink-0">
          {[
            { id: 'problem', label: 'Problem' },
            { id: 'chat', label: 'AI Chat' },
            { id: 'editor', label: 'Editor' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setMobileTab(t.id)}
              className={`flex-1 py-3 text-xs font-mono uppercase tracking-widest border-b-2 transition-colors ${
                mobileTab === t.id
                  ? 'border-violet-400 text-white'
                  : 'border-transparent text-neutral-600 hover:text-neutral-400'
              }`}
            >
              {t.label}
              {t.id === 'chat' && messages.length > 0 && (
                <span className="ml-1.5 w-1.5 h-1.5 rounded-full bg-violet-400 inline-block align-middle" />
              )}
            </button>
          ))}
        </div>

        {/* Mobile panels */}
        <div className="flex-1 min-h-0 overflow-hidden">
          {mobileTab === 'problem' && (
            <ContentPanel
              activeTab="problem"
              setActiveTab={() => {}}
              messages={messages}
              isLoading={isLoading}
              sendMessage={sendMessage}
              requestHint={handleHint}
              currentQuestion={currentQuestion}
            />
          )}
          {mobileTab === 'chat' && (
            <ContentPanel
              activeTab="chat"
              setActiveTab={() => {}}
              messages={messages}
              isLoading={isLoading}
              sendMessage={sendMessage}
              requestHint={handleHint}
              currentQuestion={currentQuestion}
            />
          )}
          {mobileTab === 'editor' && (
            <EditorPanel
              code={code}
              setCode={setCode}
              language={session?.language}
              langLabel={langLabel}
              fileName={fileName}
              hasRunCode={hasRunCode}
              setHasRunCode={setHasRunCode}
              currentQuestion={currentQuestion}
              currentQuestionIndex={currentQuestionIndex}
              updateSubmissionResult={updateSubmissionResult}
            />
          )}
        </div>
      </div>
    </div>
  );
}
