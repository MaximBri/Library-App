import { z } from 'zod'

export const CreateReservationInput = z
  .object({
    bookId: z.number().int().positive(),
    requestedStartDate: z.string().refine(
      (date) => {
        const d = new Date(date)
        return (
          !isNaN(d.getTime()) && d >= new Date(new Date().setHours(0, 0, 0, 0))
        )
      },
      { message: 'Start date must be valid and not in the past' }
    ),
    requestedEndDate: z.string().refine(
      (date) => {
        const d = new Date(date)
        return !isNaN(d.getTime())
      },
      { message: 'End date must be valid' }
    ),
    userComment: z.string().max(1000).optional(),
  })
  .refine(
    (data) => {
      const start = new Date(data.requestedStartDate)
      const end = new Date(data.requestedEndDate)
      return end > start
    },
    {
      message: 'End date must be after start date',
      path: ['requestedEndDate'],
    }
  )

export const ReviewReservationInput = z.object({
  status: z.enum(['approved', 'rejected', 'completed']),
  librarianComment: z.string().max(1000).optional(),
})

export const UpdateReservationStatusInput = z.object({
  status: z.enum(['pending', 'approved', 'rejected', 'completed', 'cancelled']),
})

export const GetReservationsQueryInput = z.object({
  cursor: z.string().optional(),
  limit: z
    .string()
    .transform((val) => Math.min(parseInt(val) || 20, 100))
    .optional(),
  status: z
    .enum(['pending', 'approved', 'rejected', 'completed', 'cancelled'])
    .optional(),
  userId: z
    .string()
    .transform((val) => parseInt(val))
    .optional(),
  bookId: z
    .string()
    .transform((val) => parseInt(val))
    .optional(),
})
