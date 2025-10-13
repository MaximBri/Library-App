import { type FC } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { CreateBookForm } from './types';
import { bookFields, CreateBookSchema } from './constants';
import { useCreateBook } from '@/shared/api/hooks/books/useCreateBook';
import { useParams } from 'react-router-dom';
import { Modal } from '@/shared/components/Modal/Modal';
import { FormBuilder } from '@/shared/components/FormBuilder/FormBuilder';

export const CreateBook: FC<{ 
  isOpen: boolean;
  handleClose: () => void;
}> = ({ isOpen, handleClose }) => {
  const { mutate: createBook, isPending } = useCreateBook();
  const { id } = useParams();

  const { reset } = useForm<CreateBookForm>({
    resolver: zodResolver(CreateBookSchema),
  });

  const onSubmit = (data: CreateBookForm) =>
    createBook(
      { ...data, libraryId: Number(id) },
      { 
        onSuccess: () => {
          reset();
          handleClose();
        }
      }
    );

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Создать книгу">
      <FormBuilder
        schema={CreateBookSchema}
        fields={bookFields}
        onSubmit={onSubmit}
        isLoading={isPending}
      />
    </Modal>
  );
};

export default CreateBook;