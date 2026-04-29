import express from 'express';
import db from '../config/database.js';
import { requireAuth } from '../middleware/auth.js';
import { generateReview, streamInterviewResponse } from '../services/aiService.js';

const router = express.Router();
const { Session } = db;

router.use(requireAuth);

router.post('/ai-chat', async (req, res) => {
  try {
    await streamInterviewResponse(req.body, res);
  } catch (error) {
    if (!res.headersSent) return res.status(500).json({ error: error.message || 'AI chat failed' });
    res.write(`data: ${JSON.stringify({ error: 'Stream interrupted' })}\n\n`);
    return res.end();
  }
});

router.post('/code', async (req, res) => {
  const { code, language, problemStatement, sessionId } = req.body;
  if (!code || !language || !problemStatement) {
    return res.status(400).json({ error: 'code, language, and problemStatement are required' });
  }
  const data = await generateReview({ code, language, problemStatement });
  if (sessionId) {
    await Session.update({ score: (data.overallScore || 0) * 10 }, { where: { id: sessionId, userId: req.user.id } });
  }
  return res.json(data);
});

export default router;
