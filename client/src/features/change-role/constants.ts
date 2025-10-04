import { RolesMap } from '@/shared/constants';
import z from 'zod';

export const updateUserRoleSchema = z.object({
  id: z.string(),
  role: z.enum(Object.values(RolesMap)),
});
