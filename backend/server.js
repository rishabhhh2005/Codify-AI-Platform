import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

import db from './config/database.js';
import apiRoutes from './routes/index.js';

import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config();
dotenv.config({ path: path.join(__dirname, '../.env') });

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


if (!process.env.JWT_SECRET) {
  console.warn('JWT_SECRET is not set. Auth routes will fail until this is configured.');
}

db.sequelize
  .sync({ alter: false })
  .then(() => console.log('✓ Database synchronized'))
  .catch((err) => {
    console.error('✗ Database sync error:', err);
    process.exit(1);
  });

// Routes
app.use('/api', apiRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 API Home: GET http://localhost:${PORT}/api/home`);
  console.log(`🔐 Auth: POST http://localhost:${PORT}/api/auth/login`);
  console.log(`🏃 Code Runner: POST http://localhost:${PORT}/api/code/submit\n`);
});


// API TO CHECK HEALTH
// GET http://localhost:3000/api/health
