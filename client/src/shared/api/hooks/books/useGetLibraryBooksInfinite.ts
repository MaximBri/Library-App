import { useInfiniteQuery } from '@tanstack/react-query';
import { bookApi } from '../../bookApi/bookApi';

export const useGetLibraryBooksInfinite = (libraryId: number) => {
  return useInfiniteQuery({
    queryKey: ['libraryBooks', libraryId],
    queryFn: async ({ pageParam = null }: { pageParam?: string | null }) => {
      const data = await bookApi.getLibraryBooks(libraryId, pageParam);
      return data;
    },
    getNextPageParam: (lastPage) => {
      return lastPage.nextCursor || undefined;
    },
    initialPageParam: null,
    staleTime: Infinity,
    cacheTime: Infinity
  });
};
