import express from 'express'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import { authRouter } from './routes/auth'
import { errorHandler } from './middleware/errorHandler'

export const app = express()

app.use(helmet())
app.use(express.json())
app.use(cookieParser())

app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(',') || 'http://localhost:5173',
    credentials: true,
  })
)

app.use(
  rateLimit({
    windowMs: 60 * 1000,
    max: 60,
  })
)

app.use('/api/auth', authRouter)

app.get('/health', (_req, res) => res.json({ ok: true }))

app.use(errorHandler)
