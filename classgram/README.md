# ClassGram

A minimal full-stack social app for classmates.

## Stack
- **Frontend**: React + Vite + manual CSS (no UI libs)
- **Backend**: Node.js (Express) + Socket.io
- **Database**: MySQL

## Quick Start

### 1) MySQL
- Create DB and tables:
```sql
SOURCE database/schema.sql;
SOURCE database/seed.sql; -- optional demo data
```

### 2) Backend
```
cd backend
copy .env.example .env   # on Windows
# edit .env with your MySQL creds
npm install
npm run dev
```
- API runs at: http://localhost:5000

### 3) Frontend
```
cd ../frontend
npm install
npm run dev
```
- App runs at: http://localhost:5173

Ensure `CLIENT_URL` in `backend/.env` is `http://localhost:5173`.

## Features
- Auth: register, login, JWT
- Profiles: edit username, bio, avatar
- Posts: create text or image posts, feed from followed users
- Likes & Comments: like toggle, view comments endpoint
- Follow: follow/unfollow
- Chat: real-time via Socket.io (enter peer user ID)
- Notifications: stored in DB; new messages trigger socket notification
- Trending: top liked posts in last 7 days

## Folder Structure
```
classgram/
  backend/
  frontend/
  database/
```

## Notes
- This starter uses simple image URLs (no media upload service).
- For production, add HTTPS, validation, and rate limits.
