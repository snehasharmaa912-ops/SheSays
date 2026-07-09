import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { getPostBySlug, updatePost, uploadImage } from '../api.js'
import { useAuth } from '../context/AuthContext.jsx'

const STANDARD_CATEGORIES = ['Confidence', 'Beauty', 'Passion', 'Periods', 'Real Talk']
const CATEGORIES = [...STANDARD_CATEGORIES, 'Other']

export default function EditPost() {
  const { slug } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState(null)
  const [customCategory, setCustomCategory] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    getPostBySlug(slug)
      .then((post) => {
        if (!user || post.author !== user._id) {
          setError('You are not authorized to edit this post')
          return
        }
        const isStandard = STANDARD_CATEGORIES.includes(post.category)
        setForm({
          title: post.title,
          excerpt: post.excerpt,
          content: post.content,
          coverImage: post.coverImage || '',
          category: isStandard ? post.category : 'Other',
        })
        if (!isStandard) setCustomCategory(post.category)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [slug, user])

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

    setSaving(true)
    try {
      const updated = await updatePost(slug, { ...form, category })
      navigate(`/blog/${updated.slug}`)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="page"><p>Loading...</p></div>
  if (error && !form) return (
    <div className="page">
      <p>{error}</p>
      <Link to="/blog">← Back to Blog</Link>
    </div>
  )

  return (
    <div className="page">
      <h1>Edit Post</h1>
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

        <button type="submit" className="btn-primary" disabled={saving || uploading}>
          {saving ? 'Saving...' : 'Save Changes'}
        </button>

        {error && <p className="form-status error">{error}</p>}
      </form>
    </div>
  )
}
