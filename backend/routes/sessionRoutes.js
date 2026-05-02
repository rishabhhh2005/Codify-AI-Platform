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
  const { score, status, solvedCount, endedAt, questionsData, aiFeedback } = req.body;

  try {
    const session = await Session.findOne({ where: { id, userId: req.user.id } });
    if (!session) return res.status(404).json({ error: 'Session not found' });

    if (score !== undefined) session.score = score;
    if (status !== undefined) session.status = status;
    if (solvedCount !== undefined) session.solvedCount = solvedCount;
    if (endedAt !== undefined) session.endedAt = endedAt;
    if (questionsData !== undefined) session.questionsData = questionsData;
    if (aiFeedback !== undefined) session.aiFeedback = aiFeedback;

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

// Get a single session's detailed history
router.get('/:id/history', async (req, res) => {
  try {
    const session = await Session.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });
    if (!session) return res.status(404).json({ error: 'Session not found' });

    res.json({
      id: session.id,
      topic: session.topic,
      difficulty: session.difficulty,
      language: session.language,
      score: session.score,
      solvedCount: session.solvedCount,
      totalQuestions: session.totalQuestions,
      status: session.status,
      hintsUsed: session.hintsUsed,
      startedAt: session.startedAt,
      endedAt: session.endedAt,
      createdAt: session.createdAt,
      questionsData: session.questionsData,
      aiFeedback: session.aiFeedback,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/stats', async (req, res) => {
  try {
    const sessions = await Session.findAll({
      where: { userId: req.user.id },
    });

    const totalInterviews = sessions.length;
    const solvedQuestions = sessions.reduce((sum, s) => sum + (s.solvedCount || 0), 0);
    const totalQuestions = sessions.reduce((sum, s) => sum + (s.totalQuestions || 1), 0);
    const accuracy = totalQuestions > 0
      ? Math.round((solvedQuestions / totalQuestions) * 100)
      : 0;
    
    // Streak: breaks if user missed a calendar day
    // We check consecutive days backwards from today
    const dates = sessions.map(s => {
      const d = new Date(s.createdAt);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    });
    const uniqueDates = [...new Set(dates)].sort().reverse();
    
    let streak = 0;
    if (uniqueDates.length > 0) {
      const now = new Date();
      const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
      
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;
      
      // Streak only counts if user practiced today or yesterday
      if (uniqueDates[0] === todayStr || uniqueDates[0] === yesterdayStr) {
        streak = 1;
        for (let i = 0; i < uniqueDates.length - 1; i++) {
          const current = new Date(uniqueDates[i] + 'T00:00:00');
          const next = new Date(uniqueDates[i + 1] + 'T00:00:00');
          const diffDays = Math.round((current - next) / (1000 * 60 * 60 * 24));
          if (diffDays === 1) {
            streak++;
          } else {
            break; // Gap found, streak breaks
          }
        }
      }
      // If most recent session is older than yesterday, streak = 0 (broken)
    }

    res.json({
      totalInterviews,
      solvedQuestions,
      accuracy,
      streak
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
