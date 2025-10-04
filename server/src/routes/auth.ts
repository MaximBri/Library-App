import { Router } from 'express'
import * as authController from '../controllers/auth.controller'
import { asyncHandler } from '../middleware/asyncHandler'
import { requireAuth } from '../middleware/authMiddleware'

export const authRouter = Router()

authRouter.post('/register', asyncHandler(authController.register))
authRouter.post('/login', asyncHandler(authController.login))
authRouter.post('/refresh', asyncHandler(authController.refresh))
authRouter.post('/logout', asyncHandler(authController.logout))
authRouter.get('/me', requireAuth, asyncHandler(authController.me))
authRouter.patch(
  '/profile',
  requireAuth,
  asyncHandler(authController.updateProfile)
)
authRouter.patch('/role', requireAuth, asyncHandler(authController.updateRole))
