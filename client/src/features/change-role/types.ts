import type z from 'zod';
import type { updateUserRoleSchema } from './constants';

export type UpdateUserRoleForm = z.infer<typeof updateUserRoleSchema>;
