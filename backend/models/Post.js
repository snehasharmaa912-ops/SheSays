import mongoose from 'mongoose'

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    category: {
      type: String,
      enum: ['Confidence', 'Beauty', 'Passion', 'Periods', 'Real Talk', 'Other'],
      default: 'Other',
    },
    author: { type: String, default: 'Anonymous' },
    coverImage: { type: String, default: '' },
  },
  { timestamps: true }
)

export default mongoose.model('Post', postSchema)
