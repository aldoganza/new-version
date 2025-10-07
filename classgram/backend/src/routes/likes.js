import { Router } from 'express';
import { pool } from '../config/db.js';
import { authRequired } from '../middleware/auth.js';

const router = Router();

router.post('/:postId/toggle', authRequired, async (req, res) => {
  const { postId } = req.params;
  const userId = req.user.user_id;
  const [[exists]] = await pool.query('SELECT like_id FROM likes WHERE post_id = ? AND user_id = ?', [postId, userId]);
  if (exists) {
    await pool.query('DELETE FROM likes WHERE like_id = ?', [exists.like_id]);
    res.json({ liked: false });
  } else {
    await pool.query('INSERT INTO likes (post_id, user_id) VALUES (?, ?)', [postId, userId]);
    // Create notification
    const [[post]] = await pool.query('SELECT user_id FROM posts WHERE post_id = ?', [postId]);
    if (post && post.user_id !== userId) {
      await pool.query('INSERT INTO notifications (user_id, sender_id, type, message) VALUES (?, ?, ?, ?)', [post.user_id, userId, 'like', 'liked your post']);
    }
    res.json({ liked: true });
  }
});

router.get('/:postId/count', authRequired, async (req, res) => {
  const { postId } = req.params;
  const [[row]] = await pool.query('SELECT COUNT(*) AS count FROM likes WHERE post_id = ?', [postId]);
  res.json({ count: row.count });
});

export default router;
