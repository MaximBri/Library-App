import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function createReservation(data: {
  userId: number
  bookId: number
  requestedStartDate: Date
  requestedEndDate: Date
  userComment?: string
}) {
  const book = await prisma.book.findUnique({
    where: { id: data.bookId },
    include: { library: true },
  })

  if (!book) {
    throw { status: 404, message: 'Book not found' }
  }

  const existingReservation = await prisma.reservation.findFirst({
    where: {
      userId: data.userId,
      bookId: data.bookId,
      status: { in: ['pending', 'approved'] },
    },
  })

  if (existingReservation) {
    throw {
      status: 400,
      message:
        'You already have a pending or approved reservation for this book',
    }
  }

  const conflictingReservations = await prisma.reservation.findMany({
    where: {
      bookId: data.bookId,
      status: 'approved',
      OR: [
        {
          AND: [
            { requestedStartDate: { lte: data.requestedStartDate } },
            { requestedEndDate: { gte: data.requestedStartDate } },
          ],
        },
        {
          AND: [
            { requestedStartDate: { lte: data.requestedEndDate } },
            { requestedEndDate: { gte: data.requestedEndDate } },
          ],
        },
        {
          AND: [
            { requestedStartDate: { gte: data.requestedStartDate } },
            { requestedEndDate: { lte: data.requestedEndDate } },
          ],
        },
      ],
    },
  })

  if (conflictingReservations.length > 0) {
    throw {
      status: 400,
      message: 'Book is already reserved for the requested period',
    }
  }

  const reservation = await prisma.reservation.create({
    data: {
      userId: data.userId,
      bookId: data.bookId,
      requestedStartDate: data.requestedStartDate,
      requestedEndDate: data.requestedEndDate,
      userComment: data.userComment,
      status: 'pending',
    },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
          surname: true,
        },
      },
      book: {
        include: {
          library: {
            select: {
              id: true,
              name: true,
              address: true,
              librarianId: true,
            },
          },
        },
      },
    },
  })

  return reservation
}

export async function reviewReservation(
  reservationId: number,
  librarianId: number,
  status: 'approved' | 'rejected' | 'completed',
  librarianComment?: string
) {
  const reservation = await prisma.reservation.findUnique({
    where: { id: reservationId },
    include: {
      book: {
        include: {
          library: true,
        },
      },
    },
  })

  if (!reservation) {
    throw { status: 404, message: 'Reservation not found' }
  }

  if (reservation.book.library.librarianId !== librarianId) {
    throw {
      status: 403,
      message: 'You can only review reservations for your library',
    }
  }

  // Правила изменения статусов
  if (status === 'approved') {
    if (reservation.status !== 'pending') {
      throw {
        status: 400,
        message: 'Only pending reservations can be approved',
      }
    }

    const conflictingReservations = await prisma.reservation.findMany({
      where: {
        bookId: reservation.bookId,
        status: 'approved',
        id: { not: reservationId },
        OR: [
          {
            AND: [
              { requestedStartDate: { lte: reservation.requestedStartDate } },
              { requestedEndDate: { gte: reservation.requestedStartDate } },
            ],
          },
          {
            AND: [
              { requestedStartDate: { lte: reservation.requestedEndDate } },
              { requestedEndDate: { gte: reservation.requestedEndDate } },
            ],
          },
          {
            AND: [
              { requestedStartDate: { gte: reservation.requestedStartDate } },
              { requestedEndDate: { lte: reservation.requestedEndDate } },
            ],
          },
        ],
      },
    })

    if (conflictingReservations.length > 0) {
      throw {
        status: 400,
        message: 'Cannot approve: book is already reserved for this period',
      }
    }
  } else if (status === 'rejected') {
    if (reservation.status !== 'pending') {
      throw {
        status: 400,
        message: 'Only pending reservations can be rejected',
      }
    }
  } else if (status === 'completed') {
    if (reservation.status !== 'approved') {
      throw {
        status: 400,
        message: 'Only approved reservations can be marked as completed',
      }
    }
  }

  const updateData: any = {
    status,
    librarianComment,
    reviewedAt: new Date(),
  }

  if (status === 'completed') {
    updateData.returnedAt = new Date()
  }

  const updated = await prisma.reservation.update({
    where: { id: reservationId },
    data: updateData,
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
          surname: true,
        },
      },
      book: {
        include: {
          library: {
            select: {
              id: true,
              name: true,
              address: true,
            },
          },
        },
      },
    },
  })

  return updated
}

export async function getReservationById(id: number) {
  const reservation = await prisma.reservation.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
          surname: true,
        },
      },
      book: {
        include: {
          library: {
            select: {
              id: true,
              name: true,
              address: true,
            },
          },
        },
      },
    },
  })

  if (!reservation) {
    throw { status: 404, message: 'Reservation not found' }
  }

  return reservation
}

