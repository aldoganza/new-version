import React, { useEffect, useState } from 'react'
import { api } from '../api'
import PostCard from '../components/PostCard'

export default function Trending(){
  const [rows, setRows] = useState([])
  useEffect(()=>{ api('/api/posts/trending').then(setRows) }, [])
  return (
    <div className="container">
      <h2>Trending this week</h2>
      <div className="grid">
        {rows.map(p => <PostCard key={p.post_id} post={p} onRefresh={()=>api('/api/posts/trending').then(setRows)} />)}
      </div>
    </div>
  )
}
