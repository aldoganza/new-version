import React, { useEffect, useState } from 'react'
import { api } from '../api'

export default function Chat({ me, socket }){
  const [peerId, setPeerId] = useState('')
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')

  useEffect(() => {
    if (!peerId) return
    api(`/api/messages/${peerId}`).then(setMessages)
  }, [peerId])

  useEffect(() => {
    if (!socket) return
    const handler = (msg) => {
      if ((msg.sender_id === Number(peerId) && msg.receiver_id === me.user_id) || (msg.sender_id === me.user_id && msg.receiver_id === Number(peerId))) {
        setMessages(m => [...m, msg])
      }
    }
    socket.on('private_message', handler)
    return () => socket.off('private_message', handler)
  }, [socket, peerId, me])

  const send = async (e) => {
    e.preventDefault()
    if (!peerId || !text.trim()) return
    const msg = await api(`/api/messages/${peerId}`, { method: 'POST', body: JSON.stringify({ message_text: text }) })
    setMessages(m => [...m, msg])
    setText('')
  }

  return (
    <div className="container chat">
      <div className="chat-header">
        <input placeholder="Peer user ID" value={peerId} onChange={e=>setPeerId(e.target.value)} />
      </div>
      <div className="chat-window">
        {messages.map(m => (
          <div key={m.message_id} className={m.sender_id === me.user_id ? 'msg me' : 'msg peer'}>
            <div className="bubble">{m.message_text}</div>
            <div className="time">{new Date(m.created_at).toLocaleTimeString()}</div>
          </div>
        ))}
      </div>
      <form className="chat-input" onSubmit={send}>
        <input placeholder="Type a message" value={text} onChange={e=>setText(e.target.value)} />
        <button type="submit">Send</button>
      </form>
    </div>
  )
}
