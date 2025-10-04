import type z from 'zod';
import type { updateUserDataSchema } from './constants';

export type UpdateUserForm = z.infer<typeof updateUserDataSchema>;
