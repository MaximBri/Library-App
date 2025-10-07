import z from "zod";

export const createLibrarySchema = z.object({
  name: z.string().min(1, 'Укажите название библиотеки'),
  address: z.string().min(1, 'Укажите адрес'),
  librarianId: z.string().min(1, 'Неверный ID библиотекаря'),
});
