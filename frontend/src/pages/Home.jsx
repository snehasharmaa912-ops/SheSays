import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getPosts } from '../api.js'
import BlogCard from '../components/BlogCard.jsx'

export default function Home() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getPosts()
      .then((data) => setPosts(data.slice(0, 3)))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="page">
      <section className="hero">
        <h1>Speak Your Truth.</h1>
        <p>
          SheSays is a space for girls to talk about confidence, beauty, passion,
          periods — anything and everything, without filters.
        </p>
        <Link to="/blog" className="btn-primary">Read the Blog</Link>
      </section>

      <section className="home-posts">
        <h2>Latest Stories</h2>
        {loading && <p>Loading...</p>}
        {!loading && posts.length === 0 && <p>No stories yet. Check back soon.</p>}
        <div className="post-grid">
          {posts.map((post) => (
            <BlogCard key={post._id} post={post} />
          ))}
        </div>
      </section>
    </div>
  )
}
