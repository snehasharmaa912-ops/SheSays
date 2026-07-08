import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getPostBySlug, toggleLike } from '../api.js'
import { useAuth } from '../context/AuthContext.jsx'

export default function BlogPost() {
  const { slug } = useParams()
  const { user } = useAuth()
  const [post, setPost] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [likeCount, setLikeCount] = useState(0)

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
      {error && <p className="form-status error">{error}</p>}
    </article>
  )
}
