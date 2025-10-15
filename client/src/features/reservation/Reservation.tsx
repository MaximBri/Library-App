import type { ReservationModel } from '@/shared/api/hooks/reservations/types';
import { useGetUserName } from '@/shared/hooks/useGetUserName';
import { type FC, memo, useState } from 'react';
import { getStatusLabel } from './utils/getStatusLabel';
import { getStatusColor } from './utils/getStatusColor';
import styles from './styles.module.scss';
import StatusModal from '../status-modal/StatusModal';
import { useChangeReservationStatus } from '@/shared/api/hooks/reservations/useChangeReservationStatus';
import { useParams } from 'react-router-dom';
import { notify } from '@/shared/utils/notify';
import { useCancelReservation } from '@/shared/api/hooks/reservations/useCancelReservation';

export const Reservation: FC<{
  data: ReservationModel;
  onStatusChanged?: () => void;
  isLibrarian: boolean;
}> = memo(({ data, onStatusChanged, isLibrarian }) => {
  const { id } = useParams();
  const nickname = useGetUserName(data.user, true);
  const statusColor = getStatusColor(data.status || 'pending');

  const [isModalOpen, setIsModalOpen] = useState(false);

  const { mutate: updateStatus, isPending } = useChangeReservationStatus(
    Number(id)
  );
  const { mutate: cancelReservation } = useCancelReservation();

  const handleOpen = () => setIsModalOpen(true);
  const handleClose = () => setIsModalOpen(false);

  const handleSubmit = (payload: {
    status: 'approved' | 'rejected' | 'completed';
    librarianComment?: string;
  }) => {
    if (!isLibrarian) return;
    updateStatus(
      {
        reservationId: data.id,
        params: {
          status: payload.status,
          librarianComment: payload.librarianComment ?? '',
        },
        bookId: data.bookId,
      },
      {
        onSuccess: () => {
          notify('Обновление статуса заявки прошло успешно!', 'success');
          handleClose();
          onStatusChanged?.();
        },
        onError: (err: any) => {
          console.log(err);
          if (err.message !== 'Unauthorized')
            notify('Ошибка обновления статуса', 'error');
        },
      }
    );
  };

  const handleCancelReservation = () => {
    cancelReservation(data.id);
  };

  const getFormatTime = (date: string) =>
    new Date(date).toLocaleDateString('ru-Ru');

  const isOverdue =
    new Date(data.requestedEndDate) < new Date() && data.status === 'approved';

  return (
    <li className={styles.card}>
      {isOverdue && <div className={styles.overdue}>Просрочена</div>}
      <div className={styles.reservation}>
        <div className={styles.reservation__accent}></div>
        <div className={styles.row}>
          <div className={styles.info}>
            <h2 className={styles.title}>Заявка №{data.id}</h2>
            <h3 className={styles.subtitle}>
              {isLibrarian ? 'Хочет взять: ' : 'Хочу взять: '}«{data.book.name}»,
              автор: {data.book.author}
            </h3>
            <h4 className={styles.title}>
              На время:
              <strong>
                {` ${getFormatTime(data.requestedStartDate)} - ${getFormatTime(
                  data.requestedEndDate
                )}`}
              </strong>
            </h4>
          </div>

          <div className={styles.meta}>
            {isLibrarian && <h2 className={styles.user}>От: {nickname}</h2>}

            <div className={styles.statusRow}>
              <div
                className={styles.status}
                style={
                  {
                    ['--status-color' as any]: statusColor,
                  } as React.CSSProperties
                }
              >
                {getStatusLabel(data.status)}
              </div>

              {isLibrarian &&
                (data.status === 'pending' || data.status === 'approved') && (
                  <button
                    className={styles.changeBtn}
                    onClick={handleOpen}
                    aria-label="Изменить статус"
                  >
                    Изменить статус
                  </button>
                )}
              {!isLibrarian && data.status === 'pending' && (
                <button
                  className={styles.changeBtn}
                  onClick={handleCancelReservation}
                  aria-label="Отменить"
                >
                  Отменить
                </button>
              )}
            </div>
          </div>
        </div>

        {data.userComment && isLibrarian && (
          <p className={styles.comment}>
            Комментарий пользователя: {data.userComment}
          </p>
        )}
        {data.librarianComment && !isLibrarian && (
          <p className={styles.comment}>
            Комментарий библиотекаря: {data.librarianComment}
          </p>
        )}
      </div>

      <StatusModal
        open={isModalOpen}
        initialStatus={data.status}
        reservationId={data.id}
        onClose={handleClose}
        onSubmit={handleSubmit}
        isLoading={isPending}
      />
    </li>
  );
});

export default Reservation;
