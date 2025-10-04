import type { User } from '@/shared/hooks/useAuth';

export interface LibraryModel {
  id: number;
  name: string;
  adress: string;
  librarianId: number;
  librarian: User;
}

export interface LibraryCreateModel {
  name: string;
  address: string;
  librarianId: number;
}
