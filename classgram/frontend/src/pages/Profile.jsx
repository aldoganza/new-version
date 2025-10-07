import React, { useEffect, useState } from 'react'
import { api } from '../api'

export default function Profile({ me }){
  const [user, setUser] = useState(null)
  const [posts, setPosts] = useState([])
  const [form, setForm] = useState({ username: '', bio: '', profile_pic: '' })

  const load = async () => {
    const u = await api('/api/auth/me')
    setUser(u)
    setForm({ username: u.username || '', bio: u.bio || '', profile_pic: u.profile_pic || '' })
    const rows = await api(`/api/posts/user/${u.user_id}`)
    setPosts(rows)
  }
  useEffect(()=>{ load() }, [])

  const save = async (e) => {
    e.preventDefault()
    await api(`/api/users/${user.user_id}`, { method: 'PUT', body: JSON.stringify(form) })
    load()
  }

  return user ? (
    <div className="container">
      <div className="profile-header">
        <img className="avatar lg" src={user.profile_pic || 'https://i.pravatar.cc/100'} />
        <div>
          <h2>@{user.username}</h2>
          <p>{user.bio}</p>
        </div>
      </div>
      <form className="profile-edit" onSubmit={save}>
        <input placeholder="Username" value={form.username} onChange={e=>setForm({...form, username:e.target.value})} />
        <input placeholder="Profile picture URL" value={form.profile_pic} onChange={e=>setForm({...form, profile_pic:e.target.value})} />
        <textarea placeholder="Bio" value={form.bio} onChange={e=>setForm({...form, bio:e.target.value})} />
        <button type="submit">Save</button>
      </form>
      <h3>Your Posts</h3>
      <div className="grid">
        {posts.map(p => (
          <div key={p.post_id} className="card">
            {p.image_url && <img className="card-img" src={p.image_url} />}
            {p.content && <div className="caption">{p.content}</div>}
            <div className="meta small">{new Date(p.created_at).toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  ) : null
}
