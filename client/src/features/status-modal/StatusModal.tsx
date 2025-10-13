import { type FC } from 'react';
import styles from './styles.module.scss';
import { FormBuilder } from '@/shared/components/FormBuilder/FormBuilder';
import {
  updateReservationStatusSchema,
  type UpdateReservationStatusInput,
} from '../reserve-book/constants';
import Input from '@/shared/components/input/Input';
import { Modal } from '@/shared/components/Modal/Modal';
import type { StatusModalProps } from './types';

const STATUS_OPTIONS: UpdateReservationStatusInput['status'][] = [
  'approved',
  'rejected',
  'completed',
];

export interface UpdateReservationForm {
  status: UpdateReservationStatusInput['status'];
  librarianComment?: string;
}

export const StatusModal: FC<StatusModalProps> = ({
  open,
  initialStatus,
  reservationId,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const fields = [
    {
      name: 'status',
      label: 'Статус',
      render: (reg: any) => (
        <Input
          {...reg}
          options={STATUS_OPTIONS}
          placeholder="Выберите статус"
        />
      ),
    },
    {
      name: 'librarianComment',
      label: 'Комментарий (для пользователя, необязательно)',
      render: (reg: any) => (
        <textarea
          {...reg}
          placeholder="Комментарий для пользователя"
          className={styles.modalTextarea}
          rows={4}
        />
      ),
    },
  ];

  const handleSubmit = (data: UpdateReservationForm) => {
    onSubmit({
      status: data.status,
      librarianComment: data.librarianComment ? data.librarianComment : '',
    });
  };

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      title={`Изменить статус заявки №${reservationId}`}
    >
      <div style={{ paddingTop: 4 }}>
        <FormBuilder<UpdateReservationForm>
          schema={updateReservationStatusSchema}
          fields={fields}
          onSubmit={handleSubmit}
          submitText="Сохранить"
          isLoading={isLoading}
        />
      </div>
    </Modal>
  );
};

export default StatusModal;
