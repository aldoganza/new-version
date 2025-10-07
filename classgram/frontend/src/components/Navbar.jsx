import React from 'react'
import '../styles/components.css'

export default function Navbar({ onNavigate, me, notifications, onLogout }){
  return (
    <nav className="nav">
      <div className="brand">Class<span>Gram</span></div>
      <div className="links">
        <button onClick={()=>onNavigate('home')}>Home</button>
        <button onClick={()=>onNavigate('trending')}>Trending</button>
        <button onClick={()=>onNavigate('chat')}>Chat</button>
        <button onClick={()=>onNavigate('profile')}>Profile</button>
      </div>
      <div className="right">
        <div className="notif">🔔 {notifications?.length || 0}</div>
        {me && <img className="avatar" src={me.profile_pic || 'https://i.pravatar.cc/40'} alt="pfp" />}
        <button className="logout" onClick={onLogout}>Logout</button>
      </div>
    </nav>
  )
}
