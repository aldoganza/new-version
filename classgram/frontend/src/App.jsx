import React, { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Home from './pages/Home'
import Profile from './pages/Profile'
import Chat from './pages/Chat'
import Trending from './pages/Trending'
import { api, getToken, setToken, clearToken } from './api'

function App() {
  const [page, setPage] = useState('login')
  const [me, setMe] = useState(null)
  const [socket, setSocket] = useState(null)
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    const t = getToken()
    if (t) {
      api('/api/auth/me').then(setMe).catch(() => clearToken())
      setPage('home')
      const s = io('http://localhost:5000', { auth: { userId: JSON.parse(atob(t.split('.')[1])).user_id } })
      setSocket(s)
      return () => s.close()
    }
  }, [])

  useEffect(() => {
    if (!socket) return
    socket.on('private_message', (msg) => {
      setNotifications((n) => [{ type: 'message', message: msg.message_text, created_at: msg.created_at }, ...n])
    })
    return () => {
      socket.off('private_message')
    }
  }, [socket])

  if (!getToken() && page === 'login') {
    return (
      <Login
        onSwitch={() => setPage('signup')}
        onSignedIn={(u, t)=>{ setMe(u); setToken(t); setPage('home') }}
      />
    )
  }
  if (!getToken() && page === 'signup') {
    return (
      <Signup
        onSwitch={() => setPage('login')}
        onSignedIn={(u, t)=>{ setMe(u); setToken(t); setPage('home') }}
      />
    )
  }

  return (
    <div>
      <Navbar onNavigate={setPage} me={me} notifications={notifications} onLogout={()=>{ clearToken(); setMe(null); setPage('login') }} />
      {page === 'home' && <Home me={me} />}
      {page === 'profile' && <Profile me={me} />}
      {page === 'chat' && <Chat me={me} socket={socket} />}
      {page === 'trending' && <Trending />}
    </div>
  )
}

export default App
