import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi } from '../../user/userApi';
import type { UpdateUserForm } from '@/pages/lk/types';
import type { User } from '@/shared/hooks/useAuth';

export const useUpdateUserData = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: UpdateUserForm) => userApi.updateUserData(params),
    onSuccess: (res: User) => {
      queryClient.setQueryData(['user'], res);
    },
  });
};
