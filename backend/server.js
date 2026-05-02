import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import db from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import sessionRoutes from './routes/sessionRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import codeRoutes from './routes/codeRoutes.js';

// Fix __dirname for ES modules
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load env
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 3000;

/* =======================
   MIDDLEWARE
======================= */
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

/* =======================
   ROUTES
======================= */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api', (req, res) => {
  res.json({
    name: 'Codify API',
    version: '1.0.0',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/session', sessionRoutes);
app.use('/api/review', reviewRoutes);
app.use('/api/code', codeRoutes);

/* =======================
   404 HANDLER
======================= */
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

/* =======================
   GLOBAL ERROR HANDLER
======================= */
app.use((err, req, res, next) => {
  console.error('[ERROR]', err);

  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
});

/* =======================
   SERVER START
======================= */
const startServer = async () => {
  try {
    // ⚠️ Safe DB sync strategy
    if (process.env.NODE_ENV === 'development') {
      await db.sequelize.sync({ alter: true });
      console.log('[DB] Synced with alter (dev)');
    } else {
      await db.sequelize.authenticate();
      console.log('[DB] Connected (prod)');
    }

    app.listen(PORT, () => {
      console.log(`\n[Codify] Server running on http://localhost:${PORT}`);
      console.log(`[Health] GET /api/health`);
      console.log(`[Auth]   POST /api/auth/login`);
      console.log(`[Code]   POST /api/code/submit\n`);
    });

  } catch (err) {
    console.error('[FATAL] Failed to start server:', err);
    process.exit(1);
  }
};

startServer();