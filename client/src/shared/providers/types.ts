export interface LibraryModel {
  address: string;
  createdAt: string;
  id: number;
  librarianId: number;
  name: string;
  updatedAt: string;
  librarian: LibrarianModel;
}

export interface LibrarianModel {
  name?: string;
  surname?: string;
  id: number;
  email: string;
}
