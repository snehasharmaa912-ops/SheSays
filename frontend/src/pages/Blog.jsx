import { useEffect, useState } from 'react'
import { getPosts } from '../api.js'
import BlogCard from '../components/BlogCard.jsx'

const BASE_CATEGORIES = ['Confidence', 'Beauty', 'Passion', 'Periods', 'Real Talk']

export default function Blog() {
  const [posts, setPosts] = useState([])
  const [category, setCategory] = useState('All')
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState(['All', ...BASE_CATEGORIES])

  useEffect(() => {
    getPosts()
      .then((allPosts) => {
        const customCats = allPosts
          .map((p) => p.category)
          .filter((c) => c && !BASE_CATEGORIES.includes(c) && c !== 'Other')
        const uniqueCustom = [...new Set(customCats)].sort()
        setCategories(['All', ...BASE_CATEGORIES, ...uniqueCustom, 'Other'])
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    setLoading(true)
    getPosts(category === 'All' ? undefined : category)
      .then(setPosts)
      .catch(() => setPosts([]))
      .finally(() => setLoading(false))
  }, [category])

  return (
    <div className="page">
      <h1>The Blog</h1>
      <div className="category-filters">
        {categories.map((cat) => (
          <button
            key={cat}
            className={cat === category ? 'active' : ''}
            onClick={() => setCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading && <p>Loading...</p>}
      {!loading && posts.length === 0 && <p>No posts in this category yet.</p>}

      <div className="post-grid">
        {posts.map((post) => (
          <BlogCard key={post._id} post={post} />
        ))}
      </div>
    </div>
  )
}
