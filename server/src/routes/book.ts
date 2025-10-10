import { Router } from 'express'
import * as bookController from '../controllers/book.controller'
import { asyncHandler } from '../middleware/asyncHandler'
import { requireAuth } from '../middleware/authMiddleware'

export const bookRouter = Router()

// Создание книги (требует авторизации)
bookRouter.post('/', requireAuth, asyncHandler(bookController.createBook))

// Получение всех книг с пагинацией
bookRouter.get('/', asyncHandler(bookController.getBooks))

// Получение книг конкретной библиотеки с пагинацией
bookRouter.get(
  '/library/:libraryId',
  asyncHandler(bookController.getBooksByLibrary)
)

// Получение одной книги
bookRouter.get('/:id', asyncHandler(bookController.getBook))

// Обновление книги (требует авторизации)
bookRouter.patch('/:id', requireAuth, asyncHandler(bookController.updateBook))

// Удаление книги (требует авторизации)
bookRouter.delete('/:id', requireAuth, asyncHandler(bookController.deleteBook))