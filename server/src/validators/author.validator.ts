import { z } from 'zod'

export const CreateAuthorInput = z.object({
  name: z.string().min(1).max(100),
  surname: z.string().min(1).max(100),
  patronymic: z.string().min(1).max(100).optional().nullable(),
  description: z.string().max(5000).optional().nullable(),
  birthYear: z
    .number()
    .int()
    .min(1000)
    .max(new Date().getFullYear())
    .optional()
    .nullable(),
})

export const UpdateAuthorInput = z.object({
  name: z.string().min(1).max(100).optional(),
  surname: z.string().min(1).max(100).optional(),
  patronymic: z.string().min(1).max(100).optional().nullable(),
  description: z.string().max(5000).optional().nullable(),
  birthYear: z
    .number()
    .int()
    .min(1000)
    .max(new Date().getFullYear())
    .optional()
    .nullable(),
})

export const GetAuthorsQueryInput = z.object({
  cursor: z.string().optional(),
  limit: z
    .string()
    .transform((val) => Math.min(parseInt(val) || 20, 100))
    .optional(),
  search: z.string().optional(),
})
