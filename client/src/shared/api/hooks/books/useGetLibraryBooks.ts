import { useQuery } from '@tanstack/react-query';
import { bookApi } from '../../bookApi/bookApi';

export const useGetLibraryBooks = (libraryId: number) => {
  return useQuery({
    queryKey: [libraryId],
    queryFn: () => bookApi.getLibraryBooks(libraryId),
  });
};
