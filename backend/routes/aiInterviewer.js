import express from 'express';
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();
const router = express.Router();

// --- Data Loading ---
const questionsPath = path.join(process.cwd(), 'backend', 'data', 'questions.json');
let SEEDED_QUESTIONS = [];
try {
  if (fs.existsSync(questionsPath)) {
    SEEDED_QUESTIONS = JSON.parse(fs.readFileSync(questionsPath, 'utf8'));
  }
} catch (err) {
  console.error('Failed to load seeded questions:', err);
}

const TOPIC_CONTEXT = {
  arrays: "Arrays & Strings problems (two pointers, sliding window, hashing, sorting)",
  dynamic_programming: "Dynamic Programming (memoization, tabulation, state transitions, optimization)",
  trees_graphs: "Trees & Graphs (BFS, DFS, topological sort, shortest path, cycle detection)",
  system_design: "System Design (architecture, scalability, databases, caching, load balancing, trade-offs)",
};

// --- Helper Functions ---
function buildSystemPrompt(session, selectedQuestion = null) {
  const topic = TOPIC_CONTEXT[session.topic] || session.topic;
  const { difficulty: diff, language: lang } = session;

  let questionInfo = "";
  if (selectedQuestion) {
    questionInfo = `
CRITICAL: You MUST conduct the interview for THIS SPECIFIC PROBLEM:
Title: ${selectedQuestion.title}
Statement: ${selectedQuestion.statement}
Constraints: ${selectedQuestion.constraints?.join(', ') || 'N/A'}
Examples: ${JSON.stringify(selectedQuestion.examples || [])}
${selectedQuestion.explanation ? `Explanation for you: ${selectedQuestion.explanation}` : ''}
`;
  }

  return `You are an experienced FAANG software engineer conducting a real technical coding interview.
ROLE: Senior engineer at a top tech company. Professional, precise, and thorough.

SESSION CONTEXT:
- Topic: ${topic}
- Difficulty: ${diff}
- Language: ${lang}
${questionInfo}

YOUR BEHAVIOR:
1. OPENING: Present the problem statement, constraints, and examples precisely.
2. FOLLOW-UPS: Ask clarifying questions about edge cases and complexity.
3. HINTS: Directional guidance only. Never give full solutions.
4. CODE EVALUATION: Format as "Score: X/100" when code is submitted.
5. CONVERSATION: Maintain full context. Use markdown.`;
}

// --- Route Handler ---
router.post('/', async (req, res) => {
  const { messages = [], session, action } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(400).json({ error: 'GEMINI_API_KEY is not configured' });
  }

  try {
    // 1. Pick a question if starting a new session
    let selectedQuestion = null;
    if (action === 'start') {
      const pool = SEEDED_QUESTIONS.filter(q =>
        q.topic === session.topic && (q.difficulty === session.difficulty || !session.difficulty)
      );
      const finalPool = pool.length > 0 ? pool : SEEDED_QUESTIONS.filter(q => q.topic === session.topic) || SEEDED_QUESTIONS;
      selectedQuestion = finalPool[Math.floor(Math.random() * finalPool.length)];
    }

    // 2. Initialize Gemini
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-3.1-flash-lite-preview",
      systemInstruction: buildSystemPrompt(session, selectedQuestion)
    });

    // 3. Prepare Chat History (Gemini format: role is 'user' or 'model')
    let chatHistory = messages
      .filter(m => m.role !== 'system')
      .map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));

    if (chatHistory.length > 0 && chatHistory[0].role === 'model') {
      chatHistory.unshift({
        role: 'user',
        parts: [{ text: 'Please begin the interview.' }]
      });
    }

    const chat = model.startChat({
      history: action === 'start' ? [] : chatHistory.slice(0, -1),
    });

    const userContent = action === 'start'
      ? `Please begin the interview by presenting the problem: "${selectedQuestion?.title || 'a coding problem'}".`
      : messages[messages.length - 1]?.content || "Please continue.";

    // 4. Stream Response
    const streamResult = await chat.sendMessageStream(userContent);

    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    });

    for await (const chunk of streamResult.stream) {
      const chunkText = chunk.text();
      const sseData = {
        choices: [{ delta: { content: chunkText } }]
      };
      res.write(`data: ${JSON.stringify(sseData)}\n\n`);
    }

    res.write('data: [DONE]\n\n');
    res.end();

  } catch (error) {
    console.error('AI Interviewer error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: error.message || 'AI service error' });
    } else {
      res.write(`data: ${JSON.stringify({ error: "Stream interrupted" })}\n\n`);
      res.end();
    }
  }
});

export default router;