import { z } from 'zod'

export const CreateLibraryInput = z.object({
  name: z.string().min(1).max(200),
  address: z.string().min(1).max(500),
  librarianId: z.number().int().positive(),
})
