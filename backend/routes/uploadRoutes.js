import express from 'express'
import { protect } from '../middleware/authMiddleware.js'
import { upload } from '../middleware/upload.js'
import cloudinary from '../config/cloudinary.js'

const router = express.Router()

router.post('/', protect, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No image uploaded' })
  }

  const uploadStream = cloudinary.uploader.upload_stream(
    { folder: 'shesays', resource_type: 'image' },
    (error, result) => {
      if (error) {
        return res.status(500).json({ message: 'Image upload failed', error: error.message })
      }
      res.status(201).json({ url: result.secure_url })
    }
  )

  uploadStream.end(req.file.buffer)
})

export default router
