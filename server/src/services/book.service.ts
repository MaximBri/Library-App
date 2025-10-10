import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function createBook(data: {
  name: string
  author: string
  isbn: string
  type: string
  theme: string
  publishingYear: number
  libraryId: number
}) {
  const library = await prisma.library.findUnique({
    where: { id: data.libraryId },
  })

  if (!library) {
    throw { status: 404, message: 'Library not found' }
  }

  const book = await prisma.book.create({
    data: {
      name: data.name,
      author: data.author,
      isbn: data.isbn,
      type: data.type,
      theme: data.theme,
      publishingYear: data.publishingYear,
      libraryId: data.libraryId,
    },
    include: {
      library: {
        select: {
          id: true,
          name: true,
          address: true,
        },
      },
    },
  })

  return book
}

export async function getBookById(id: number) {
  const book = await prisma.book.findUnique({
    where: { id },
    include: {
      library: {
        select: {
          id: true,
          name: true,
          address: true,
        },
      },
    },
  })

  if (!book) {
    throw { status: 404, message: 'Book not found' }
  }

  const activeReservation = await prisma.reservation.findFirst({
    where: {
      bookId: id,
      status: 'active',
    },
  })

  return {
    ...book,
    isReserved: !!activeReservation,
  }
}

export async function getBooks(params: {
  cursor?: number
  limit?: number
  libraryId?: number
}) {
  const { cursor, limit = 20, libraryId } = params

  const where = libraryId ? { libraryId } : {}

  const books = await prisma.book.findMany({
    where,
    take: limit + 1,
    ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
    orderBy: { id: 'asc' },
    include: {
      library: {
        select: {
          id: true,
          name: true,
          address: true,
        },
      },
    },
  })

  const hasMore = books.length > limit
  const items = hasMore ? books.slice(0, -1) : books

  const bookIds = items.map((book) => book.id)
  const activeReservations = await prisma.reservation.findMany({
    where: {
      bookId: { in: bookIds },
      status: 'active',
    },
    select: { bookId: true },
  })

  const reservedBookIds = new Set(activeReservations.map((res) => res.bookId))

  const itemsWithStatus = items.map((book) => ({
    ...book,
    isReserved: reservedBookIds.has(book.id),
  }))

  const nextCursor = hasMore ? items[items.length - 1].id : null

  return {
    items: itemsWithStatus,
    nextCursor,
    hasMore,
  }
}

export async function updateBook(
  id: number,
  data: {
    name?: string
    author?: string
    isbn?: string
    type?: string
    theme?: string
    publishingYear?: number
  }
) {
  const book = await prisma.book.findUnique({ where: { id } })

  if (!book) {
    throw { status: 404, message: 'Book not found' }
  }

  const updated = await prisma.book.update({
    where: { id },
    data,
    include: {
      library: {
        select: {
          id: true,
          name: true,
          address: true,
        },
      },
    },
  })

  return updated
}

export async function deleteBook(id: number) {
  const book = await prisma.book.findUnique({ where: { id } })

  if (!book) {
    throw { status: 404, message: 'Book not found' }
  }

  await prisma.book.delete({ where: { id } })

  return { message: 'Book deleted successfully' }
}

export async function getBooksByLibraryId(
  libraryId: number,
  params: { cursor?: number; limit?: number }
) {
  const { cursor, limit = 20 } = params

  const library = await prisma.library.findUnique({
    where: { id: libraryId },
    include: {
      librarian: {
        select: {
          id: true,
          email: true,
          name: true,
          surname: true,
        },
      },
    },
  })

  if (!library) {
    throw { status: 404, message: 'Library not found' }
  }

  const books = await prisma.book.findMany({
    where: { libraryId },
    take: limit + 1,
    ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
    orderBy: { id: 'asc' },
    include: {
      library: {
        select: {
          id: true,
          name: true,
          address: true,
        },
      },
    },
  })

  const hasMore = books.length > limit
  const items = hasMore ? books.slice(0, -1) : books

  const bookIds = items.map((book) => book.id)
  const activeReservations = await prisma.reservation.findMany({
    where: {
      bookId: { in: bookIds },
      status: 'active',
    },
    select: { bookId: true },
  })

  const reservedBookIds = new Set(activeReservations.map((res) => res.bookId))

  const itemsWithStatus = items.map((book) => ({
    ...book,
    isReserved: reservedBookIds.has(book.id),
  }))

  const nextCursor = hasMore ? items[items.length - 1].id : null

  return {
    library: {
      id: library.id,
      name: library.name,
      address: library.address,
      librarian: library.librarian,
    },
    items: itemsWithStatus,
    nextCursor,
    hasMore,
  }
}
