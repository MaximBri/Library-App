'use client';

import { type FC } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/features/input/Input';
import { Button } from '@/features/button/Button';
import { useCreateLibrary } from '@/shared/api/hooks/libraries/useCreateLibrary';

import styles from './styles.module.scss';
import type { CreateLibraryForm } from './types';
import { createLibrarySchema } from './constants';

export const CreateLibrary: FC<{ handleClose: () => void }> = ({
  handleClose,
}) => {
  const { mutate: createLibrary, isPending } = useCreateLibrary();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateLibraryForm>({
    resolver: zodResolver(createLibrarySchema),
  });

  const onSubmit = (data: CreateLibraryForm) => {
    createLibrary(data, {
      onSuccess: (res) => {
        reset();
      },
      onError: (err) => {
        // alert('Ошибка при создании библиотеки');
      },
    });
  };

  return (
    <>
      <section className={styles.createLibrary}>
        <h2 className={styles.title}>Создать библиотеку</h2>

        <form
          className={styles.form}
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <label className={styles.field}>
            <span className={styles.label}>Название</span>
            <Input
              {...register('name')}
              placeholder="Введите название"
              className={styles.input}
            />
            {errors.name && (
              <div className={styles.error}>{String(errors.name.message)}</div>
            )}
          </label>

          <label className={styles.field}>
            <span className={styles.label}>Адрес</span>
            <Input
              {...register('address')}
              placeholder="Улица, дом"
              className={styles.input}
            />
            {errors.address && (
              <div className={styles.error}>
                {String(errors.address.message)}
              </div>
            )}
          </label>

          <label className={styles.field}>
            <span className={styles.label}>ID библиотекаря</span>
            <Input
              {...register('librarianId')}
              placeholder="ID (число)"
              type="number"
              className={styles.input}
            />
            {errors.librarianId && (
              <div className={styles.error}>
                {String(errors.librarianId.message)}
              </div>
            )}
          </label>

          <div className={styles.actions}>
            <Button
              type="submit"
              text="Создать"
              isLoading={isPending}
              isDisabled={isPending}
            />
          </div>
        </form>
      </section>
      <div onClick={handleClose} className={styles.background}></div>
    </>
  );
};

export default CreateLibrary;
