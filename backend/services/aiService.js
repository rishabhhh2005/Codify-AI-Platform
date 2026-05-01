import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenerativeAI } from '@google/generative-ai';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const questionsPath = path.resolve(__dirname, '../data/questions.json');
const MODEL_NAME = 'gemini-1.5-flash';

const LANGUAGE_STARTERS = {
  javascript: 'function solution() {\n  // Write your code here\n}\n',
  python: 'class Solution:\n    def solve(self):\n        # Write your python code here\n        pass\n',
  java: 'public class Solution {\n    public void solve() {\n        // Write your java code here\n    }\n}\n',
  cpp: '#include <iostream>\n#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    void solve() {\n        // Write your C++ code here\n    }\n};\n',
};

const TOPIC_CONTEXT = {
  arrays: 'Arrays & Strings problems (two pointers, sliding window, hashing, sorting)',
  dynamic_programming: 'Dynamic Programming (memoization, tabulation, state transitions, optimization)',
  trees_graphs: 'Trees & Graphs (BFS, DFS, topological sort, shortest path, cycle detection)',
  system_design: 'System Design (architecture, scalability, databases, caching, load balancing, trade-offs)',
};

function getModel(systemInstruction) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured');
  }
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  return genAI.getGenerativeModel({ model: MODEL_NAME, systemInstruction });
}

export function loadQuestions() {
  try {
    if (!fs.existsSync(questionsPath)) return [];
    return JSON.parse(fs.readFileSync(questionsPath, 'utf8'));
  } catch (error) {
    console.error('Failed to load questions:', error);
    return [];
  }
}

function formatProblemMarkdown(q) {
  return `# ${q.title}\n\n**Difficulty:** ${q.difficulty}\n\n${q.statement}\n\n` +
    (q.examples?.length ? `### Examples\n${q.examples.map((ex, i) => `**Example ${i + 1}:**\n\`\`\`\nInput: ${ex.input}\nOutput: ${ex.output}\n${ex.explanation ? `Explanation: ${ex.explanation}` : ''}\n\`\`\`\n`).join('\n')}` : '') +
    (q.constraints?.length ? `### Constraints\n- ${q.constraints.join('\n- ')}` : '');
}

export function getStarterPack({ topic, difficulty, language }) {
  const questions = loadQuestions();
  const reqDiff = difficulty?.toLowerCase().replace('-', ' ') || '';
  let pool = questions.filter((q) => q.topic === topic && (!reqDiff || q.difficulty.toLowerCase() === reqDiff));
  if (pool.length < 3 && reqDiff) pool = questions.filter((q) => q.difficulty.toLowerCase() === reqDiff);
  const usePool = pool.length >= 3 ? pool : questions;
  const selected = [...usePool].sort(() => 0.5 - Math.random()).slice(0, 3);
  const starterCode = LANGUAGE_STARTERS[language?.toLowerCase()] || '// Write your code here';
  return {
    starterCode,
    questions: selected.map((q) => ({ ...q, problemStatement: formatProblemMarkdown(q), starterCode })),
  };
}

export async function generateReview({ code, language, problemStatement }) {
  const prompt = `You are a senior FAANG engineer reviewing a candidate's code.
Problem: ${problemStatement}
Language: ${language}
Code submitted:
${code}

Return ONLY a JSON object with these exact keys:
{
  "overallScore": number (1-10),
  "timeComplexity": string,
  "spaceComplexity": string,
  "correctness": { "score": number, "feedback": string },
  "codeQuality": { "score": number, "feedback": string },
  "bestPractices": { "score": number, "feedback": string },
  "suggestions": string[],
  "summary": string
}`;
  const model = getModel();
  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: { responseMimeType: 'application/json' },
  });
  const response = await result.response;
  return JSON.parse(response.text());
}

function buildSystemPrompt(session, selectedQuestion = null) {
  const topic = TOPIC_CONTEXT[session.topic] || session.topic;
  const questionInfo = selectedQuestion
    ? `CRITICAL: You MUST conduct the interview for THIS SPECIFIC PROBLEM:
Title: ${selectedQuestion.title}
Statement: ${selectedQuestion.statement}
Constraints: ${selectedQuestion.constraints?.join(', ') || 'N/A'}
Examples: ${JSON.stringify(selectedQuestion.examples || [])}`
    : '';

  return `You are an experienced FAANG software engineer conducting a technical coding interview.
SESSION CONTEXT:
- Topic: ${topic}
- Difficulty: ${session.difficulty}
- Language: ${session.language}
${questionInfo}
Rules:
1. Ask concise interview-style follow-up questions.
2. Give hints but never full solution code.
3. If candidate asks for evaluation, provide score with reasoning.`;
}

export async function streamInterviewResponse({ messages = [], session, action }, res) {
  const questions = loadQuestions();
  let selectedQuestion = null;
  if (action === 'start') {
    const pool = questions.filter((q) => q.topic === session.topic);
    selectedQuestion = (pool.length ? pool : questions)[Math.floor(Math.random() * Math.max(pool.length, 1))];
  }

  const model = getModel(buildSystemPrompt(session, selectedQuestion));
  const chatHistory = messages
    .filter((m) => m.role !== 'system')
    .map((m) => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }] }));

  const chat = model.startChat({ history: action === 'start' ? [] : chatHistory.slice(0, -1) });
  const userContent = action === 'start'
    ? `Begin interview for: ${selectedQuestion?.title || 'coding problem'}.`
    : messages[messages.length - 1]?.content || 'Continue.';

  const streamResult = await chat.sendMessageStream(userContent);
  res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive' });
  for await (const chunk of streamResult.stream) {
    res.write(`data: ${JSON.stringify({ choices: [{ delta: { content: chunk.text() } }] })}\n\n`);
  }
  res.write('data: [DONE]\n\n');
  res.end();
}
