import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { connectDB } from './config/db.js'
import postRoutes from './routes/postRoutes.js'
import contactRoutes from './routes/contactRoutes.js'
import { errorHandler } from './middleware/errorHandler.js'

dotenv.config()
connectDB()

const app = express()
app.use(cors({ origin: process.env.CLIENT_URL || '*' }))
app.use(express.json())
app.get('/', (req, res) => res.json({ status: 'SheSays API is running' }))
app.use('/api/posts', postRoutes)
app.use('/api/contact', contactRoutes)
app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
