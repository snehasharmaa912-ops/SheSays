import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getPostBySlug } from '../api.js'

export default function BlogPost() {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getPostBySlug(slug)
      .then(setPost)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) return <div className="page"><p>Loading...</p></div>
  if (error) return (
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
      <p className="blog-post-author">By {post.author}</p>
      {post.coverImage && <img src={post.coverImage} alt={post.title} className="blog-post-image" />}
      <div className="blog-post-content">{post.content}</div>
    </article>
  )
}
