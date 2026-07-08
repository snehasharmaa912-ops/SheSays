import express from 'express'
import {
  getPosts,
  getPostBySlug,
  createPost,
  updatePost,
  deletePost,
  toggleLike,
} from '../controllers/postController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/', getPosts)
router.get('/:slug', getPostBySlug)
router.post('/', protect, createPost)
router.put('/:slug', protect, updatePost)
router.delete('/:slug', protect, deletePost)
router.post('/:slug/like', protect, toggleLike)

export default router
