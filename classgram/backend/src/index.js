import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import http from 'http';
import { Server } from 'socket.io';
import { pool } from './config/db.js';

import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import postRoutes from './routes/posts.js';
import likeRoutes from './routes/likes.js';
import commentRoutes from './routes/comments.js';
import followRoutes from './routes/follows.js';
import messageRoutes from './routes/messages.js';
import notificationRoutes from './routes/notifications.js';
import { setupSockets } from './sockets.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }
});
setupSockets(io);

// attach io to req
app.use((req, _res, next) => { req.io = io; next(); });

const ORIGIN = process.env.CLIENT_URL || 'http://localhost:5173';
const corsOptions = {
  origin: ORIGIN,
  credentials: true,
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

app.get('/', (_req, res) => res.send('ClassGram API running'));

// Health check: verifies DB connectivity
app.get('/api/health', async (_req, res) => {
  try {
    const [[row]] = await pool.query('SELECT 1 AS ok');
    res.json({ ok: true, db: row.ok === 1 });
  } catch (e) {
    console.error('Health check DB error:', e);
    res.status(500).json({ ok: false, error: 'DB connection failed', details: process.env.NODE_ENV === 'development' ? (e && e.message) : undefined });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/follows', followRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/notifications', notificationRoutes);

const PORT = process.env.PORT || 5000;
server.listen(PORT, async () => {
  console.log(`API listening on http://localhost:${PORT}`);
  try {
    await pool.query('SELECT 1');
    console.log('DB connection OK');
  } catch (e) {
    console.error('DB connection FAILED:', e);
  }
});

process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION', err && err.stack ? err.stack : err);
  process.exit(1);
});
process.on('unhandledRejection', (reason) => {
  console.error('UNHANDLED REJECTION', reason);
});
