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
      authorId: Number(bookData.author),
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

  editLibraryBook: async (bookId: number, bookData: CreateBookForm) => {
    const { data } = await api.patch(`/api/books/${bookId}`, {
      ...bookData,
      publishingYear: Number(bookData.publishingYear),
    });
    return data;
  },

  deleteBook: async (bookId: number) => {
    const { data } = await api.delete(`/api/books/${bookId}`);
    return data;
  },
};
