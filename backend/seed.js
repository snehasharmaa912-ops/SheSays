import mongoose from 'mongoose'
import dotenv from 'dotenv'
import User from './models/User.js'
import Post from './models/Post.js'

dotenv.config()

const samplePosts = [
  {
    title: 'Owning My Confidence, Finally',
    slug: 'owning-my-confidence-finally',
    excerpt: 'It took me 19 years to stop apologizing for taking up space.',
    content: 'It took me 19 years to stop apologizing for taking up space. Confidence isn\'t loud — it\'s quiet, steady, and it grows every time you choose yourself.',
    category: 'Confidence',
  },
  {
    title: 'Periods Are Not a Whisper Topic',
    slug: 'periods-are-not-a-whisper-topic',
    excerpt: 'Why are we still hiding pads up our sleeves?',
    content: 'Why are we still hiding pads up our sleeves? Periods are normal. Talking about them should be too.',
    category: 'Periods',
  },
  {
    title: 'Beauty Beyond the Mirror',
    slug: 'beauty-beyond-the-mirror',
    excerpt: 'Beauty standards changed the day I stopped chasing them.',
    content: 'Beauty standards changed the day I stopped chasing them. Real beauty is how you make people feel, including yourself.',
    category: 'Beauty',
  },
]

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('Connected to MongoDB for seeding')

    let user = await User.findOne({ email: 'admin@shesays.com' })
    if (!user) {
      user = await User.create({
        name: 'SheSays Team',
        email: 'admin@shesays.com',
        password: 'shesays123',
        bio: 'The voice behind SheSays.',
      })
      console.log('Created sample user: admin@shesays.com / shesays123')
    }

    await Post.deleteMany({})
    const posts = samplePosts.map((p) => ({
      ...p,
      author: user._id,
      authorName: user.name,
    }))
    await Post.insertMany(posts)

    console.log(`Seeded ${posts.length} posts`)
    process.exit(0)
  } catch (err) {
    console.error('Seeding failed:', err.message)
    process.exit(1)
  }
}

seed()
