const BASE = 'http://localhost:5001'

export function getToken(){
  return localStorage.getItem('cg_token')
}
export function setToken(t){
  localStorage.setItem('cg_token', t)
}
export function clearToken(){
  localStorage.removeItem('cg_token')
}

export async function api(path, opts={}){
  const headers = { 'Content-Type': 'application/json', ...(opts.headers||{}) }
  const token = getToken()
  if (token) headers['Authorization'] = `Bearer ${token}`
  const res = await fetch(BASE + path, { ...opts, headers })
  if (!res.ok) {
    let msg = 'Request failed'
    const ct = res.headers.get('content-type') || ''
    if (ct.includes('application/json')) {
      try {
        const data = await res.json()
        msg = data.error || data.message || JSON.stringify(data)
      } catch {}
    } else {
      try { msg = await res.text() } catch {}
    }
    throw new Error(msg)
  }
  if (res.status === 204) return null
  return res.json()
}
