import { z } from 'zod'

export const CreateBookInput = z.object({
  name: z.string().min(1).max(500),
  authorId: z.number().int().positive(),
  isbn: z.string().min(1).max(50),
  type: z.enum(['book', 'magazine', 'newspaper', 'journal', 'other']),
  theme: z.string().min(1).max(200),
  publishingYear: z
    .number()
    .int()
    .min(1000)
    .max(new Date().getFullYear() + 1),
  libraryId: z.number().int().positive(),
})

export const UpdateBookInput = z.object({
  name: z.string().min(1).max(500).optional(),
  authorId: z.number().int().positive().optional(),
  isbn: z.string().min(1).max(50).optional(),
  type: z
    .enum(['book', 'magazine', 'newspaper', 'journal', 'other'])
    .optional(),
  theme: z.string().min(1).max(200).optional(),
  publishingYear: z
    .number()
    .int()
    .min(1000)
    .max(new Date().getFullYear() + 1)
    .optional(),
})

export const GetBooksQueryInput = z.object({
  cursor: z.string().optional(),
  limit: z
    .string()
    .transform((val) => Math.min(parseInt(val) || 20, 100))
    .optional(),
  libraryId: z
    .string()
    .transform((val) => parseInt(val))
    .optional(),
})
