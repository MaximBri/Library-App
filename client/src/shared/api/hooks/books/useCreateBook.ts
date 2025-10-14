import {
  useMutation,
  useQueryClient,
  type InfiniteData,
} from '@tanstack/react-query';
import { bookApi } from '../../bookApi/bookApi';
import type { CreateBookModel } from '@/features/create-book/types';
import type { BookModel } from './types';
import type { LibraryModel } from '@/shared/providers/types';

export interface BooksResponse {
  items: BookModel[];
  nextCursor: string | null;
  library: LibraryModel
  hasMore: boolean;
}

export interface BooksResponseInfinite {
  pageParams: unknown[],
  pages: BooksResponse[]
}

export const useCreateBook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookData: CreateBookModel) =>
      await bookApi.createBook(bookData.libraryId, bookData),
    onSuccess: (newBook: BookModel, bookData) => {
      queryClient.setQueryData<InfiniteData<BooksResponse>>(
        ['libraryBooks', bookData.libraryId],
        (oldData) => {
          if (!oldData) return oldData;

          const firstPage = oldData.pages[0];
          const newFirstPage = {
            ...firstPage,
            items: [{ ...newBook, isReserved: false }, ...firstPage.items],
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
