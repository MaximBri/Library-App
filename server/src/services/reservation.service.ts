import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function createReservation(data: {
  userId: number
  bookId: number
  daysToReserve: number
}) {
  const book = await prisma.book.findUnique({
    where: { id: data.bookId },
    include: { library: true },
  })

  if (!book) {
    throw { status: 404, message: 'Book not found' }
  }

  const activeReservation = await prisma.reservation.findFirst({
    where: {
      bookId: data.bookId,
      status: 'active',
    },
  })

  if (activeReservation) {
    throw { status: 400, message: 'Book is already reserved' }
  }

  const userActiveReservation = await prisma.reservation.findFirst({
    where: {
      userId: data.userId,
      bookId: data.bookId,
      status: 'active',
    },
  })

  if (userActiveReservation) {
    throw { status: 400, message: 'You already have an active reservation for this book' }
  }

  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + data.daysToReserve)

  const reservation = await prisma.reservation.create({
    data: {
      userId: data.userId,
      bookId: data.bookId,
      expiresAt,
      status: 'active',
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
            },
          },
        },
      },
    },
  })

  return reservation
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

  if (reservation.status !== 'active') {
    throw { status: 400, message: 'Only active reservations can be cancelled' }
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

export async function isBookAvailable(bookId: number) {
  const activeReservation = await prisma.reservation.findFirst({
    where: {
      bookId,
      status: 'active',
    },
  })

  return !activeReservation
}