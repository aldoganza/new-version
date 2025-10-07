import { Router } from 'express';
import { pool } from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { authRequired } from '../middleware/auth.js';

const router = Router();

router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) return res.status(400).json({ error: 'Missing fields' });
    const [exists] = await pool.query('SELECT user_id FROM users WHERE email = ? OR username = ?', [email, username]);
    if (exists.length) return res.status(409).json({ error: 'User already exists' });
    const hash = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO users (username, email, password, profile_pic, bio) VALUES (?, ?, ?, ?, ?)',
      [username, email, hash, '', '']
    );
    const token = jwt.sign({ user_id: result.insertId }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { user_id: result.insertId, username, email, profile_pic: '', bio: '' } });
  } catch (e) {
    console.error('Auth register error:', e);
    const msg = process.env.NODE_ENV === 'development' ? (e.message || 'Server error') : 'Server error';
    res.status(500).json({ error: msg });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ? LIMIT 1', [email]);
    const user = rows[0];
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ user_id: user.user_id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    delete user.password;
    res.json({ token, user });
  } catch (e) {
    console.error('Auth login error:', e);
    const msg = process.env.NODE_ENV === 'development' ? (e.message || 'Server error') : 'Server error';
    res.status(500).json({ error: msg });
  }
});

router.get('/me', authRequired, async (req, res) => {
  const [rows] = await pool.query('SELECT user_id, username, email, profile_pic, bio, created_at FROM users WHERE user_id = ?', [req.user.user_id]);
  res.json(rows[0] || null);
});

export default router;
