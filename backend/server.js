import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import db from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import sessionRoutes from './routes/sessionRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import codeRoutes from './routes/codeRoutes.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config();
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Database Sync
db.sequelize
  .sync({ alter: true })
  .then(() => console.log('[OK] Database synchronized'))
  .catch((err) => {
    console.error('[ERR] Database sync error:', err);
    process.exit(1);
  });

// Health Check & Root
app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));
app.get('/api', (req, res) => res.json({ name: 'Codify API', version: '1.0.0' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/session', sessionRoutes);
app.use('/api/review', reviewRoutes);
app.use('/api/code', codeRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Global Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`\n[Codify] Server running on http://localhost:${PORT}`);
  console.log(`[API] Health: GET http://localhost:${PORT}/api/health`);
  console.log(`[Auth] POST http://localhost:${PORT}/api/auth/login`);
  console.log(`[Code] Runner: POST http://localhost:${PORT}/api/code/submit\n`);
});

