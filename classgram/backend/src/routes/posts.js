import { Router } from 'express';
import { pool } from '../config/db.js';
import { authRequired } from '../middleware/auth.js';

const router = Router();

router.post('/', authRequired, async (req, res) => {
  const { content, image_url } = req.body;
  const [result] = await pool.query('INSERT INTO posts (user_id, content, image_url) VALUES (?, ?, ?)', [req.user.user_id, content || '', image_url || '']);
  const [[post]] = await pool.query('SELECT p.*, u.username, u.profile_pic FROM posts p JOIN users u ON p.user_id = u.user_id WHERE post_id = ?', [result.insertId]);
  res.json(post);
});

router.get('/feed', authRequired, async (req, res) => {
  const userId = req.user.user_id;
  const [rows] = await pool.query(`
    SELECT p.*, u.username, u.profile_pic,
      (SELECT COUNT(*) FROM likes l WHERE l.post_id = p.post_id) AS like_count,
      (SELECT COUNT(*) FROM comments c WHERE c.post_id = p.post_id) AS comment_count
    FROM posts p
    JOIN followers f ON f.following_id = p.user_id AND f.follower_id = ?
    JOIN users u ON u.user_id = p.user_id
    ORDER BY p.created_at DESC
    LIMIT 100
  `, [userId]);
  res.json(rows);
});

router.get('/user/:userId', authRequired, async (req, res) => {
  const { userId } = req.params;
  const [rows] = await pool.query(`
    SELECT p.*, u.username, u.profile_pic,
      (SELECT COUNT(*) FROM likes l WHERE l.post_id = p.post_id) AS like_count,
      (SELECT COUNT(*) FROM comments c WHERE c.post_id = p.post_id) AS comment_count
    FROM posts p
    JOIN users u ON u.user_id = p.user_id
    WHERE p.user_id = ?
    ORDER BY p.created_at DESC
  `, [userId]);
  res.json(rows);
});

router.get('/trending', authRequired, async (req, res) => {
  const [rows] = await pool.query(`
    SELECT p.*, u.username, u.profile_pic,
      COUNT(l.like_id) AS like_count
    FROM posts p
    JOIN users u ON u.user_id = p.user_id
    LEFT JOIN likes l ON l.post_id = p.post_id AND l.created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
    GROUP BY p.post_id
    ORDER BY like_count DESC, p.created_at DESC
    LIMIT 50
  `);
  res.json(rows);
});

export default router;
