import { Router } from 'express'
import * as reservationController from '../controllers/reservation.controller'
import { asyncHandler } from '../middleware/asyncHandler'
import { requireAuth } from '../middleware/authMiddleware'

export const reservationRouter = Router()

// Создание бронирования (требует авторизации)
reservationRouter.post(
  '/',
  requireAuth,
  asyncHandler(reservationController.createReservation)
)

// Получение моих бронирований
reservationRouter.get(
  '/my',
  requireAuth,
  asyncHandler(reservationController.getMyReservations)
)

// Получение всех бронирований (с фильтрами)
reservationRouter.get('/', asyncHandler(reservationController.getReservations))

// Проверка доступности книги
reservationRouter.get(
  '/check/:bookId',
  asyncHandler(reservationController.checkBookAvailability)
)

// Получение одного бронирования
reservationRouter.get(
  '/:id',
  asyncHandler(reservationController.getReservation)
)

// Обновление статуса бронирования
reservationRouter.patch(
  '/:id/status',
  requireAuth,
  asyncHandler(reservationController.updateReservationStatus)
)

// Отмена бронирования
reservationRouter.post(
  '/:id/cancel',
  requireAuth,
  asyncHandler(reservationController.cancelReservation)
)
