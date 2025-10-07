import { Router } from 'express';
import { pool } from '../config/db.js';
import { authRequired } from '../middleware/auth.js';

const router = Router();

router.get('/', authRequired, async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 100', [req.user.user_id]);
  res.json(rows);
});

router.post('/:id/read', authRequired, async (req, res) => {
  const { id } = req.params;
  await pool.query('UPDATE notifications SET is_read = 1 WHERE notification_id = ? AND user_id = ?', [id, req.user.user_id]);
  res.json({ ok: true });
});

export default router;
