import type { BookModel } from '@/shared/api/hooks/books/types';
import { useDeleteBook } from '@/shared/api/hooks/books/useDeleteBook';
import { Button } from '@/shared/components/button/Button';
import { Modal } from '@/shared/components/Modal/Modal';
import { notify } from '@/shared/utils/notify';
import type { FC } from 'react';

export const DeleteBook: FC<{
  isOpen: boolean;
  handleClose: () => void;
  bookData: BookModel;
}> = ({ isOpen, handleClose, bookData }) => {
  const { mutate: deleteBook } = useDeleteBook();

  const handleClick = () => {
    deleteBook(bookData.id, {
      onSuccess: () => {
        notify(`Книга с id = ${bookData.id} удалена успешно`, 'success');
      },
      onError: () => {
        notify(`Ошибка при удалении книги с id = ${bookData.id}`, 'error');
      },
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Вы уверены что хотите удалить книгу?"
    >
      <Button onClick={handleClick} text="Удалить"></Button>
    </Modal>
  );
};
