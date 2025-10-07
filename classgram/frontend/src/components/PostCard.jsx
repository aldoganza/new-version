import React from 'react'
import { api } from '../api'

export default function PostCard({ post, onRefresh }){
  const toggleLike = async () => {
    await api(`/api/likes/${post.post_id}/toggle`, { method: 'POST' })
    onRefresh && onRefresh()
  }
  return (
    <div className="card">
      <div className="card-header">
        <img className="avatar" src={post.profile_pic || 'https://i.pravatar.cc/40'} />
        <div className="meta">
          <div className="username">{post.username}</div>
          <div className="time">{new Date(post.created_at).toLocaleString()}</div>
        </div>
      </div>
      {post.image_url && <img className="card-img" src={post.image_url} alt="post" />}
      {post.content && <div className="caption">{post.content}</div>}
      <div className="actions">
        <button onClick={toggleLike}>❤ {post.like_count || 0}</button>
      </div>
    </div>
  )
}
