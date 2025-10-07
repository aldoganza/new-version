const BASE = 'http://localhost:5000'

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
  if (!res.ok) throw new Error(await res.text())
  if (res.status === 204) return null
  return res.json()
}
