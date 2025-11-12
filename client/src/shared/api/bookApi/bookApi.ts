import type { CreateBookForm } from '@/features/create-book/types';
import api from '../axios';
import type { BookModel, InfiniteBookList } from '../hooks/books/types';

export const bookApi = {
  createBook: async (
    libraryId: number,
    bookData: CreateBookForm
  ): Promise<BookModel> => {
    const payload = {
      ...bookData,
      publishingYear: Number(bookData.publishingYear),
      libraryId,
      ...(bookData.author ? { authorId: Number(bookData.author) } : {}),
    } as any;

    // strip raw `author` field if present
    delete (payload as any).author;

    const { data } = await api.post(`/api/books`, payload);
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
    const payload = {
      ...bookData,
      publishingYear: Number(bookData.publishingYear),
      ...(bookData.author ? { authorId: Number(bookData.author) } : {}),
    } as any;

    delete (payload as any).author;

    const { data } = await api.patch(`/api/books/${bookId}`, payload);
    return data;
  },

  deleteBook: async (bookId: number) => {
    const { data } = await api.delete(`/api/books/${bookId}`);
    return data;
  },
};
