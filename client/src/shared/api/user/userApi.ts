import type { UpdateUserForm } from '@/pages/lk/types';
import api from '../axios';

export const userApi = {
  getUserData: async () => {
    const { data } = await api.get('/api/auth/me');
    return { data };
  },
  updateUserData: async (params: UpdateUserForm) => {
    const { data } = await api.patch('/api/auth/profile', params);
    return data;
  },
};
