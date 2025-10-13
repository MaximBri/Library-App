import type { FormField } from '@/shared/components/FormBuilder/types';
import z from 'zod';
import type { CreateBookForm } from './types';

export const CreateBookSchema = z.object({
  name: z.string().min(1, 'Укажите название книги'),
  author: z.string().min(1, 'Укажите автора'),
  isbn: z.string().min(1, 'Укажите ISBN'),
  type: z.string().min(1, 'Укажите тип'),
  theme: z.string().min(1, 'укажите тему'),
  publishingYear: z.string().min(4, 'Укажите год публикации'),
});

export const bookFields: FormField<CreateBookForm>[] = [
  { name: 'name', label: 'Название', placeholder: 'Введите название' },
  { name: 'author', label: 'Автор', placeholder: 'ФИО' },
  { name: 'isbn', label: 'ISBN', placeholder: 'ISBN' },
  { name: 'publishingYear', label: 'Год публикации', placeholder: 'ГГГГ' },
  { name: 'theme', label: 'Тема', placeholder: 'Тема' },
  { name: 'type', label: 'Тип', placeholder: 'Тип' },
];
