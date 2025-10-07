import { Router } from 'express';
import { pool } from '../config/db.js';
import { authRequired } from '../middleware/auth.js';

const router = Router();

router.get('/:peerId', authRequired, async (req, res) => {
  const { peerId } = req.params;
  const [rows] = await pool.query(
    `SELECT * FROM messages 
     WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?) 
     ORDER BY created_at ASC`,
    [req.user.user_id, peerId, peerId, req.user.user_id]
  );
  res.json(rows);
});

router.post('/:peerId', authRequired, async (req, res) => {
  const { peerId } = req.params;
  const { message_text } = req.body;
  const [result] = await pool.query('INSERT INTO messages (sender_id, receiver_id, message_text) VALUES (?, ?, ?)', [req.user.user_id, peerId, message_text]);
  const [[row]] = await pool.query('SELECT * FROM messages WHERE message_id = ?', [result.insertId]);
  await pool.query('INSERT INTO notifications (user_id, sender_id, type, message) VALUES (?, ?, ?, ?)', [peerId, req.user.user_id, 'message', message_text.slice(0, 140)]);
  req.io?.to(`user:${peerId}`).emit('private_message', row);
  res.json(row);
});

export default router;
