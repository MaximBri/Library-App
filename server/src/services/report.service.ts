import { PrismaClient } from '@prisma/client'
import {
  BookPopularityReportInput,
  LibraryActivityReportInput,
  UserActivityReportInput,
} from '../validators/report.validator'

const prisma = new PrismaClient()

export async function getBookPopularityReport(
  params: BookPopularityReportInput
) {
  const {
    startDate,
    endDate,
    status,
    libraryId,
    authorId,
    theme,
    sortBy,
    sortOrder,
  } = params

  const reservationWhere: any = {
    createdAt: {
      gte: new Date(startDate),
      lte: new Date(endDate),
    },
  }

  if (status) reservationWhere.status = status
  if (libraryId) reservationWhere.book = { libraryId }

  const bookWhere: any = {}
  if (authorId) bookWhere.authorId = authorId
  if (theme) bookWhere.theme = { contains: theme, mode: 'insensitive' as const }

  const totalReservations = await prisma.reservation.count({
    where: reservationWhere,
  })

  const books = await prisma.book.findMany({
    where: bookWhere,
    include: {
      author: true,
      library: true,
      Reservation: true,
    },
    orderBy: getBookPopularityOrderBy(sortBy, sortOrder),
  })

  const report = books.map((book) => {
    const reservations = book.Reservation
    const totalBookReservations = reservations.length
    const completedRentals = reservations.filter(
      (r) => r.status === 'returned'
    ).length
    const avgRentalDays = calculateAvgRentalDays(reservations)

    return {
      authorId: book.authorId,
      authorName: `${book.author.surname} ${book.author.name}`,
      bookId: book.id,
      bookTitle: book.name,
      bookTheme: book.theme,
      libraryName: book.library.name,
      totalReservations: totalBookReservations,
      completedRentals: completedRentals,
      avgRentalDays: avgRentalDays,
      percentageOfTotal:
        totalReservations > 0
          ? (totalBookReservations / totalReservations) * 100
          : 0,
      reservations: reservations.map((r) => ({
        id: r.id,
        userId: r.userId,
        status: r.status,
        startDate: r.requestedStartDate,
        endDate: r.requestedEndDate,
      })),
    }
  })

  const summary = {
    totalBooks: report.length,
    totalReservations,
    avgReservationsPerBook: totalReservations / (report.length || 1),
    mostPopularTheme: findMostPopularTheme(books),
    period: {
      start: startDate,
      end: endDate,
    },
  }

  return {
    data: report,
    summary,
  }
}

export async function getLibraryActivityReport(
  params: LibraryActivityReportInput
) {
  const {
    startDate,
    endDate,
    status,
    libraryId,
    librarianId,
    sortBy,
    sortOrder,
  } = params

  const libraryWhere: any = {}
  if (libraryId) libraryWhere.id = libraryId
  if (librarianId) libraryWhere.librarianId = librarianId

  const reservationWhere: any = {
    createdAt: {
      gte: new Date(startDate),
      lte: new Date(endDate),
    },
  }
  if (status) reservationWhere.status = status

  const libraries = await prisma.library.findMany({
    where: libraryWhere,
    include: {
      librarian: {
        select: {
          name: true,
          surname: true,
          email: true,
        },
      },
      books: {
        include: {
          author: true,
          Reservation: {
            where: reservationWhere,
            include: {
              user: {
                select: {
                  name: true,
                  surname: true,
                },
              },
            },
          },
        },
      },
    },
    orderBy: getLibraryActivityOrderBy(sortBy, sortOrder),
  })

  const report = libraries.map((library) => {
    const allReservations = library.books.flatMap((book) => book.Reservation)
    const uniqueUsers = new Set(allReservations.map((r) => r.userId)).size
    const themes = library.books.reduce(
      (acc: { [theme: string]: number }, book) => {
        acc[book.theme] = (acc[book.theme] || 0) + book.Reservation.length
        return acc
      },
      {}
    )
    const mostPopularTheme = Object.keys(themes).reduce(
      (a, b) => (themes[a] > themes[b] ? a : b),
      ''
    )

    const totalBooks = library.books.length
    const totalReservations = allReservations.length
    const completedRentals = allReservations.filter(
      (r) => r.status === 'returned'
    ).length
    const avgRentalTime = calculateAvgRentalDays(allReservations)

    return {
      libraryId: library.id,
      libraryName: library.name,
      libraryAddress: library.address,
      librarianName:
        library.librarian.name && library.librarian.surname
          ? `${library.librarian.name} ${library.librarian.surname}`
          : 'Unknown',
      totalBooks: totalBooks,
      totalReservations: totalReservations,
      uniqueUsers: uniqueUsers,
      mostPopularTheme: mostPopularTheme,
      avgRentalTime: avgRentalTime,
      reservationToBookRatio:
        totalBooks > 0 ? totalReservations / totalBooks : 0,
      completionRate:
        totalReservations > 0
          ? (completedRentals / totalReservations) * 100
          : 0,
    }
  })

  const summary = {
    totalLibraries: report.length,
    totalBooks: report.reduce((sum, lib) => sum + lib.totalBooks, 0),
    totalReservations: report.reduce(
      (sum, lib) => sum + lib.totalReservations,
      0
    ),
    avgRentalTime:
      report.reduce((sum, lib) => sum + lib.avgRentalTime, 0) /
      (report.length || 1),
    mostActiveLibrary: report.reduce(
      (max, lib) => (lib.totalReservations > max.totalReservations ? lib : max),
      report[0] || null
    ),
  }

  return {
    data: report,
    summary,
  }
}

