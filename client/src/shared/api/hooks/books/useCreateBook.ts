import { useMutation } from '@tanstack/react-query';
import { bookApi } from '../../bookApi/bookApi';
import type { CreateBookModel } from '@/features/create-book/types';

export const useCreateBook = () => {
  return useMutation({
    mutationFn: async (bookData: CreateBookModel) =>
      await bookApi.createBook(bookData.libraryId, bookData),
  });
};
