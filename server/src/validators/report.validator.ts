import { z } from 'zod'

export const ReportDateRangeInput = z.object({
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  status: z.enum(['pending', 'approved', 'rejected', 'returned']).optional(),
  libraryId: z.number().int().positive().optional(),
  sortBy: z.enum(['reservations', 'avg_days', 'percentage', 'created_at']).default('reservations'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
})

export const BookPopularityReportInput = ReportDateRangeInput.extend({
  theme: z.string().optional(),
  authorId: z.number().int().positive().optional(),
})

export const LibraryActivityReportInput = ReportDateRangeInput.extend({
  librarianId: z.number().int().positive().optional(),
})

export const UserActivityReportInput = ReportDateRangeInput.extend({
  role: z.enum(['user', 'admin', 'librarian']).optional(),
  userId: z.number().int().positive().optional(),
})

export type BookPopularityReportInput = z.infer<typeof BookPopularityReportInput>
export type LibraryActivityReportInput = z.infer<typeof LibraryActivityReportInput>
export type UserActivityReportInput = z.infer<typeof UserActivityReportInput>