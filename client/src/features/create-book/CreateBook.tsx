import { type FC } from 'react';
import type { CreateBookForm } from './types';
import { useCreateBook } from '@/shared/api/hooks/books/useCreateBook';
import { useParams } from 'react-router-dom';
import { Modal } from '@/shared/components/Modal/Modal';
import { CreateBookFormWrapper } from './CreateBookFormWrapper';
import { notify } from '@/shared/utils/notify';

export const CreateBook: FC<{
  isOpen: boolean;
  handleClose: () => void;
}> = ({ isOpen, handleClose }) => {
  const { mutate: createBook, isPending } = useCreateBook();
  const { id } = useParams();

  const handleCreate = (data: CreateBookForm & { author?: string }) => {
    createBook(
      { ...data, libraryId: Number(id) },
      {
        onSuccess: () => {
          handleClose();
          notify('Книга успешно создана!', 'success');
        },
        onError: () => {
          notify('Ошибка при создании книги', 'error');
        },
      }
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Создать книгу">
      <CreateBookFormWrapper onCreate={handleCreate} isLoading={isPending} />
    </Modal>
  );
};
