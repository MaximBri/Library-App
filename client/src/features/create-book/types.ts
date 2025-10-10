import type z from 'zod';
import type { CreateBookSchema } from './constants';

export type CreateBookForm = z.infer<typeof CreateBookSchema>;

export interface CreateBookModel extends CreateBookForm {
  libraryId: number;
}