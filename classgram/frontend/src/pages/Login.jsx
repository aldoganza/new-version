import React, { useState } from 'react'
import { api, setToken } from '../api'

export default function Login({ onSwitch, onSignedIn }){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const { token, user } = await api('/api/auth/login', { method:'POST', body: JSON.stringify({ email, password }) })
      setToken(token)
      onSignedIn(user, token)
    } catch (err) {
      setError(err.message || 'Login failed')
    }
  }

  return (
    <div className="auth">
      <h1>Welcome to Class<span>Gram</span></h1>
      <form onSubmit={submit} className="auth-form">
        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
        {error && <div className="error">{error}</div>}
        <button type="submit">Login</button>
        <div className="switch">No account? <a onClick={onSwitch}>Sign up</a></div>
      </form>
    </div>
  )
}
