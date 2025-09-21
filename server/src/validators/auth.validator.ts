import { z } from 'zod'

export const RegisterInput = z.object({
  email: z.string().min(5).email(),
  password: z.string().min(8).max(128),
})

export const LoginInput = z.object({
  email: z.string().min(5).email(),
  password: z.string().min(1),
})
