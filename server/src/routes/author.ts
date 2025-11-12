import { Router } from 'express'
import * as authorController from '../controllers/author.controller'
import { asyncHandler } from '../middleware/asyncHandler'
import { requireAuth } from '../middleware/authMiddleware'

export const authorRouter = Router()

// Создание автора (требует авторизации)
authorRouter.post('/', requireAuth, asyncHandler(authorController.createAuthor))

// Получение всех авторов с пагинацией и поиском
authorRouter.get('/', asyncHandler(authorController.getAuthors))

// Получение одного автора
authorRouter.get('/:id', asyncHandler(authorController.getAuthor))

// Обновление автора (требует авторизации)
authorRouter.patch('/:id', requireAuth, asyncHandler(authorController.updateAuthor))

// Удаление автора (требует авторизации)
authorRouter.delete('/:id', requireAuth, asyncHandler(authorController.deleteAuthor))