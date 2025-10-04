import { useMutation } from '@tanstack/react-query';
import { userApi } from '../../user/userApi';
import type { UpdateUserRoleForm } from '@/features/change-role/types';

export const useUpdateUserRole = () => {
  return useMutation({
    mutationFn: (params: UpdateUserRoleForm) => userApi.updateUserRole(params),
  });
};
