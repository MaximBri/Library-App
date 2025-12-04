import { type FC } from 'react';
import styles from './styles.module.scss';
import { FormBuilder } from '@/shared/components/FormBuilder/FormBuilder';
import { updateReservationStatusSchema } from '../reserve-book/constants';
import Input from '@/shared/components/input/Input';
import { Modal } from '@/shared/components/Modal/Modal';
import type { StatusModalProps, UpdateReservationForm } from './types';
import { STATUS_OPTIONS } from './constants';


export const StatusModal: FC<StatusModalProps> = ({
  open,
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
          options={STATUS_OPTIONS.map((item) => item.text)}
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
    const status = STATUS_OPTIONS.find(
      (item) => item.text === data.status
    )?.value;
    if (!status) return;
    onSubmit({
      status: status,
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
