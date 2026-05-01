import { useState, useEffect, useRef } from 'react';
import { LANGUAGE_STARTERS } from '@/lib/constants';
import { useAuth } from '@/context/AuthContext';
import { buildBoilerplateForQuestion } from '@/lib/boilerplate';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const CHAT_URL = `${API_URL}/api/review/ai-chat`;
const TOTAL_TIME = 90 * 60; // 90 minutes for OA

export function useInterviewSession() {
  const { token } = useAuth();
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [score, setScore] = useState(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [phase, setPhase] = useState('setup'); // setup | interview | results
  const [hasRunCode, setHasRunCode] = useState(false);
  const timerRef = useRef(null);
  const sessionStartRef = useRef(null);

  // OA States
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [codes, setCodes] = useState([]);
  const [allMessages, setAllMessages] = useState([]);
  const [submissionResults, setSubmissionResults] = useState([]);
  const [finalReport, setFinalReport] = useState(null);

  // Derived state for current question
  const currentQuestion = questions[currentQuestionIndex] || null;
  const code = codes[currentQuestionIndex] || '';
  const messages = allMessages[currentQuestionIndex] || [];
  const timeRemaining = Math.max(0, TOTAL_TIME - elapsedSeconds);

  // Helpers to update current question's state
  const setCode = (val) => setCodes(prev => {
    const next = [...prev];
    next[currentQuestionIndex] = val;
    return next;
  });

  const setMessages = (action) => setAllMessages(prev => {
    const next = [...prev];
    next[currentQuestionIndex] = typeof action === 'function' ? action(next[currentQuestionIndex]) : action;
    return next;
  });

  const updateSubmissionResult = (index, res) => {
    setSubmissionResults(prev => {
      const next = [...prev];
      const current = next[index];
      // Keep as accepted if it was already solved, unless the new one is also accepted (to update stats)
      if (!current?.isAccepted || res.isAccepted) {
        next[index] = res;
      }
      return next;
    });
  };

  // Timer
  useEffect(() => {
    if (phase === 'interview') {
      sessionStartRef.current = Date.now() - elapsedSeconds * 1000;
      timerRef.current = setInterval(() => {
        setElapsedSeconds(Math.floor((Date.now() - sessionStartRef.current) / 1000));
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [phase]);

  const startSession = async ({ topic, difficulty, language }) => {
    setIsLoading(true);
    setPhase('interview');
    setHintsUsed(0);
    setScore(null);
    setElapsedSeconds(0);
    setHasRunCode(false);
    setFinalReport(null);

    try {
      const resp = await fetch(`${API_URL}/api/session/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ topic, difficulty, language })
      });

      if (!resp.ok) {
        throw new Error('Failed to load questions');
      }

      const data = await resp.json();
      const loadedQuestions = data.questions || [{
        id: 'q1', title: 'Problem 1', problemStatement: data.problemStatement, starterCode: data.starterCode
      }];

      const newSession = data.session;
      setSession(newSession);
      setQuestions(loadedQuestions);
      setCurrentQuestionIndex(0);
      setCodes(
        loadedQuestions.map((q) => buildBoilerplateForQuestion(q, language) || q.starterCode || LANGUAGE_STARTERS[language])
      );
      
      // Keep chat clear since problem statement is in the UI
      setAllMessages(loadedQuestions.map(() => []));
      setSubmissionResults(loadedQuestions.map(() => null));
    } catch (e) {
      setSession({ topic, language: 'python' });
      setQuestions([{ title: 'Error loading', problemStatement: 'Could not load questions.' }]);
      setCodes(['']);
      setAllMessages([[{ role: 'assistant', content: `⚠️ Error: ${e.message}. Please restart.` }]]);
      setSubmissionResults([null]);
    } finally {
      setIsLoading(false);
    }
  };

  const switchQuestion = (index) => {
    if (index >= 0 && index < questions.length) {
      setCurrentQuestionIndex(index);
    }
  };

  const sendMessage = async (userText) => {
    if (!userText || userText === '__START__') return;
    
    const userMsg = { role: 'user', content: userText };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);
    
    let assistantContent = '';

    try {
      const reqSession = { ...session, topic: currentQuestion?.title || session.topic };
      const resp = await fetch(CHAT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          session: reqSession,
          code,
          action: 'chat',
        }),
      });

      if (!resp.ok) {
        throw new Error('Failed to reach AI interviewer');
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = '';
      let streamDone = false;

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex;
        while ((newlineIndex = textBuffer.indexOf('\n')) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);
          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (line.startsWith(':') || line.trim() === '') continue;
          if (!line.startsWith('data: ')) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') { streamDone = true; break; }
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantContent += content;
              setMessages(prev => {
                const last = prev[prev.length - 1];
                if (last?.role === 'assistant') {
                  return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantContent } : m);
                }
                return [...prev, { role: 'assistant', content: assistantContent }];
              });
            }
          } catch {
            textBuffer = line + '\n' + textBuffer;
            break;
          }
        }
      }
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', content: `⚠️ ${e.message}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  const requestHint = () => {
    setHintsUsed(h => h + 1);
    sendMessage('Can you give me a hint without revealing the solution?');
  };

  const submitCode = async () => {
    sendMessage(
      `I'm submitting my solution. Here is my code:\n\`\`\`\n${code}\n\`\`\`\nPlease evaluate it as a FAANG interviewer would — correctness, time/space complexity, edge cases, and code quality. Then give me a score from 0–100.`
    );
  };

  const [isFinishing, setIsFinishing] = useState(false);

  const endSession = async () => {
    if (isFinishing) return;
    setIsFinishing(true);
    
    clearInterval(timerRef.current);
    const solvedCount = submissionResults.filter((res) => res?.isAccepted).length;
    const totalQuestions = questions.length || 1;
    const solvedPercent = (solvedCount / totalQuestions) * 100;

    // Transition to results screen immediately with basic data
    setPhase('results');

    const reviewPayloads = questions
      .map((question, index) => ({
        code: codes[index],
        language: session?.language,
        problemStatement: question?.problemStatement,
      }))
      .filter((item) => item.code && item.code.trim().length > 0 && item.problemStatement);

    try {
      const reviews = await Promise.all(
        reviewPayloads.map(async (payload) => {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout
          
          try {
            const resp = await fetch(`${API_URL}/api/review/code`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
              body: JSON.stringify(payload),
              signal: controller.signal,
            });
            clearTimeout(timeoutId);
            if (!resp.ok) return null;
            return await resp.json();
          } catch (err) {
            console.error("Single review error:", err);
            return null;
          }
        })
      );

      const validReviews = reviews.filter(Boolean);
      const avgAiScore10 = validReviews.length
        ? validReviews.reduce((sum, item) => sum + (item.overallScore || 0), 0) / validReviews.length
        : 0;
      
      const finalScore = Math.round((solvedPercent * 0.7) + (avgAiScore10 * 10 * 0.3));
      setScore(finalScore);
      setFinalReport({
        solvedCount,
        totalQuestions,
        solvedPercent: Math.round(solvedPercent),
        aiAverageScore: Number(avgAiScore10.toFixed(1)),
        reviews: validReviews,
        finalScore,
      });

      // Update session on server
      if (session?.id) {
        await fetch(`${API_URL}/api/session/${session.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            score: finalScore,
            status: 'completed',
            solvedCount: solvedCount,
            endedAt: new Date().toISOString(),
          }),
        });
      }
    } catch (e) {
      console.error("Error during final review:", e);
      // Even if AI review fails, we have the solvedCount
      setScore(Math.round(solvedPercent));
      setFinalReport({
        solvedCount,
        totalQuestions,
        solvedPercent: Math.round(solvedPercent),
        aiAverageScore: 0,
        reviews: [],
        finalScore: Math.round(solvedPercent),
      });
    } finally {
      setIsFinishing(false);
    }
  };

  const resetSession = () => {
    clearInterval(timerRef.current);
    setPhase('setup');
    setSession(null);
    setQuestions([]);
    setCodes([]);
    setAllMessages([]);
    setSubmissionResults([]);
    setCurrentQuestionIndex(0);
    setHintsUsed(0);
    setScore(null);
    setElapsedSeconds(0);
    setHasRunCode(false);
    setFinalReport(null);
  };

  return {
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
  };
}
