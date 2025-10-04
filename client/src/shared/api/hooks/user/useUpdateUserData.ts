import { useMutation } from '@tanstack/react-query';
import { userApi } from '../../user/userApi';
import type { UpdateUserForm } from '@/pages/lk/types';

export const useUpdateUserData = () => {
  return useMutation({
    mutationFn: (params: UpdateUserForm) => userApi.updateUserData(params),
  });
};