export async function getReservations(params: {
  cursor?: number
  limit?: number
  status?: string
  userId?: number
  bookId?: number
}) {
  const { cursor, limit = 20, status, userId, bookId } = params

  const where: any = {}
  if (status) where.status = status
  if (userId) where.userId = userId
  if (bookId) where.bookId = bookId

  const reservations = await prisma.reservation.findMany({
    where,
    take: limit + 1,
    ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
    orderBy: { id: 'desc' },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
          surname: true,
        },
      },
      book: {
        include: {
          library: {
            select: {
              id: true,
              name: true,
              address: true,
            },
          },
        },
      },
    },
  })

  const hasMore = reservations.length > limit
  const items = hasMore ? reservations.slice(0, -1) : reservations
  const nextCursor = hasMore ? items[items.length - 1].id : null

  return {
    items,
    nextCursor,
    hasMore,
  }
}

export async function getUserReservations(
  userId: number,
  params: { cursor?: number; limit?: number; status?: string }
) {
  const { cursor, limit = 20, status } = params

  const where: any = { userId }
  if (status) where.status = status

  const reservations = await prisma.reservation.findMany({
    where,
    take: limit + 1,
    ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
    orderBy: { id: 'desc' },
    include: {
      book: {
        include: {
          library: {
            select: {
              id: true,
              name: true,
              address: true,
            },
          },
        },
      },
    },
  })

  const hasMore = reservations.length > limit
  const items = hasMore ? reservations.slice(0, -1) : reservations
  const nextCursor = hasMore ? items[items.length - 1].id : null

  return {
    items,
    nextCursor,
    hasMore,
  }
}

export async function getLibraryReservations(
  librarianId: number,
  params: { cursor?: number; limit?: number; status?: string }
) {
  const { cursor, limit = 20, status } = params

  const library = await prisma.library.findUnique({
    where: { librarianId },
  })

  if (!library) {
    throw { status: 404, message: 'Library not found for this librarian' }
  }

  const where: any = {
    book: {
      libraryId: library.id,
    },
  }
  if (status) where.status = status

  const reservations = await prisma.reservation.findMany({
    where,
    take: limit + 1,
    ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
    orderBy: { id: 'desc' },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
          surname: true,
        },
      },
      book: {
        include: {
          library: {
            select: {
              id: true,
              name: true,
              address: true,
            },
          },
        },
      },
    },
  })

  const hasMore = reservations.length > limit
  const items = hasMore ? reservations.slice(0, -1) : reservations
  const nextCursor = hasMore ? items[items.length - 1].id : null

  return {
    items,
    nextCursor,
    hasMore,
  }
}

export async function updateReservationStatus(
  id: number,
  status: string,
  userId?: number
) {
  const reservation = await prisma.reservation.findUnique({
    where: { id },
  })

  if (!reservation) {
    throw { status: 404, message: 'Reservation not found' }
  }

  if (userId && reservation.userId !== userId) {
    throw { status: 403, message: 'You can only update your own reservations' }
  }

  const updateData: any = { status }

  if (status === 'completed') {
    updateData.returnedAt = new Date()
  }

  const updated = await prisma.reservation.update({
    where: { id },
    data: updateData,
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
          surname: true,
        },
      },
      book: {
        include: {
          library: {
            select: {
              id: true,
              name: true,
              address: true,
            },
          },
        },
      },
    },
  })

  return updated
}

export async function cancelReservation(id: number, userId: number) {
  const reservation = await prisma.reservation.findUnique({
    where: { id },
  })

  if (!reservation) {
    throw { status: 404, message: 'Reservation not found' }
  }

  if (reservation.userId !== userId) {
    throw { status: 403, message: 'You can only cancel your own reservations' }
  }

  if (!['pending', 'approved'].includes(reservation.status)) {
    throw {
      status: 400,
      message: 'Only pending or approved reservations can be cancelled',
    }
  }

  const updated = await prisma.reservation.update({
    where: { id },
    data: { status: 'cancelled' },
    include: {
      book: {
        include: {
          library: {
            select: {
              id: true,
              name: true,
              address: true,
            },
          },
        },
      },
    },
  })

  return updated
}

export async function isBookAvailable(
  bookId: number,
  startDate: Date,
  endDate: Date
) {
  const conflictingReservations = await prisma.reservation.findMany({
    where: {
      bookId,
      status: 'approved',
      OR: [
        {
          AND: [
            { requestedStartDate: { lte: startDate } },
            { requestedEndDate: { gte: startDate } },
          ],
        },
        {
          AND: [
            { requestedStartDate: { lte: endDate } },
            { requestedEndDate: { gte: endDate } },
          ],
        },
        {
          AND: [
            { requestedStartDate: { gte: startDate } },
            { requestedEndDate: { lte: endDate } },
          ],
        },
      ],
    },
  })

  return conflictingReservations.length === 0
}
