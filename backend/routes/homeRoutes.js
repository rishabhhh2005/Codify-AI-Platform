import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    name: 'Codify API',
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;
