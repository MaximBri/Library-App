export interface AuthorCreateModel {
  name: string;
  surname: string;
  patronymic?: string | null;
  description?: string | null;
  birthYear?: number | null;
}

export interface AuthorModel {
  id: number;
  name: string;
  surname: string;
  patronymic: string | null;
  description: string | null;
  birthYear: string | null;
  createdAt: string;
  updatedAt: string;
  _count: {
    books: number;
  };
}

export interface AuthorsResponseCached {
  pageParams: unknown[];
  pages: AuthorsResponseInfinite[];
}

export interface AuthorsResponseInfinite {
  items: AuthorModel[];
  nextCursor: number | null;
  hasMore: boolean;
}
