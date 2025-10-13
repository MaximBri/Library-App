import type { FormField } from '@/shared/components/FormBuilder/types';
import z from 'zod';
import type { CreateLibraryForm } from './types';

export const createLibrarySchema = z.object({
  name: z.string().min(1, 'Укажите название библиотеки'),
  address: z.string().min(1, 'Укажите адрес'),
  librarianId: z.string().min(1, 'Неверный ID библиотекаря'),
});

export const libraryFields: FormField<CreateLibraryForm>[] = [
  { name: 'name', label: 'Название', placeholder: 'Введите название' },
  { name: 'address', label: 'Адрес', placeholder: 'Улица, дом' },
  { name: 'librarianId', label: 'ID библиотекаря', placeholder: 'ID' },
];
