const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

function getToken() {
  const stored = localStorage.getItem('shesays_user')
  return stored ? JSON.parse(stored).token : null
}

async function handleResponse(res) {
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Something went wrong')
  return data
}

function authHeaders() {
  const token = getToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// Auth
export const registerUser = async (payload) => {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  return handleResponse(res)
}

export const loginUser = async (payload) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  return handleResponse(res)
}

// Posts
export const getPosts = async (category) => {
  const query = category ? `?category=${encodeURIComponent(category)}` : ''
  const res = await fetch(`${API_URL}/posts${query}`)
  return handleResponse(res)
}

export const getPostBySlug = async (slug) => {
  const res = await fetch(`${API_URL}/posts/${slug}`)
  return handleResponse(res)
}

export const createPost = async (postData) => {
  const res = await fetch(`${API_URL}/posts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(postData),
  })
  return handleResponse(res)
}

export const toggleLike = async (slug) => {
  const res = await fetch(`${API_URL}/posts/${slug}/like`, {
    method: 'POST',
    headers: { ...authHeaders() },
  })
  return handleResponse(res)
}

// Contact
export const sendContactMessage = async (formData) => {
  const res = await fetch(`${API_URL}/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  })
  return handleResponse(res)
}
