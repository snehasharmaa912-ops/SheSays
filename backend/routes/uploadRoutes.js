import express from 'express'
import { protect } from '../middleware/authMiddleware.js'
import { upload } from '../middleware/upload.js'

const router = express.Router()

router.post('/', protect, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No image uploaded' })
  }
  
  const url = `/uploads/${req.file.filename}`
  res.status(201).json({ url })
})

export default router
