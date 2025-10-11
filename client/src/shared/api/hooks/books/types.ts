import type { LibraryModel } from '@/shared/providers/types';

export interface InfiniteBookList {
  nextCursor: number | null;
  hasMore: boolean;
  items: BookModel;
  library: LibraryModel;
}

export interface BookModel {
  author: string;
  createdAt: string;
  isbn: string;
  library: { id: number; name: string; address: string };
  address: string;
  id: number;
  libraryId: number;
  name: string;
  publishingYear: number;
  theme: string;
  type: string;
  updatedAt: string;
  isReserved: boolean;
}

export interface ReserveBookModel {
  bookId: number;
  requestedStartDate: string;
  requestedEndDate: string;
  userComment?: string | undefined;
}
