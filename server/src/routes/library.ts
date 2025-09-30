import { Router } from 'express'
import * as libraryController from '../controllers/library.controller'
import { asyncHandler } from '../middleware/asyncHandler'
import { requireAuth } from '../middleware/authMiddleware'

export const libraryRouter = Router()

libraryRouter.post(
  '/',
  requireAuth,
  asyncHandler(libraryController.createLibrary)
)

libraryRouter.get('/', asyncHandler(libraryController.getAllLibraries))

libraryRouter.get(
  '/my',
  requireAuth,
  asyncHandler(libraryController.getMyLibrary)
)

libraryRouter.get('/:id', asyncHandler(libraryController.getLibrary))
