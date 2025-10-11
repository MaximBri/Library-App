import { z } from 'zod';

export const createReservationSchema = z
  .object({
    bookId: z
      .number({
        error: 'ID книги должен быть числом',
      })
      .int()
      .positive('ID книги должен быть положительным числом'),

    requestedStartDate: z
      .string({
        error: 'Дата начала должна быть строкой',
      })
      .min(1, 'Дата начала бронирования обязательна')
      .refine(
        (date) => {
          const d = new Date(date);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return !isNaN(d.getTime()) && d >= today;
        },
        {
          message: 'Дата начала должна быть корректной и не в прошлом',
        }
      ),

    requestedEndDate: z
      .string({
        error: 'Дата окончания должна быть строкой',
      })
      .min(1, 'Дата окончания бронирования обязательна')
      .refine(
        (date) => {
          const d = new Date(date);
          return !isNaN(d.getTime());
        },
        {
          message: 'Дата окончания должна быть корректной',
        }
      ),

    userComment: z
      .string()
      .max(1000, 'Комментарий не должен превышать 1000 символов')
      .optional()
      .or(z.literal('')),
  })
  .refine(
    (data) => {
      const start = new Date(data.requestedStartDate);
      const end = new Date(data.requestedEndDate);
      return end > start;
    },
    {
      message: 'Дата окончания должна быть позже даты начала',
      path: ['requestedEndDate'],
    }
  );

export const reservationResponseSchema = z.object({
  id: z.number(),
  userId: z.number(),
  bookId: z.number(),
  status: z.enum(['pending', 'approved', 'rejected', 'completed', 'cancelled']),
  requestedStartDate: z.string().or(z.date()),
  requestedEndDate: z.string().or(z.date()),
  userComment: z.string().nullable(),
  librarianComment: z.string().nullable(),
  reviewedAt: z.string().or(z.date()).nullable(),
  returnedAt: z.string().or(z.date()).nullable(),
  createdAt: z.string().or(z.date()),
  updatedAt: z.string().or(z.date()),
  user: z
    .object({
      id: z.number(),
      email: z.string(),
      name: z.string().nullable(),
      surname: z.string().nullable(),
    })
    .optional(),
  book: z.object({
    id: z.number(),
    name: z.string(),
    author: z.string(),
    isbn: z.string(),
    type: z.string(),
    theme: z.string(),
    publishingYear: z.number(),
    libraryId: z.number(),
    library: z.object({
      id: z.number(),
      name: z.string(),
      address: z.string(),
    }),
  }),
});

export type ReservationResponse = z.infer<typeof reservationResponseSchema>;

export const reviewReservationSchema = z.object({
  status: z.enum(['approved', 'rejected']),
  librarianComment: z
    .string()
    .max(1000, 'Комментарий не должен превышать 1000 символов')
    .optional()
    .or(z.literal('')),
});

export type ReviewReservationInput = z.infer<typeof reviewReservationSchema>;

export const updateReservationStatusSchema = z.object({
  status: z.enum(['pending', 'approved', 'rejected', 'completed', 'cancelled']),
});

export type UpdateReservationStatusInput = z.infer<
  typeof updateReservationStatusSchema
>;

export const getReservationsQuerySchema = z.object({
  cursor: z.string().optional(),
  limit: z.number().min(1).max(100).default(20).optional(),
  status: z
    .enum(['pending', 'approved', 'rejected', 'completed', 'cancelled'])
    .optional(),
  userId: z.number().optional(),
  bookId: z.number().optional(),
});

export type GetReservationsQuery = z.infer<typeof getReservationsQuerySchema>;

export const reservationsListResponseSchema = z.object({
  items: z.array(reservationResponseSchema),
  nextCursor: z.number().nullable(),
  hasMore: z.boolean(),
});

export type ReservationsListResponse = z.infer<
  typeof reservationsListResponseSchema
>;

export const checkBookAvailabilityQuerySchema = z
  .object({
    startDate: z.string().refine(
      (date) => {
        const d = new Date(date);
        return !isNaN(d.getTime());
      },
      { message: 'Некорректная дата начала' }
    ),
    endDate: z.string().refine(
      (date) => {
        const d = new Date(date);
        return !isNaN(d.getTime());
      },
      { message: 'Некорректная дата окончания' }
    ),
  })
  .refine(
    (data) => {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      return end > start;
    },
    {
      message: 'Дата окончания должна быть позже даты начала',
      path: ['endDate'],
    }
  );

export type CheckBookAvailabilityQuery = z.infer<
  typeof checkBookAvailabilityQuerySchema
>;

export const bookAvailabilityResponseSchema = z.object({
  available: z.boolean(),
});

export type BookAvailabilityResponse = z.infer<
  typeof bookAvailabilityResponseSchema
>;

export const ReservationStatus = {
  PENDING: 'pending' as const,
  APPROVED: 'approved' as const,
  REJECTED: 'rejected' as const,
  COMPLETED: 'completed' as const,
  CANCELLED: 'cancelled' as const,
};

export type ReservationStatusType =
  (typeof ReservationStatus)[keyof typeof ReservationStatus];

export const cancelReservationSchema = z.object({
  reason: z
    .string()
    .max(500, 'Причина не должна превышать 500 символов')
    .optional(),
});

export type CancelReservationInput = z.infer<typeof cancelReservationSchema>;

export const dateHelpers = {
  formatDateForInput: (date: Date | string): string => {
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  },

  getMinDate: (): string => {
    return dateHelpers.formatDateForInput(new Date());
  },

  addDays: (date: Date | string, days: number): Date => {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
  },

  isFutureDate: (date: Date | string): boolean => {
    const d = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return d >= today;
  },

  datesOverlap: (
    start1: Date | string,
    end1: Date | string,
    start2: Date | string,
    end2: Date | string
  ): boolean => {
    const s1 = new Date(start1);
    const e1 = new Date(end1);
    const s2 = new Date(start2);
    const e2 = new Date(end2);

    return s1 <= e2 && s2 <= e1;
  },

  formatDateForDisplay: (date: Date | string): string => {
    const d = new Date(date);
    return d.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  },
};