export async function getUserActivityReport(params: UserActivityReportInput) {
  const { startDate, endDate, status, role, userId, sortBy, sortOrder } = params

  const userWhere: any = {}
  if (role) userWhere.role = role
  if (userId) userWhere.id = userId

  const reservationWhere: any = {
    createdAt: {
      gte: new Date(startDate),
      lte: new Date(endDate),
    },
  }
  if (status) reservationWhere.status = status

  const users = await prisma.user.findMany({
    where: userWhere,
    include: {
      Reservation: {
        where: reservationWhere,
        include: {
          book: {
            include: {
              author: true,
            },
          },
        },
      },
    },
    orderBy: getUserActivityOrderBy(sortBy, sortOrder),
  })

  const totalReservationsInPeriod = await prisma.reservation.count({
    where: reservationWhere,
  })

  const report = users.map((user) => {
    const reservations = user.Reservation
    const totalUserReservations = reservations.length
    const uniqueBooks = new Set(reservations.map((r) => r.bookId)).size
    const uniqueAuthors = new Set(reservations.map((r) => r.book.authorId)).size

    const themes = reservations.reduce(
      (acc: { [theme: string]: number }, r) => {
        acc[r.book.theme] = (acc[r.book.theme] || 0) + 1
        return acc
      },
      {}
    )
    const favoriteTheme = Object.keys(themes).reduce(
      (a, b) => (themes[a] > themes[b] ? a : b),
      ''
    )

    const successfulReturns = reservations.filter(
      (r) => r.status === 'returned'
    ).length
    const avgRentalDays = calculateAvgRentalDays(reservations)

    return {
      userId: user.id,
      userName:
        user.name && user.surname ? `${user.name} ${user.surname}` : 'Unknown',
      userEmail: user.email,
      userRole: user.role,
      totalReservations: totalUserReservations,
      uniqueBooksRented: uniqueBooks,
      uniqueAuthorsRead: uniqueAuthors,
      favoriteTheme: favoriteTheme,
      avgRentalDays: avgRentalDays,
      successfulReturns: successfulReturns,
      activityPercentage:
        totalReservationsInPeriod > 0
          ? (totalUserReservations / totalReservationsInPeriod) * 100
          : 0,
      successRate:
        totalUserReservations > 0
          ? (successfulReturns / totalUserReservations) * 100
          : 0,
    }
  })

  const summary = {
    totalUsers: report.length,
    totalReservations: report.reduce(
      (sum, user) => sum + user.totalReservations,
      0
    ),
    avgReservationsPerUser:
      report.reduce((sum, user) => sum + user.totalReservations, 0) /
      (report.length || 1),
    mostActiveUser: report.reduce(
      (max, user) =>
        user.totalReservations > max.totalReservations ? user : max,
      report[0] || null
    ),
    avgSuccessRate:
      report.reduce((sum, user) => sum + user.successRate, 0) /
      (report.length || 1),
  }

  return {
    data: report,
    summary,
  }
}

function calculateAvgRentalDays(reservations: any[]): number {
  const validReservations = reservations.filter(
    (r) => r.status === 'returned' && r.returnedAt && r.requestedStartDate
  )

  if (validReservations.length === 0) return 0

  const totalDays = validReservations.reduce((sum, r) => {
    const days = Math.ceil(
      (new Date(r.returnedAt).getTime() -
        new Date(r.requestedStartDate).getTime()) /
        (1000 * 60 * 60 * 24)
    )
    return sum + days
  }, 0)

  return totalDays / validReservations.length
}

function findMostPopularTheme(books: any[]): string {
  const themeCounts = books.reduce((acc: { [theme: string]: number }, book) => {
    acc[book.theme] = (acc[book.theme] || 0) + book.Reservation.length
    return acc
  }, {})

  return Object.keys(themeCounts).reduce(
    (a, b) => (themeCounts[a] > themeCounts[b] ? a : b),
    ''
  )
}

function getBookPopularityOrderBy(sortBy: string, sortOrder: string) {
  const orderBy: any = {}

  switch (sortBy) {
    case 'reservations':
      orderBy.Reservation = { _count: sortOrder }
      break
    case 'avg_days':
      orderBy.Reservation = { _count: sortOrder }
      break
    case 'percentage':
      orderBy.Reservation = { _count: sortOrder }
      break
    case 'created_at':
      orderBy.createdAt = sortOrder
      break
    default:
      orderBy.Reservation = { _count: 'desc' }
  }

  return orderBy
}

function getLibraryActivityOrderBy(sortBy: string, sortOrder: string) {
  const orderBy: any = {}

  switch (sortBy) {
    case 'reservations':
      orderBy.books = { Reservation: { _count: sortOrder } }
      break
    case 'avg_days':
      orderBy.books = { _count: sortOrder }
      break
    default:
      orderBy.name = sortOrder
  }

  return orderBy
}

function getUserActivityOrderBy(sortBy: string, sortOrder: string) {
  const orderBy: any = {}

  switch (sortBy) {
    case 'reservations':
      orderBy.Reservation = { _count: sortOrder }
      break
    case 'avg_days':
      orderBy.Reservation = { _count: sortOrder }
      break
    case 'percentage':
      orderBy.Reservation = { _count: sortOrder }
      break
    default:
      orderBy.createdAt = sortOrder
  }

  return orderBy
}
