import { Router } from 'express'
import * as reportController from '../controllers/report.controller'
import { asyncHandler } from '../middleware/asyncHandler'
import { requireAuth } from '../middleware/authMiddleware'

export const reportRouter = Router()

// Все отчеты требуют авторизации
reportRouter.get('/book-popularity', requireAuth, asyncHandler(reportController.getBookPopularityReport))
reportRouter.get('/library-activity', requireAuth, asyncHandler(reportController.getLibraryActivityReport))
reportRouter.get('/user-activity', requireAuth, asyncHandler(reportController.getUserActivityReport))