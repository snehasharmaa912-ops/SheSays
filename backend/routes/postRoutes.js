import express from 'express'
import {
  getPosts,
  getPostBySlug,
  createPost,
  updatePost,
  deletePost,
} from '../controllers/postController.js'

const router = express.Router()

router.get('/', getPosts)
router.get('/:slug', getPostBySlug)
router.post('/', createPost)
router.put('/:slug', updatePost)
router.delete('/:slug', deletePost)

export default router
