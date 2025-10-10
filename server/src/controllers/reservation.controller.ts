import { Request, Response } from 'express'
import * as reservationService from '../services/reservation.service'
import {
  CreateReservationInput,
  UpdateReservationStatusInput,
  GetReservationsQueryInput,
} from '../validators/reservation.validator'

export const createReservation = async (req: Request, res: Response) => {
  const data = CreateReservationInput.parse(req.body)
  const userId = (req as any).userId

  const reservation = await reservationService.createReservation({
    userId,
    bookId: data.bookId,
    daysToReserve: data.daysToReserve || 14,
  })

  res.status(201).json(reservation)
}

export const getReservation = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10)

  if (isNaN(id)) {
    return res.status(400).json({ message: 'Invalid reservation ID' })
  }

  const reservation = await reservationService.getReservationById(id)
  res.json(reservation)
}

export const getReservations = async (req: Request, res: Response) => {
  const query = GetReservationsQueryInput.parse(req.query)

  const reservations = await reservationService.getReservations({
    cursor: query.cursor ? parseInt(query.cursor) : undefined,
    limit: query.limit,
    status: query.status,
    userId: query.userId,
    bookId: query.bookId,
  })

  res.json(reservations)
}

export const getMyReservations = async (req: Request, res: Response) => {
  const userId = (req as any).userId
  const query = GetReservationsQueryInput.parse(req.query)

  const reservations = await reservationService.getUserReservations(userId, {
    cursor: query.cursor ? parseInt(query.cursor) : undefined,
    limit: query.limit,
    status: query.status,
  })

  res.json(reservations)
}

export const updateReservationStatus = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10)
  const userId = (req as any).userId
  const userRole = (req as any).userRole

  if (isNaN(id)) {
    return res.status(400).json({ message: 'Invalid reservation ID' })
  }

  const data = UpdateReservationStatusInput.parse(req.body)

  const reservation = await reservationService.updateReservationStatus(
    id,
    data.status,
    userRole === 'admin' ? undefined : userId
  )

  res.json(reservation)
}

export const cancelReservation = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10)
  const userId = (req as any).userId

  if (isNaN(id)) {
    return res.status(400).json({ message: 'Invalid reservation ID' })
  }

  const reservation = await reservationService.cancelReservation(id, userId)
  res.json(reservation)
}

export const checkBookAvailability = async (req: Request, res: Response) => {
  const bookId = parseInt(req.params.bookId, 10)

  if (isNaN(bookId)) {
    return res.status(400).json({ message: 'Invalid book ID' })
  }

  const available = await reservationService.isBookAvailable(bookId)
  res.json({ available })
}