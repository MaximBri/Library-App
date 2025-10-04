import type { UpdateUserForm } from '@/pages/lk/types';
import api from '../axios';
import type { UpdateUserRoleForm } from '@/features/change-role/types';
import { RolesMap } from '@/shared/constants';
import type { User } from '@/shared/hooks/useAuth';

export const userApi = {
  getUserData: async (): Promise<User> => {
    const { data } = await api.get('/api/auth/me');
    return data;
  },

  updateUserData: async (params: UpdateUserForm) => {
    const { data } = await api.patch('/api/auth/profile', params);
    return data;
  },

  updateUserRole: async ({ id, role }: UpdateUserRoleForm) => {
    const { data } = await api.patch('/api/auth/role', {
      userId: Number(id),
      role: Object.entries(RolesMap).find(
        ([, roleMap]) => roleMap === role
      )?.[0],
    });
    return data;
  },
};
