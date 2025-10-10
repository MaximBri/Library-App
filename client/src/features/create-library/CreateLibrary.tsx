'use client';

import { type FC } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateLibrary } from '@/shared/api/hooks/libraries/useCreateLibrary';

import styles from './styles.module.scss';
import type { CreateLibraryForm } from './types';
import { createLibrarySchema, libraryFields } from './constants';
import { FormBuilder } from '@/shared/utils/FormBuilder/FormBuilder';

export const CreateLibrary: FC<{ handleClose: () => void }> = ({
  handleClose,
}) => {
  const { mutate: createLibrary, isPending } = useCreateLibrary();

  const { reset } = useForm<CreateLibraryForm>({
    resolver: zodResolver(createLibrarySchema),
  });

  const onSubmit = (data: CreateLibraryForm) => {
    createLibrary(data, {
      onSuccess: () => reset(),
    });
  };

  return (
    <>
      <section className={styles.createLibrary}>
        <h2 className={styles.title}>Создать библиотеку</h2>
        <FormBuilder
          schema={createLibrarySchema}
          fields={libraryFields}
          onSubmit={onSubmit}
          isLoading={isPending}
        />
      </section>
      <div onClick={handleClose} className={styles.background}></div>
    </>
  );
};

export default CreateLibrary;
