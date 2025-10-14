import { useMutation, useQueryClient } from '@tanstack/react-query';
import { bookApi } from '../../bookApi/bookApi';
import type { BooksResponseInfinite } from './useCreateBook';

export const useDeleteBook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookId: number) => bookApi.deleteBook(bookId),
    onSuccess: (_, payload) => {
      queryClient.setQueriesData<BooksResponseInfinite>(
        { queryKey: ['libraryBooks'], exact: false },
        (oldData) => {
          if (!oldData) return oldData;
          const newPages = oldData.pages.map((page) => ({
            ...page,
            items: page.items.filter((r) => r.id !== payload),
          }));
          return { ...oldData, pages: newPages };
        }
      );
    },
  });
};
