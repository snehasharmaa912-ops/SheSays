import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getPostBySlug, toggleLike, deletePost } from '../api.js'
import { useAuth } from '../context/AuthContext.jsx'
import Comments from '../components/Comments.jsx'

export default function BlogPost() {
  const { slug } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [likeCount, setLikeCount] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    getPostBySlug(slug)
      .then((data) => {
        setPost(data)
        setLikeCount(data.likes?.length || 0)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [slug])

  const handleLike = async () => {
    if (!user) return setError('Log in to like this post')
    try {
      const res = await toggleLike(slug)
      setLikeCount(res.likes)
    } catch (err) {
      setError(err.message)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Delete this post? This cannot be undone.')) return
    setDeleting(true)
    try {
      await deletePost(slug)
      navigate('/blog')
    } catch (err) {
      setError(err.message)
      setDeleting(false)
    }
  }

  if (loading) return <div className="page"><p>Loading...</p></div>
  if (error && !post) return (
    <div className="page">
      <p>{error}</p>
      <Link to="/blog">← Back to Blog</Link>
    </div>
  )

  return (
    <article className="page blog-post">
      <Link to="/blog" className="back-link">← Back to Blog</Link>
      <span className="blog-card-category">{post.category}</span>
      <h1>{post.title}</h1>
      <p className="blog-post-author">By {post.authorName}</p>
      {post.coverImage && <img src={post.coverImage} alt={post.title} className="blog-post-image" />}
      <div className="blog-post-content">{post.content}</div>

      <button className="like-btn" onClick={handleLike}>
        ♥ {likeCount} {likeCount === 1 ? 'Like' : 'Likes'}
      </button>

      {user && user._id === post.author && (
        <div className="post-owner-actions">
          <Link to={`/blog/${slug}/edit`} className="btn-secondary">Edit</Link>
          <button className="btn-danger" onClick={handleDelete} disabled={deleting}>
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      )}

      {error && <p className="form-status error">{error}</p>}

      <Comments slug={slug} postAuthorId={post.author} />
    </article>
  )
}
