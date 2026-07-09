import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createPost, uploadImage } from '../api.js'

const CATEGORIES = ['Confidence', 'Beauty', 'Passion', 'Periods', 'Real Talk', 'Other']

function slugify(title) {
  return title.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')
}

export default function Write() {
  const [form, setForm] = useState({
    title: '', excerpt: '', content: '', category: 'Confidence', coverImage: '',
  })
  const [customCategory, setCustomCategory] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleCoverImagePick = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setError('')
    setUploading(true)
    try {
      const url = await uploadImage(file)
      setForm((prev) => ({ ...prev, coverImage: url }))
    } catch (err) {
      setError(err.message)
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const category = form.category === 'Other' ? customCategory.trim() : form.category
    if (form.category === 'Other' && !category) {
      setError('Please name your category')
      return
    }

    setLoading(true)
    try {
      const post = await createPost({ ...form, category, slug: slugify(form.title) })
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

        {form.category === 'Other' && (
          <>
            <label htmlFor="customCategory">Name your category</label>
            <input
              id="customCategory"
              name="customCategory"
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              placeholder="e.g. Wellness"
              required
            />
          </>
        )}

        <label htmlFor="excerpt">Short Excerpt</label>
        <input id="excerpt" name="excerpt" value={form.excerpt} onChange={handleChange} required />

        <label htmlFor="coverImage">Cover Image (optional)</label>
        <input
          id="coverImage"
          type="file"
          accept="image/*"
          onChange={handleCoverImagePick}
        />
        {uploading && <p className="form-status">Uploading photo...</p>}
        {form.coverImage && !uploading && (
          <img
            src={form.coverImage}
            alt="Cover preview"
            style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 8, marginTop: 8 }}
          />
        )}

        <label htmlFor="content">Content</label>
        <textarea id="content" name="content" rows="10" value={form.content} onChange={handleChange} required />

        <button type="submit" className="btn-primary" disabled={loading || uploading}>
          {loading ? 'Publishing...' : 'Publish Post'}
        </button>

        {error && <p className="form-status error">{error}</p>}
      </form>
    </div>
  )
}
