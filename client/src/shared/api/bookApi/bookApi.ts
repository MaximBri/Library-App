import type { CreateBookForm } from '@/features/create-book/types';
import api from '../axios';
import type { InfiniteBookList } from '../hooks/books/types';

export const bookApi = {
  createBook: async (libraryId: number, bookData: CreateBookForm) => {
    try {
      const { data } = await api.post(`/api/books`, {
        ...bookData,
        publishingYear: Number(bookData.publishingYear),
        libraryId,
      });
      return { data };
    } catch {
      console.error('Ошибка при создании книги');
    }
  },

  getLibraryBooks: async (
    libraryId: number,
    cursor: string | null = null
  ): Promise<InfiniteBookList> => {
    try {
      const { data } = await api.get(`/api/books/library/${libraryId}`, {
        params: { cursor },
      });
      return data;
    } catch (error) {
      console.error('Ошибка при запросе книг библиотеки', error);
      throw error;
    }
  },
};
