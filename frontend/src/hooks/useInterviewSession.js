import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { LANGUAGE_STARTERS } from '@/lib/constants';
import { useAuth } from '@/context/AuthContext';
import { buildBoilerplateForQuestion } from '@/lib/boilerplate';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const CHAT_URL = `${API_URL}/api/review/ai-chat`;
const TOTAL_TIME = 90 * 60;

// AI interviewer system prompt injected as first message per question
function buildSystemPrompt(question, language) {
  return `You are a senior FAANG technical interviewer conducting a live coding interview.

Problem: "${question?.title || 'Coding Problem'}"
Language: ${language || 'Python'}
${question?.problemStatement ? `\nProblem Statement:\n${question.problemStatement}` : ''}

Your rules:
- Guide the candidate with questions and hints — never write or reveal code solutions.
- Do not complete the candidate's code or provide working implementations.
- Ask clarifying questions to understand their approach before they code.
- Give hints that point toward the right direction without giving away the answer.
- Evaluate time/space complexity when they explain their approach.
- Be encouraging but honest. Point out edge cases they may have missed.
- Keep responses concise and conversational — this is a live interview, not a lecture.
- If the candidate asks you to write code, decline and instead ask them to try it themselves.`;
}

export function useInterviewSession() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [hintUsedForQuestion, setHintUsedForQuestion] = useState([]); // bool per question
  const [score, setScore] = useState(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [phase, setPhase] = useState('setup');
  const [hasRunCode, setHasRunCode] = useState(false);
  const timerRef = useRef(null);
  const sessionStartRef = useRef(null);

  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [codes, setCodes] = useState([]);
  const [allMessages, setAllMessages] = useState([]);
  const [submissionResults, setSubmissionResults] = useState([]);
  const [finalReport, setFinalReport] = useState(null);

  const currentQuestion = questions[currentQuestionIndex] || null;
  const code = codes[currentQuestionIndex] || '';
  // Exclude the system prompt from visible messages
  const messages = (allMessages[currentQuestionIndex] || []).filter(m => m.role !== 'system');
  const timeRemaining = Math.max(0, TOTAL_TIME - elapsedSeconds);

  const setCode = (val) => setCodes(prev => {
    const next = [...prev];
    next[currentQuestionIndex] = val;
    return next;
  });

  const setMessages = (action) => setAllMessages(prev => {
    const next = [...prev];
    next[currentQuestionIndex] = typeof action === 'function' ? action(next[currentQuestionIndex] || []) : action;
    return next;
  });

  const updateSubmissionResult = (index, res) => {
    setSubmissionResults(prev => {
      const next = [...prev];
      if (!next[index]?.isAccepted || res.isAccepted) next[index] = res;
      return next;
    });
  };

  useEffect(() => {
    if (phase === 'interview') {
      sessionStartRef.current = Date.now() - elapsedSeconds * 1000;
      timerRef.current = setInterval(() => {
        setElapsedSeconds(Math.floor((Date.now() - sessionStartRef.current) / 1000));
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        body: JSON.stringify({ topic, difficulty, language }),
      });
      if (!resp.ok) throw new Error('Failed to load questions');

      const data = await resp.json();
      const loadedQuestions = data.questions || [{
        id: 'q1', title: 'Problem 1', problemStatement: data.problemStatement, starterCode: data.starterCode,
      }];

      const newSession = data.session;
      setSession(newSession);
      if (newSession?.id) navigate(`/session/${newSession.id}`, { replace: true });

      setQuestions(loadedQuestions);
      setCurrentQuestionIndex(0);
      setCodes(loadedQuestions.map((q) => buildBoilerplateForQuestion(q, language) || q.starterCode || LANGUAGE_STARTERS[language]));
      // Seed each question's chat with a hidden system prompt
      setAllMessages(loadedQuestions.map((q) => [{ role: 'system', content: buildSystemPrompt(q, language) }]));
      setSubmissionResults(loadedQuestions.map(() => null));
      setHintUsedForQuestion(loadedQuestions.map(() => false));
    } catch (e) {
      setSession({ topic, language: 'python' });
      setQuestions([{ title: 'Error loading', problemStatement: 'Could not load questions.' }]);
      setCodes(['']);
      setAllMessages([[{ role: 'assistant', content: `Error: ${e.message}. Please restart.` }]]);
      setSubmissionResults([null]);
      setHintUsedForQuestion([false]);
    } finally {
      setIsLoading(false);
    }
  };

  const switchQuestion = (index) => {
    if (index >= 0 && index < questions.length) setCurrentQuestionIndex(index);
  };

  const sendMessage = async (userText) => {
    if (!userText || userText === '__START__') return;

    const userMsg = { role: 'user', content: userText };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    let assistantContent = '';

    try {
      // Include system prompt in API call but not in visible messages
      const fullHistory = allMessages[currentQuestionIndex] || [];
      const reqSession = { ...session, topic: currentQuestion?.title || session?.topic };

      const resp = await fetch(CHAT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          messages: [...fullHistory, userMsg],
          session: reqSession,
          code,
          action: 'chat',
        }),
      });
      if (!resp.ok) throw new Error('Failed to reach AI interviewer');

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
      setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${e.message}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  const requestHint = () => {
    // Only allow one hint per question
    if (hintUsedForQuestion[currentQuestionIndex]) return;
    setHintUsedForQuestion(prev => {
      const next = [...prev];
      next[currentQuestionIndex] = true;
      return next;
    });
    setHintsUsed(h => h + 1);
    sendMessage('Can you give me a hint for this problem without revealing the solution or any code?');
  };

  const submitCode = async () => {
    sendMessage(
      `I'm submitting my solution. Please evaluate it as a FAANG interviewer — correctness, time/space complexity, edge cases, and code quality. Give me a score from 0–100. Do not rewrite my code.`
    );
  };

  const endSession = async () => {
    if (isFinishing) return;
    setIsFinishing(true);
    clearInterval(timerRef.current);

    const solvedCount = submissionResults.filter((r) => r?.isAccepted).length;
    const totalQuestions = questions.length || 1;
    const solvedPercent = (solvedCount / totalQuestions) * 100;
    setPhase('results');

    // Per-question review with its own problem context
    const reviewPayloads = questions.map((question, index) => ({
      code: codes[index],
      language: session?.language,
      problemStatement: question?.problemStatement,
    })).filter((p) => p.code?.trim() && p.problemStatement);

    try {
      const reviews = await Promise.all(
        reviewPayloads.map(async (payload) => {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 15000);
          try {
            const resp = await fetch(`${API_URL}/api/review/code`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
              body: JSON.stringify(payload),
              signal: controller.signal,
            });
            clearTimeout(timeoutId);
            return resp.ok ? await resp.json() : null;
          } catch {
            return null;
          }
        })
      );

      const validReviews = reviews.filter(Boolean);
      const avgAiScore10 = validReviews.length
        ? validReviews.reduce((s, r) => s + (r.overallScore || 0), 0) / validReviews.length
        : 0;
      const finalScore = Math.round(solvedPercent * 0.7 + avgAiScore10 * 10 * 0.3);

      setScore(finalScore);
      setFinalReport({ solvedCount, totalQuestions, solvedPercent: Math.round(solvedPercent), aiAverageScore: Number(avgAiScore10.toFixed(1)), reviews: validReviews, finalScore });

      if (session?.id) {
        const questionsData = questions.map((q, idx) => ({
          title: q.title || `Question ${idx + 1}`,
          solved: submissionResults[idx]?.isAccepted || false,
          score: validReviews[idx]?.overallScore || null,
        }));
        const feedbackSummary = validReviews.length
          ? validReviews.map((r, i) => `Q${i + 1} (${questions[i]?.title || ''}): ${r.summary || 'No feedback'}`).join('\n\n')
          : 'AI review unavailable.';

        await fetch(`${API_URL}/api/session/${session.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ score: finalScore, status: 'completed', solvedCount, endedAt: new Date().toISOString(), questionsData, aiFeedback: feedbackSummary }),
        });
      }
    } catch (e) {
      console.error('endSession review error:', e);
      const fs = Math.round(solvedPercent);
      setScore(fs);
      setFinalReport({ solvedCount, totalQuestions, solvedPercent: Math.round(solvedPercent), aiAverageScore: 0, reviews: [], finalScore: fs });
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
    setHintUsedForQuestion([]);
    setScore(null);
    setElapsedSeconds(0);
    setHasRunCode(false);
    setFinalReport(null);
  };

  return {
    session, questions, currentQuestionIndex, currentQuestion, switchQuestion,
    messages, isLoading, code, setCode, hintsUsed, hintUsedForQuestion,
    score, elapsedSeconds, timeRemaining, phase,
    startSession, sendMessage, requestHint, submitCode, endSession, resetSession,
    hasRunCode, setHasRunCode, submissionResults, updateSubmissionResult, finalReport,
  };
}
