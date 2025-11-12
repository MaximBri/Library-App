import type { CreateBookForm } from '../create-book/types';
import { bookFields, CreateBookSchema } from '../create-book/constants';
import { type FC } from 'react';
import type { BookModel } from '@/shared/api/hooks/books/types';
import { Modal } from '@/shared/components/Modal/Modal';
import { FormBuilder } from '@/shared/components/FormBuilder/FormBuilder';
import { useUpdateBook } from '@/shared/api/hooks/books/useUpdateBook';
import { notify } from '@/shared/utils/notify';

export const EditBook: FC<{
  isOpen: boolean;
  data: BookModel;
  handleClose: () => void;
}> = ({ data, isOpen, handleClose }) => {
  const { mutate: updateBook, isPending } = useUpdateBook();
  const { name, isbn, type, theme } = data;
  const defaultValues = {
    name,
    author: String(data.author?.id ?? ''),
    isbn,
    type,
    theme,
    publishingYear: String(data.publishingYear),
  };

  const onSubmit = (formData: CreateBookForm) =>
    updateBook(
      { bookData: formData, bookId: Number(data.id) },
      {
        onSuccess: () => {
          handleClose();
          notify('Данные книги успешно обновлены', 'success');
        },
      }
    );

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Обновить книгу">
      <FormBuilder
        schema={CreateBookSchema}
        fields={bookFields}
        onSubmit={onSubmit}
        isLoading={isPending}
        defaultValues={defaultValues}
      />
    </Modal>
  );
};
