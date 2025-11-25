import { useInfiniteQuery } from "@tanstack/react-query";
import authorApi from "../../authors/authorApi";

export const useGetAuthorsInfinite = () => {
  return useInfiniteQuery({
    queryKey: ['authors-infinite'],
    queryFn: async ({ pageParam = null }: { pageParam?: number | null }) => {
      const data = await authorApi.getAuthors({cursor: pageParam});
      return data;
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: null,
    staleTime: Infinity,
  });
};