import { z } from 'zod'

export const RegisterInput = z.object({
  email: z.string().min(5).email(),
  password: z.string().min(4).max(128),
})

export const LoginInput = z.object({
  email: z.string().min(5).email(),
  password: z.string().min(1),
})

export const UpdateProfileInput = z.object({
  name: z.string().min(1).max(100).optional().nullable(),
  surname: z.string().min(1).max(100).optional().nullable(),
})

export const UpdateRoleInput = z.object({
  userId: z.number().int().positive(),
  role: z.enum(['user', 'admin', 'librarian']),
})
