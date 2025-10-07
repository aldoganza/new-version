import React, { useEffect, useState } from 'react'
import { api } from '../api'
import PostCard from '../components/PostCard'

export default function Home(){
  const [feed, setFeed] = useState([])
  const [content, setContent] = useState('')
  const [imageUrl, setImageUrl] = useState('')

  const load = async () => {
    const rows = await api('/api/posts/feed')
    setFeed(rows)
  }
  useEffect(() => { load() }, [])

  const submit = async (e) => {
    e.preventDefault()
    await api('/api/posts', { method: 'POST', body: JSON.stringify({ content, image_url: imageUrl }) })
    setContent(''); setImageUrl(''); load()
  }

  return (
    <div className="container">
      <form className="composer" onSubmit={submit}>
        <input placeholder="Say something..." value={content} onChange={e=>setContent(e.target.value)} />
        <input placeholder="Image URL (optional)" value={imageUrl} onChange={e=>setImageUrl(e.target.value)} />
        <button type="submit">Post</button>
      </form>
      <div className="grid">
        {feed.map(p => <PostCard key={p.post_id} post={p} onRefresh={load} />)}
      </div>
    </div>
  )
}
