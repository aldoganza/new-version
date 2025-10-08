import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const {
  DB_HOST,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
  DB_PORT
} = process.env;

if (!DB_HOST || !DB_USER || !DB_NAME) {
  const missing = [!DB_HOST && 'DB_HOST', !DB_USER && 'DB_USER', !DB_NAME && 'DB_NAME'].filter(Boolean).join(', ');
  throw new Error(`Missing database environment variables: ${missing}. Create backend/.env from .env.example and set your MySQL credentials.`);
}

export const pool = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  port: DB_PORT ? Number(DB_PORT) : 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
