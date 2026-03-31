import { useState, useEffect, useRef } from 'react';
import { LANGUAGE_STARTERS } from '@/lib/constants';

const CHAT_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/ai-interviewer`;
const TOTAL_TIME = 90 * 60; // 90 minutes for OA

export function useInterviewSession() {
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

  const updateSubmissionResult = (index, result) => {
    setSubmissionResults(prev => {
      const next = [...prev];
      next[index] = result;
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

    try {
      const resp = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/ai/starter-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, difficulty, language })
      });

      if (!resp.ok) {
        throw new Error('Failed to load questions');
      }

      const data = await resp.json();
      const loadedQuestions = data.questions || [{
        id: 'q1', title: 'Problem 1', problemStatement: data.problemStatement, starterCode: data.starterCode
      }];

      const newSession = {
        id: crypto.randomUUID(),
        topic,
        difficulty,
        language,
        startedAt: new Date().toISOString()
      };
      setSession(newSession);
      setQuestions(loadedQuestions);
      setCurrentQuestionIndex(0);
      setCodes(loadedQuestions.map(q => q.starterCode || LANGUAGE_STARTERS[language]));
      
      // Keep chat clear since problem statement is in the UI
      setAllMessages(loadedQuestions.map(() => []));
      setSubmissionResults(loadedQuestions.map(() => null));
    } catch (e) {
      setSession({ topic, language: 'javascript' });
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
        headers: { 'Content-Type': 'application/json' },
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

  const endSession = () => {
    clearInterval(timerRef.current);
    setPhase('results');
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
  };
}
