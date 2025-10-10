export interface InfiniteBookList {
  nextCursor: number | null;
  hasMore: boolean;
  items: BookModel;
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
}
