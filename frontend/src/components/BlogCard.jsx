import { Link } from 'react-router-dom'

export default function BlogCard({ post }) {
  return (
    <Link to={`/blog/${post.slug}`} className="blog-card">
      {post.coverImage && (
        <div className="blog-card-image">
          <img src={post.coverImage} alt={post.title} />
        </div>
      )}
      <div className="blog-card-body">
        <span className="blog-card-category">{post.category}</span>
        <h3>{post.title}</h3>
        <p>{post.excerpt}</p>
        <span className="blog-card-author">— {post.authorName}</span>
      </div>
    </Link>
  )
}
