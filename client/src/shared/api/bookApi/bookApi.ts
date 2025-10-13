import type { CreateBookForm } from '@/features/create-book/types';
import api from '../axios';
import type { BookModel, InfiniteBookList } from '../hooks/books/types';

export const bookApi = {
  createBook: async (
    libraryId: number,
    bookData: CreateBookForm
  ): Promise<BookModel> => {
    const { data } = await api.post(`/api/books`, {
      ...bookData,
      publishingYear: Number(bookData.publishingYear),
      libraryId,
    });
    return data;
  },

  getLibraryBooks: async (
    libraryId: number,
    cursor: number | null = null
  ): Promise<InfiniteBookList> => {
    const { data } = await api.get(`/api/books/library/${libraryId}`, {
      params: { cursor },
    });
    return data;
  },
};
