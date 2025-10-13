import { useInfiniteQuery } from '@tanstack/react-query';
import { bookApi } from '../../bookApi/bookApi';

export const useGetLibraryBooksInfinite = (libraryId: number) => {
  return useInfiniteQuery({
    queryKey: ['libraryBooks', libraryId],
    queryFn: async ({ pageParam = null }: { pageParam?: number | null }) => {
      const data = await bookApi.getLibraryBooks(libraryId, pageParam);
      return data;
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: null,
    staleTime: Infinity,
  });
};
