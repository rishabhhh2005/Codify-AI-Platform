import express from "express";
import rateLimit from "express-rate-limit";
import { generateJSON } from "../services/geminiService.js";
import db from "../config/database.js";

const router = express.Router();
const { Session } = db;

// Rate limit: 20 req/min
const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20,
  message: { error: "Too many AI requests, please try again later." },
});

import fs from "fs";
import path from "path";

// Load seeded questions
const questionsPath = path.join(process.cwd(), 'backend', 'data', 'questions.json');
let SEEDED_QUESTIONS = [];
try {
  if (fs.existsSync(questionsPath)) {
    SEEDED_QUESTIONS = JSON.parse(fs.readFileSync(questionsPath, 'utf8'));
  }
} catch (err) {
  console.error('Failed to load seeded questions:', err);
}

const LANGUAGE_STARTERS = {
  javascript: 'function solution() {\n  // Write your code here\n}\n',
  python: 'class Solution:\n    def solve(self):\n        # Write your python code here\n        pass\n',
  java: 'public class Solution {\n    public void solve() {\n        // Write your java code here\n    }\n}\n',
  cpp: '#include <iostream>\n#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    void solve() {\n        // Write your C++ code here\n    }\n};\n',
};

function formatProblemMarkdown(q) {
  return `# ${q.title}\n\n**Difficulty:** ${q.difficulty}\n\n${q.statement}\n\n` +
    (q.examples && q.examples.length ? `### Examples\n${q.examples.map((ex, i) => `**Example ${i + 1}:**\n\`\`\`\nInput: ${ex.input}\nOutput: ${ex.output}\n${ex.explanation ? `Explanation: ${ex.explanation}` : ''}\n\`\`\`\n`).join('\n')}` : '') +
    (q.constraints && q.constraints.length ? `### Constraints\n- ${q.constraints.join('\n- ')}` : '');
}

// Feature 2: Generate starter code
router.post("/starter-code", aiLimiter, async (req, res) => {
  const { topic, difficulty, language, sessionId } = req.body;

  if (!topic || !difficulty || !language) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Dynamically load questions to pick up new additions during development without restart
    let currentQuestions = SEEDED_QUESTIONS;
    try {
      if (fs.existsSync(questionsPath)) {
        currentQuestions = JSON.parse(fs.readFileSync(questionsPath, 'utf8'));
      }
    } catch (err) {
      console.error('Failed to reload seeded questions:', err);
    }

    const reqDiff = difficulty ? difficulty.toLowerCase().replace('-', ' ') : '';
    let pool = currentQuestions.filter(q =>
      q.topic === topic && (!reqDiff || q.difficulty.toLowerCase() === reqDiff)
    );

    // If we don't have enough questions matching both, prioritize difficulty over topic
    if (pool.length < 3 && reqDiff) {
      pool = currentQuestions.filter(q => q.difficulty.toLowerCase() === reqDiff);
    }

    // Fallback if there are STILL less than 3 questions of this difficulty (e.g. empty database)
    const usePool = pool.length >= 3 ? pool : currentQuestions;

    const shuffled = [...usePool].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 3);

    const starterCode = LANGUAGE_STARTERS[language.toLowerCase()] || '// Write your code here';

    const questions = selected.map(q => ({
      ...q,
      problemStatement: formatProblemMarkdown(q),
      starterCode: starterCode
    }));

    const data = {
      problemStatement: questions[0].problemStatement, // fallback for legacy
      starterCode: starterCode,
      questions: questions
    };

    if (sessionId) {
      await Session.update(
        { problemStatement: data.problemStatement, status: 'active' },
        { where: { id: sessionId } }
      );
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to generate starter code" });
  }
});

// Feature 5: AI Review (placeholder - implemented later)
router.post("/review", aiLimiter, async (req, res) => {
  const { code, language, problemStatement, sessionId } = req.body;

  if (!code || !language || !problemStatement) {
    return res.status(400).json({ error: "Missing required fields" });
  }

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

  try {
    const data = await generateJSON(prompt);

    // Save overallScore to sessions if sessionId is provided
    if (sessionId) {
      await Session.update(
        { score: data.overallScore * 10 }, // Assuming DB score 0-100
        { where: { id: sessionId } }
      );
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to generate AI review" });
  }
});

export default router;
