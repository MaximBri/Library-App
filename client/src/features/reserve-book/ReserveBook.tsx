'use client';

import { type FC } from 'react';
import {
  createReservationFormSchema,
  type CreateReservationForm,
} from './types';
import styles from './styles.module.scss';
import { dateHelpers } from './constants';
import { useReserveBook } from '@/shared/api/hooks/reservations/useReserveBook';
import { Modal } from '@/shared/components/Modal/Modal';
import { FormBuilder } from '@/shared/components/FormBuilder/FormBuilder';
import { notify } from '@/shared/utils/notify';

type Props = {
  bookId: number;
  isOpen: boolean;
  onSuccess?: () => void;
  handleClose: () => void;
};

export const ReserveBook: FC<Props> = ({
  bookId,
  isOpen,
  onSuccess,
  handleClose,
}) => {
  const { mutate: createReservation, isPending } = useReserveBook();

  const onSubmit = (data: CreateReservationForm) => {
    createReservation(
      { ...data, bookId: Number(bookId) },
      {
        onSuccess: () => {
          notify('Заявка подана успешно', 'success');
          onSuccess?.();
          handleClose();
        },
        onError: () => {
          notify('Ошибка во время подачи заявки', 'error');
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
    <Modal isOpen={isOpen} onClose={handleClose} title="Забронировать книгу">
      <div className={styles.bookIdRow}>Книга ID: {bookId}</div>
      <FormBuilder<CreateReservationForm>
        schema={createReservationFormSchema}
        fields={fields}
        onSubmit={onSubmit}
        submitText="Забронировать"
        isLoading={isPending}
      />
    </Modal>
  );
};

export default ReserveBook;
