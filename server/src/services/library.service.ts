import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function createLibrary(data: {
  name: string
  address: string
  librarianId: number
}) {
  // Проверяем, что пользователь существует и имеет роль librarian
  const user = await prisma.user.findUnique({
    where: { id: data.librarianId },
  })

  if (!user) {
    throw { status: 404, message: 'User not found' }
  }

  if (user.role !== 'librarian') {
    throw { status: 400, message: 'User must have librarian role' }
  }

  // Проверяем, что у библиотекаря еще нет библиотеки
  const existingLibrary = await prisma.library.findUnique({
    where: { librarianId: data.librarianId },
  })

  if (existingLibrary) {
    throw { status: 400, message: 'This librarian already has a library' }
  }

  const library = await prisma.library.create({
    data: {
      name: data.name,
      address: data.address,
      librarianId: data.librarianId,
    },
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

  return library
}

export async function getLibraryById(id: number) {
  const library = await prisma.library.findUnique({
    where: { id },
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

  return library
}

export async function getAllLibraries() {
  const libraries = await prisma.library.findMany({
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
    orderBy: {
      createdAt: 'desc',
    },
  })

  return libraries
}

export async function getLibraryByLibrarianId(librarianId: number) {
  const library = await prisma.library.findUnique({
    where: { librarianId },
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

  return library
}
