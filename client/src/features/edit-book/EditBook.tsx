import type { CreateBookForm } from '../create-book/types';
import { bookFields, CreateBookSchema } from '../create-book/constants';
import { type FC } from 'react';
import type { BookModel } from '@/shared/api/hooks/books/types';
import { Modal } from '@/shared/components/Modal/Modal';
import { FormBuilder } from '@/shared/components/FormBuilder/FormBuilder';
import { useUpdateBook } from '@/shared/api/hooks/books/useUpdateBook';
import { notify } from '@/shared/utils/notify';
import { useGetAuthors } from '@/shared/api/hooks/authors/useGetAuthors';

export const EditBook: FC<{
  isOpen: boolean;
  data: BookModel;
  handleClose: () => void;
}> = ({ data, isOpen, handleClose }) => {
  const { mutate: updateBook, isPending } = useUpdateBook();
  const { name, isbn, type, theme } = data;

  const { data: authorsPages = [] } = useGetAuthors();
  const authors = authorsPages?.pages?.flatMap((page: any) => page.items);

  const authorOptions = authors?.map((a: any) => ({
    label: a.name,
    value: String(a.id),
  }));

  const fieldsWithAuthors = bookFields.map((f) =>
    f.name === 'author' ? { ...f, options: authorOptions } : f
  );

  const defaultValues = {
    name,
    author: String(data.author?.id ?? ''),
    isbn,
    type,
    theme,
    publishingYear: String(data.publishingYear),
    authors: (authors ?? []).join(', '),
  };

  const normalizeAuthors = (value: unknown): string[] => {
    if (Array.isArray(value))
      return value
        .map(String)
        .map((s) => s.trim())
        .filter(Boolean);
    if (typeof value === 'string') {
      return value
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    }
    return [];
  };

  const onSubmit = (formData: CreateBookForm) => {
    const transformed = {
      ...formData,
      authors: normalizeAuthors((formData as any).authors),
    };

    updateBook(
      { bookData: transformed, bookId: Number(data.id) },
      {
        onSuccess: () => {
          handleClose();
          notify('Данные книги успешно обновлены', 'success');
        },
      }
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Обновить книгу">
      <FormBuilder
        schema={CreateBookSchema}
        fields={fieldsWithAuthors}
        onSubmit={onSubmit}
        isLoading={isPending}
        defaultValues={defaultValues}
      />
    </Modal>
  );
};
