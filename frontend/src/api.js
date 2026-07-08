const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

async function handleResponse(res) {
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Something went wrong')
  return data
}

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
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(postData),
  })
  return handleResponse(res)
}

export const sendContactMessage = async (formData) => {
  const res = await fetch(`${API_URL}/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  })
  return handleResponse(res)
}
