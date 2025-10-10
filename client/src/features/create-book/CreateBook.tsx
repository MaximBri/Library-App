'use client';

import { type FC } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import styles from './styles.module.scss';
import type { CreateBookForm } from './types';
import { bookFields, CreateBookSchema } from './constants';
import { useCreateBook } from '@/shared/api/hooks/books/useCreateBook';
import { useParams } from 'react-router-dom';
import { FormBuilder } from '@/shared/utils/FormBuilder/FormBuilder';

export const CreateBook: FC<{ handleClose: () => void }> = ({
  handleClose,
}) => {
  const { mutate: createBook, isPending } = useCreateBook();
  const { id } = useParams();

  const { reset } = useForm<CreateBookForm>({
    resolver: zodResolver(CreateBookSchema),
  });

  const onSubmit = (data: CreateBookForm) =>
    createBook(
      { ...data, libraryId: Number(id) },
      { onSuccess: () => reset() }
    );

  return (
    <>
      <div className={styles.createLibrary}>
        <h2 className={styles.title}>Создать книгу</h2>
        <FormBuilder
          schema={CreateBookSchema}
          fields={bookFields}
          onSubmit={onSubmit}
          isLoading={isPending}
        />
      </div>
      <div onClick={handleClose} className={styles.background}></div>
    </>
  );
};

export default CreateBook;
