import type z from 'zod';
import type { createLibrarySchema } from './constants';

export type CreateLibraryForm = z.infer<typeof createLibrarySchema>;
