import type { User } from '@/shared/hooks/useAuth';

export interface LibraryModel {
  id: number;
  name: string;
  address: string;
  librarianId: number;
  librarian: User;
}

export interface LibraryCreateModel {
  name: string;
  address: string;
  librarianId: string;
}
