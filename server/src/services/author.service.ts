import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function createAuthor(data: {
  name: string
  surname: string
  patronymic?: string | null
  description?: string | null
  birthYear?: number | null
}) {
  const author = await prisma.author.create({
    data: {
      name: data.name,
      surname: data.surname,
      patronymic: data.patronymic,
      description: data.description,
      birthYear: data.birthYear,
    },
    include: {
      books: {
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

  return author
}

export async function getAuthorById(id: number) {
  const author = await prisma.author.findUnique({
    where: { id },
    include: {
      books: {
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

  if (!author) {
    throw { status: 404, message: 'Author not found' }
  }

  return author
}

export async function getAuthors(params: {
  cursor?: number
  limit?: number
  search?: string
}) {
  const { cursor, limit = 20, search } = params

  const where = search
    ? {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { surname: { contains: search, mode: 'insensitive' as const } },
          { patronymic: { contains: search, mode: 'insensitive' as const } },
        ],
      }
    : {}

  const authors = await prisma.author.findMany({
    where,
    take: limit + 1,
    ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
    orderBy: [{ surname: 'asc' }, { name: 'asc' }],
    include: {
      _count: {
        select: { books: true },
      },
    },
  })

  const hasMore = authors.length > limit
  const items = hasMore ? authors.slice(0, -1) : authors
  const nextCursor = hasMore ? items[items.length - 1].id : null

  return {
    items,
    nextCursor,
    hasMore,
  }
}

export async function updateAuthor(
  id: number,
  data: {
    name?: string
    surname?: string
    patronymic?: string | null
    description?: string | null
    birthYear?: number | null
  }
) {
  const author = await prisma.author.findUnique({ where: { id } })

  if (!author) {
    throw { status: 404, message: 'Author not found' }
  }

  const updated = await prisma.author.update({
    where: { id },
    data,
    include: {
      books: {
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

export async function deleteAuthor(id: number) {
  const author = await prisma.author.findUnique({
    where: { id },
    include: {
      _count: {
        select: { books: true },
      },
    },
  })

  if (!author) {
    throw { status: 404, message: 'Author not found' }
  }

  if (author._count.books > 0) {
    throw {
      status: 400,
      message: 'Cannot delete author with existing books',
    }
  }

  await prisma.author.delete({ where: { id } })

  return { message: 'Author deleted successfully' }
}
