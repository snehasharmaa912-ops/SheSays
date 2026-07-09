import Post from '../models/Post.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const getPosts = asyncHandler(async (req, res) => {
  const { category } = req.query
  const filter = category ? { category } : {}
  const posts = await Post.find(filter).sort({ createdAt: -1 })
  res.json(posts)
})

export const getPostBySlug = asyncHandler(async (req, res) => {
  const post = await Post.findOne({ slug: req.params.slug })
  if (!post) return res.status(404).json({ message: 'Post not found' })
  res.json(post)
})

export const createPost = asyncHandler(async (req, res) => {
  try {
    const post = await Post.create({
      ...req.body,
      author: req.user._id,
      authorName: req.user.name,
    })
    res.status(201).json(post)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

export const updatePost = asyncHandler(async (req, res) => {
  const post = await Post.findOne({ slug: req.params.slug })
  if (!post) return res.status(404).json({ message: 'Post not found' })
  if (post.author.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized to edit this post' })
  }
  Object.assign(post, req.body)
  await post.save()
  res.json(post)
})

export const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findOne({ slug: req.params.slug })
  if (!post) return res.status(404).json({ message: 'Post not found' })
  if (post.author.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized to delete this post' })
  }
  await post.deleteOne()
  res.json({ message: 'Post deleted' })
})

export const toggleLike = asyncHandler(async (req, res) => {
  const post = await Post.findOne({ slug: req.params.slug })
  if (!post) return res.status(404).json({ message: 'Post not found' })

  const userId = req.user._id.toString()
  const alreadyLiked = post.likes.some((id) => id.toString() === userId)

  if (alreadyLiked) {
    post.likes = post.likes.filter((id) => id.toString() !== userId)
  } else {
    post.likes.push(req.user._id)
  }

  await post.save()
  res.json({ likes: post.likes.length, liked: !alreadyLiked })
})
