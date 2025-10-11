'use client';

import { type FC } from 'react';
import { FormBuilder } from '@/shared/utils/FormBuilder/FormBuilder';
import {
  createReservationFormSchema,
  type CreateReservationForm,
} from './types';
import styles from './styles.module.scss';
import { dateHelpers } from './constants';
import { useReserveBook } from '@/shared/api/hooks/reservations/useReserveBook';

type Props = {
  bookId: number;
  onSuccess?: () => void;
  handleClose?: () => void;
};

export const ReserveBook: FC<Props> = ({ bookId, onSuccess, handleClose }) => {
  const { mutate: createReservation, isPending } = useReserveBook();

  const onSubmit = (data: CreateReservationForm) => {
    createReservation(
      { ...data, bookId: Number(bookId) },
      {
        onSuccess: () => {
          onSuccess?.();
          handleClose?.();
        },
      }
    );
  };

  const minDate = dateHelpers.getMinDate();

  const fields = [
    {
      name: 'requestedStartDate',
      label: 'Дата начала бронирования',
      render: (register: any) => (
        <input
          {...register}
          type="date"
          min={minDate}
          className={styles.input}
          aria-label="Дата начала бронирования"
        />
      ),
    },
    {
      name: 'requestedEndDate',
      label: 'Дата окончания бронирования',
      render: (register: any) => (
        <input
          {...register}
          type="date"
          min={minDate}
          className={styles.input}
          aria-label="Дата окончания бронирования"
        />
      ),
    },
    {
      name: 'userComment',
      label: 'Комментарий (необязательно)',
      render: (register: any) => (
        <textarea
          {...register}
          placeholder="Комментарий к брони"
          className={styles.textarea}
          rows={4}
        />
      ),
    },
  ];

  return (
    <>
      <div className={styles.reserveCard}>
        <h2 className={styles.title}>Забронировать книгу</h2>

        <div className={styles.bookIdRow}>Книга ID: {bookId}</div>

        <FormBuilder<CreateReservationForm>
          schema={createReservationFormSchema}
          fields={fields}
          onSubmit={onSubmit}
          submitText="Забронировать"
          isLoading={isPending}
        />
      </div>

      {handleClose && (
        <div onClick={handleClose} className={styles.background}></div>
      )}
    </>
  );
};

export default ReserveBook;
