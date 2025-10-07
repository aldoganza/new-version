import { Router } from 'express';
import { pool } from '../config/db.js';
import { authRequired } from '../middleware/auth.js';

const router = Router();

router.post('/:postId', authRequired, async (req, res) => {
  const { postId } = req.params;
  const { comment_text } = req.body;
  const [result] = await pool.query('INSERT INTO comments (post_id, user_id, comment_text) VALUES (?, ?, ?)', [postId, req.user.user_id, comment_text]);
  const [[row]] = await pool.query('SELECT c.*, u.username, u.profile_pic FROM comments c JOIN users u ON c.user_id = u.user_id WHERE c.comment_id = ?', [result.insertId]);
  const [[post]] = await pool.query('SELECT user_id FROM posts WHERE post_id = ?', [postId]);
  if (post && post.user_id !== req.user.user_id) {
    await pool.query('INSERT INTO notifications (user_id, sender_id, type, message) VALUES (?, ?, ?, ?)', [post.user_id, req.user.user_id, 'comment', 'commented on your post']);
  }
  res.json(row);
});

router.get('/:postId', authRequired, async (req, res) => {
  const { postId } = req.params;
  const [rows] = await pool.query('SELECT c.*, u.username, u.profile_pic FROM comments c JOIN users u ON c.user_id = u.user_id WHERE c.post_id = ? ORDER BY c.created_at ASC', [postId]);
  res.json(rows);
});

export default router;
