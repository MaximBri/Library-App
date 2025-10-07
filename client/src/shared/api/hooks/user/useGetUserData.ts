import type { User } from '@/shared/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { userApi } from '../../user/userApi';

export const useGetUserData = (enabled: boolean) => {
  return useQuery<User>({
    queryKey: ['user'],
    queryFn: () => userApi.getUserData(),
    enabled,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: Infinity,
  });
};
