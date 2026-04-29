import express from 'express';
import db from '../config/database.js';
import { requireAuth } from '../middleware/auth.js';
import { getStarterPack } from '../services/aiService.js';

const router = express.Router();
const { Session } = db;

router.use(requireAuth);

router.post('/start', async (req, res) => {
  const { topic, difficulty, language } = req.body;
  if (!topic || !difficulty || !language) {
    return res.status(400).json({ error: 'topic, difficulty, and language are required' });
  }

  const starter = getStarterPack({ topic, difficulty, language });
  const session = await Session.create({
    userId: req.user.id,
    topic,
    difficulty,
    language,
    status: 'active',
    problemStatement: starter.questions[0]?.problemStatement || null,
  });

  return res.status(201).json({
    session,
    starterCode: starter.starterCode,
    questions: starter.questions,
  });
});

router.get('/mine', async (req, res) => {
  const sessions = await Session.findAll({
    where: { userId: req.user.id },
    order: [['createdAt', 'DESC']],
    limit: 20,
  });
  res.json({ sessions });
});

export default router;
