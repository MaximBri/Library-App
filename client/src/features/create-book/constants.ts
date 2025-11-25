import type { FormField } from '@/shared/components/FormBuilder/types';
import z from 'zod';
import type { CreateBookForm } from './types';

export type BookType = 'book' | 'magazine' | 'newspaper' | 'journal' | 'other';

export const BookTypeColors: Record<BookType, string> = {
  book: '#7C3AED',
  magazine: '#F59E0B',
  newspaper: '#EF4444',
  journal: '#10B981',
  other: '#6B7280',
};

export const BookTypeMap: Record<BookType, string> = {
  book: 'Книга',
  magazine: 'Журнал',
  journal: 'Газета',
  newspaper: 'Новостная газета',
  other: 'Другое',
};

export const CreateBookSchema = z.object({
  name: z.string().min(1, 'Укажите название книги'),
  author: z.string().min(1, 'Укажите автора'),
  type: z.enum(Object.values(BookTypeMap)),
  isbn: z.string().min(1, 'Укажите ISBN'),
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
