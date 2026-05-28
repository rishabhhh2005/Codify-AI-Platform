import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import db from '../config/database.js';
import { requireAuth } from '../middleware/auth.js';
import { sendOTPEmail } from '../services/mailService.js';

const router = express.Router();
const { User } = db;

// Rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { error: 'Too many requests from this IP, please try again after 15 minutes' }
});

// Stricter limiter for OTP resend
const otpResendLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 1, // 1 request per minute
  message: { error: 'Please wait 60 seconds before requesting a new OTP' }
});

router.use(authLimiter);

function createToken(user) {
  return jwt.sign({ id: user.id, email: user.email, name: user.name }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'Name, email, and password are required' });

  const existing = await User.findOne({ where: { email } });
  if (existing) return res.status(409).json({ error: 'Email already exists' });

  const passwordHash = await bcrypt.hash(password, 10);
  const otp = generateOTP();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  const user = await User.create({ 
    name, 
    email, 
    passwordHash,
    otp,
    otpExpiry,
    isVerified: false
  });

  try {
    await sendOTPEmail(email, name, otp);
  } catch (err) {
    console.error('Failed to send registration OTP:', err);
    // Even if email fails, user is created. They can use resend.
  }

  return res.status(201).json({ 
    message: 'Registration successful. Please verify your email.',
    user: { id: user.id, name: user.name, email: user.email } 
  });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  
  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

  if (!user.isVerified) {
    return res.status(403).json({ 
      error: 'Account not verified. Please verify your email.',
      isUnverified: true,
      email: user.email
    });
  }

  return res.json({ token: createToken(user), user: { id: user.id, name: user.name, email: user.email } });
});

router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ error: 'Email and OTP are required' });

  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(404).json({ error: 'User not found' });

  if (user.isVerified) return res.status(400).json({ error: 'User is already verified' });

  if (user.otp !== otp) return res.status(400).json({ error: 'Invalid OTP' });

  if (new Date() > user.otpExpiry) return res.status(400).json({ error: 'OTP has expired' });

  user.isVerified = true;
  user.otp = null;
  user.otpExpiry = null;
  await user.save();

  return res.json({ 
    message: 'Email verified successfully',
    token: createToken(user),
    user: { id: user.id, name: user.name, email: user.email }
  });
});

router.post('/resend-otp', otpResendLimiter, async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(404).json({ error: 'User not found' });

  if (user.isVerified) return res.status(400).json({ error: 'User is already verified' });

  const otp = generateOTP();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

  user.otp = otp;
  user.otpExpiry = otpExpiry;
  await user.save();

  try {
    await sendOTPEmail(user.email, user.name, otp);
    return res.json({ message: 'New OTP sent successfully' });
  } catch (err) {
    console.error('Failed to resend OTP:', err);
    return res.status(500).json({ error: 'Failed to send OTP email' });
  }
});

router.get('/me', requireAuth, async (req, res) => {
  const user = await User.findByPk(req.user.id, { attributes: ['id', 'name', 'email', 'createdAt', 'isVerified'] });
  if (!user) return res.status(404).json({ error: 'User not found' });
  return res.json({ user });
});

export default router;
