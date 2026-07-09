import Post from '../models/Post.js'
import Comment from '../models/Comment.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const getComments = asyncHandler(async (req, res) => {
  const post = await Post.findOne({ slug: req.params.slug })
  if (!post) return res.status(404).json({ message: 'Post not found' })

  const comments = await Comment.find({ post: post._id }).sort({ createdAt: 1 })
  res.json(comments)
})

export const createComment = asyncHandler(async (req, res) => {
  const post = await Post.findOne({ slug: req.params.slug })
  if (!post) return res.status(404).json({ message: 'Post not found' })

  const { content, parentComment } = req.body
  if (!content || !content.trim()) {
    return res.status(400).json({ message: 'Comment cannot be empty' })
  }

  if (parentComment) {
    const parent = await Comment.findById(parentComment)
    if (!parent || parent.post.toString() !== post._id.toString()) {
      return res.status(400).json({ message: 'Invalid comment to reply to' })
    }
  }

  const comment = await Comment.create({
    post: post._id,
    author: req.user._id,
    authorName: req.user.name,
    content: content.trim(),
    parentComment: parentComment || null,
  })

  res.status(201).json(comment)
})

export const deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.commentId)
  if (!comment) return res.status(404).json({ message: 'Comment not found' })
  if (comment.author.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized to delete this comment' })
  }
  await comment.deleteOne()
  res.json({ message: 'Comment deleted' })
})
