import { Router } from 'express';
import { pool } from '../config/db.js';
import { authRequired } from '../middleware/auth.js';

const router = Router();

router.post('/:targetId/toggle', authRequired, async (req, res) => {
  const { targetId } = req.params;
  const userId = req.user.user_id;
  if (parseInt(targetId, 10) === userId) return res.status(400).json({ error: 'Cannot follow yourself' });
  const [[row]] = await pool.query('SELECT follow_id FROM followers WHERE follower_id = ? AND following_id = ?', [userId, targetId]);
  if (row) {
    await pool.query('DELETE FROM followers WHERE follow_id = ?', [row.follow_id]);
    res.json({ following: false });
  } else {
    await pool.query('INSERT INTO followers (follower_id, following_id) VALUES (?, ?)', [userId, targetId]);
    await pool.query('INSERT INTO notifications (user_id, sender_id, type, message) VALUES (?, ?, ?, ?)', [targetId, userId, 'follow', 'started following you']);
    res.json({ following: true });
  }
});

router.get('/:userId/stats', authRequired, async (req, res) => {
  const { userId } = req.params;
  const [[counts]] = await pool.query(
    `SELECT 
      (SELECT COUNT(*) FROM followers WHERE following_id = ?) AS followers,
      (SELECT COUNT(*) FROM followers WHERE follower_id = ?) AS following`,
    [userId, userId]
  );
  res.json(counts);
});

export default router;
