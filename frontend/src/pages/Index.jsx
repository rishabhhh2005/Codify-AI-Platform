import React, { useState } from 'react';
import { useInterviewSession } from '@/hooks/useInterviewSession';
import { useAuth } from '@/context/AuthContext';

// Existing Components
import SessionSetup from '@/components/interview/SessionSetup';
import SessionDashboard from '@/components/interview/SessionDashboard';
import ResultsScreen from '@/components/interview/ResultsScreen';

// New Interview Components
import ContentPanel from '@/components/interview/ContentPanel';
import EditorPanel from '@/components/interview/EditorPanel';
import InterviewLayout from '@/components/interview/InterviewLayout';

const Index = () => {
  const { token } = useAuth();
  
  // UI State
  const [leftTab, setLeftTab] = useState('problem');

  // Business Logic Hook
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
    elapsedSeconds,
  } = useInterviewSession();



  // Phase Handling
  if (phase === 'setup') return <SessionSetup onStart={startSession} />;
  
  if (phase === 'results') {
    return (
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
  }

  const langLabel = session?.language || 'Python';
  const fileName = langLabel.toLowerCase() === 'python' ? 'solution.py' : 'Solution.java';

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#060608] relative">
      {/* Visual background layers */}
      <div className="ir-space-bg" />
      <div className="ir-dot-grid" />

      {/* Top Navigation Bar */}
      <header className="shrink-0 relative z-[100] bg-[#0a0a0e]/92 border-b border-white/[0.08] backdrop-blur-2xl">
        <div className="shimmer-top" />
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
          submissionResults={submissionResults}
        />
      </header>

      {/* Main Resizable Layout */}
      <InterviewLayout
        leftPanel={(
          <ContentPanel
            activeTab={leftTab}
            setActiveTab={setLeftTab}
            messages={messages}
            isLoading={isLoading}
            sendMessage={sendMessage}
            requestHint={requestHint}
            currentQuestion={currentQuestion}
          />
        )}
        rightPanel={(
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
      />

    </div>
  );
};

export default Index;
