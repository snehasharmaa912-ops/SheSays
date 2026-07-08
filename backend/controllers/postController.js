import Post from '../models/Post.js'

export const getPosts = async (req, res) => {
  const { category } = req.query
  const filter = category ? { category } : {}
  const posts = await Post.find(filter).sort({ createdAt: -1 })
  res.json(posts)
}

export const getPostBySlug = async (req, res) => {
  const post = await Post.findOne({ slug: req.params.slug })
  if (!post) return res.status(404).json({ message: 'Post not found' })
  res.json(post)
}

export const createPost = async (req, res) => {
  try {
    const post = await Post.create(req.body)
    res.status(201).json(post)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

export const updatePost = async (req, res) => {
  const post = await Post.findOneAndUpdate({ slug: req.params.slug }, req.body, {
    new: true,
    runValidators: true,
  })
  if (!post) return res.status(404).json({ message: 'Post not found' })
  res.json(post)
}

export const deletePost = async (req, res) => {
  const post = await Post.findOneAndDelete({ slug: req.params.slug })
  if (!post) return res.status(404).json({ message: 'Post not found' })
  res.json({ message: 'Post deleted' })
}
