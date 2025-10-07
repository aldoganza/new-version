import { Router } from 'express';
import { pool } from '../config/db.js';
import { authRequired } from '../middleware/auth.js';

const router = Router();

router.get('/:id', authRequired, async (req, res) => {
  const { id } = req.params;
  const [[user]] = await pool.query('SELECT user_id, username, email, profile_pic, bio, created_at FROM users WHERE user_id = ?', [id]);
  if (!user) return res.status(404).json({ error: 'Not found' });
  const [[counts]] = await pool.query(
    `SELECT 
      (SELECT COUNT(*) FROM followers WHERE following_id = ?) AS followers,
      (SELECT COUNT(*) FROM followers WHERE follower_id = ?) AS following,
      (SELECT COUNT(*) FROM posts WHERE user_id = ?) AS posts`,
    [id, id, id]
  );
  res.json({ ...user, stats: counts });
});

router.put('/:id', authRequired, async (req, res) => {
  const { id } = req.params;
  if (parseInt(id, 10) !== req.user.user_id) return res.status(403).json({ error: 'Forbidden' });
  const { username, bio, profile_pic } = req.body;
  await pool.query('UPDATE users SET username = ?, bio = ?, profile_pic = ? WHERE user_id = ?', [username, bio, profile_pic, id]);
  const [[updated]] = await pool.query('SELECT user_id, username, email, profile_pic, bio FROM users WHERE user_id = ?', [id]);
  res.json(updated);
});

export default router;
