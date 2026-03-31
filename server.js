import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

import db from './backend/config/database.js';
import aiInterviewerRoutes from './backend/routes/aiInterviewer.js';
import aiRoutes from './backend/routes/aiRoutes.js';
import codeRoutes from './backend/routes/codeRoutes.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));


// auth disabled for assessment
// app.use('/api/auth', authRoutes);

// Database sync
db.sequelize.sync({ alter: false }).then(() => {
  console.log('✓ Database synchronized');
}).catch(err => {
  console.error('✗ Database sync error:', err);
  process.exit(1);
});

// Routes
app.use('/api/ai-interviewer', aiInterviewerRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/code', codeRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

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
  console.log(`📝 AI Interviewer: POST http://localhost:${PORT}/api/ai-interviewer`);
  console.log(`🏃 Code Runner: POST http://localhost:${PORT}/api/code/submit\n`);
});
