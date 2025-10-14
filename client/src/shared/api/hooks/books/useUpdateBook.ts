import { useMutation, useQueryClient } from '@tanstack/react-query';
import { bookApi } from '../../bookApi/bookApi';
import type { BookModel, UpdateBookParams } from './types';
import type { BooksResponseInfinite } from './useCreateBook';

export const useUpdateBook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ bookId, bookData }: UpdateBookParams) =>
      bookApi.editLibraryBook(bookId, bookData),
    onSuccess: (response: BookModel) => {
      queryClient.setQueriesData<BooksResponseInfinite>(
        { queryKey: ['libraryBooks', response.libraryId], exact: false },
        (oldData) => {
          if (!oldData) return oldData;
          const newPages = oldData.pages.map((page) => ({
            ...page,
            items: page.items.map((r) =>
              r.id === response.id
                ? { ...response, isReserved: r.isReserved }
                : r
            ),
          }));
          return { ...oldData, pages: newPages };
        }
      );
    },
  });
};
