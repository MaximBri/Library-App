import { useQuery } from '@tanstack/react-query';
import { libraryApi } from '../../libraries/libraryApi';
import type { LibraryModel } from '@/shared/providers/types';

export const useGetLibraries = () => {
  return useQuery<LibraryModel[]>({
    queryKey: ['libraries'],
    queryFn: () => libraryApi.getLibraries(),
    staleTime: Infinity,
  });
};
