import React, { useState } from 'react';
import { useInterviewSession } from '@/hooks/useInterviewSession';
import { useAuth } from '@/context/AuthContext';

// Existing Components
import SessionSetup from '@/components/interview/SessionSetup';
import SessionDashboard from '@/components/interview/SessionDashboard';
import ResultsScreen from '@/components/interview/ResultsScreen';
import ReviewPanel from '@/components/interview/ReviewPanel';

// New Interview Components
import ContentPanel from '@/components/interview/ContentPanel';
import EditorPanel from '@/components/interview/EditorPanel';
import InterviewLayout from '@/components/interview/InterviewLayout';

const Index = () => {
  const { token } = useAuth();
  
  // UI State
  const [leftTab, setLeftTab] = useState('problem');
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [reviewData, setReviewData] = useState(null);
  const [isReviewLoading, setIsReviewLoading] = useState(false);

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

  // Handlers
  const handleReview = async () => {
    setIsReviewOpen(true);
    setIsReviewLoading(true);
    try {
      const resp = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/review/code`,
        {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json', 
            Authorization: `Bearer ${token}` 
          },
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
      console.error('Code review failed:', e);
    } finally {
      setIsReviewLoading(false);
    }
  };

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
  const fileName = langLabel === 'Python' ? 'solution.py' : 'Solution.java';

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
          onReview={handleReview}
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

      {/* Code Review Overlay */}
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
