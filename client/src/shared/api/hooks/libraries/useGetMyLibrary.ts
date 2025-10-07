import { useQuery } from '@tanstack/react-query';
import { libraryApi } from '../../libraries/libraryApi';

export const useGetMyLibrary = (enabled: boolean) => {
  return useQuery({
    queryKey: ['my-library'],
    queryFn: () => libraryApi.getMyLibrary(),
    enabled,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: Infinity,
  });
};
