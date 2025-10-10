import { z } from 'zod'

export const CreateReservationInput = z.object({
  bookId: z.number().int().positive(),
  daysToReserve: z.number().int().min(1).max(30).default(14),
})

export const UpdateReservationStatusInput = z.object({
  status: z.enum(['active', 'completed', 'cancelled']),
})

export const GetReservationsQueryInput = z.object({
  cursor: z.string().optional(),
  limit: z
    .string()
    .transform((val) => Math.min(parseInt(val) || 20, 100))
    .optional(),
  status: z.enum(['active', 'completed', 'cancelled']).optional(),
  userId: z
    .string()
    .transform((val) => parseInt(val))
    .optional(),
  bookId: z
    .string()
    .transform((val) => parseInt(val))
    .optional(),
})
