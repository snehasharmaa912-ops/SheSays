import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createPost } from '../api.js'

const CATEGORIES = ['Confidence', 'Beauty', 'Passion', 'Periods', 'Real Talk', 'Other']

function slugify(title) {
  return title.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')
}

export default function Write() {
  const [form, setForm] = useState({
    title: '', excerpt: '', content: '', category: 'Confidence', coverImage: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const post = await createPost({ ...form, slug: slugify(form.title) })
      navigate(`/blog/${post.slug}`)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <h1>Write a Post</h1>
      <form className="contact-form" onSubmit={handleSubmit}>
        <label htmlFor="title">Title</label>
        <input id="title" name="title" value={form.title} onChange={handleChange} required />

        <label htmlFor="category">Category</label>
        <select id="category" name="category" value={form.category} onChange={handleChange}>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>

        <label htmlFor="excerpt">Short Excerpt</label>
        <input id="excerpt" name="excerpt" value={form.excerpt} onChange={handleChange} required />

        <label htmlFor="coverImage">Cover Image URL (optional)</label>
        <input id="coverImage" name="coverImage" value={form.coverImage} onChange={handleChange} />

        <label htmlFor="content">Content</label>
        <textarea id="content" name="content" rows="10" value={form.content} onChange={handleChange} required />

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Publishing...' : 'Publish Post'}
        </button>

        {error && <p className="form-status error">{error}</p>}
      </form>
    </div>
  )
}
