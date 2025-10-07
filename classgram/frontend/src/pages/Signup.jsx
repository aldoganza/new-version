import React, { useState } from 'react'
import { api, setToken } from '../api'

export default function Signup({ onSwitch, onSignedIn }){
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const { token, user } = await api('/api/auth/register', { method:'POST', body: JSON.stringify({ username, email, password }) })
      setToken(token)
      onSignedIn(user, token)
    } catch (err) {
      setError('Signup failed')
    }
  }

  return (
    <div className="auth">
      <h1>Join Class<span>Gram</span></h1>
      <form onSubmit={submit} className="auth-form">
        <input placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} />
        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
        {error && <div className="error">{error}</div>}
        <button type="submit">Create account</button>
        <div className="switch">Have an account? <a onClick={onSwitch}>Log in</a></div>
      </form>
    </div>
  )
}
