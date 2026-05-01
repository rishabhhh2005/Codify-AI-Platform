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
    totalQuestions: starter.questions?.length || 1,
  });

  return res.status(201).json({
    session,
    starterCode: starter.starterCode,
    questions: starter.questions,
  });
});

router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const { score, status, solvedCount, endedAt } = req.body;

  try {
    const session = await Session.findOne({ where: { id, userId: req.user.id } });
    if (!session) return res.status(404).json({ error: 'Session not found' });

    if (score !== undefined) session.score = score;
    if (status !== undefined) session.status = status;
    if (solvedCount !== undefined) session.solvedCount = solvedCount;
    if (endedAt !== undefined) session.endedAt = endedAt;

    await session.save();
    res.json({ session });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/mine', async (req, res) => {
  const sessions = await Session.findAll({
    where: { userId: req.user.id },
    order: [['createdAt', 'DESC']],
    limit: 20,
  });
  res.json({ sessions });
});

router.get('/stats', async (req, res) => {
  try {
    const sessions = await Session.findAll({
      where: { userId: req.user.id },
    });

    const totalInterviews = sessions.length;
    const solvedQuestions = sessions.reduce((sum, s) => sum + (s.solvedCount || 0), 0);
    const avgScore = sessions.length 
      ? Math.round(sessions.reduce((sum, s) => sum + (s.score || 0), 0) / sessions.length) 
      : 0;
    
    // Simple streak calculation
    const dates = sessions.map(s => s.createdAt.toISOString().split('T')[0]);
    const uniqueDates = [...new Set(dates)].sort().reverse();
    
    let streak = 0;
    if (uniqueDates.length > 0) {
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      
      if (uniqueDates[0] === today || uniqueDates[0] === yesterday) {
        streak = 1;
        for (let i = 0; i < uniqueDates.length - 1; i++) {
          const d1 = new Date(uniqueDates[i]);
          const d2 = new Date(uniqueDates[i+1]);
          const diff = (d1 - d2) / (1000 * 60 * 60 * 24);
          if (diff === 1) streak++;
          else break;
        }
      }
    }

    res.json({
      totalInterviews,
      solvedQuestions,
      accuracy: avgScore,
      streak
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
