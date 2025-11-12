import { useMutation, useQueryClient } from '@tanstack/react-query';
import authorApi from '../../authors/authorApi';
import type { AuthorCreateModel, AuthorModel, AuthorsResponseCached } from '../../authors/types';

export const useAddAuthor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: AuthorCreateModel) => await authorApi.createAuthor(params),
    onSuccess: (newAuthor: AuthorModel) => {
      queryClient.setQueriesData<AuthorsResponseCached>(
        { queryKey: ['authors'], exact: false },
        (oldData) => {
          if (!oldData) return oldData;
          console.log(oldData)

          const firstPage = oldData.pages[0];
          const newFirstPage = {
            ...firstPage,
            items: [newAuthor, ...firstPage.items],
          };

          return {
            ...oldData,
            pages: [newFirstPage, ...oldData.pages.slice(1)],
          };
        }
      );
    },
  });
};
