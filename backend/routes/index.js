import express from 'express';
import homeRoutes from './homeRoutes.js';
import authRoutes from './authRoutes.js';
import sessionRoutes from './sessionRoutes.js';
import reviewRoutes from './reviewRoutes.js';
import codeRoutes from './codeRoutes.js';

const router = express.Router();

router.use('/home', homeRoutes);
router.use('/auth', authRoutes);
router.use('/session', sessionRoutes);
router.use('/review', reviewRoutes);
router.use('/code', codeRoutes);

export default router;
