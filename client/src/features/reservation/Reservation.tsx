import type { ReservationModel } from '@/shared/api/hooks/reservations/types';
import { useGetUserName } from '@/shared/hooks/useGetUserName';
import { type FC } from 'react';
import { getStatusLabel } from './utils/getStatusLabel';
import { getStatusColor } from './utils/getStatusColor';
import styles from './styles.module.scss';

export const Reservation: FC<{ data: ReservationModel }> = ({ data }) => {
  const nickname = useGetUserName(data.user, true);

  const statusColor = getStatusColor(data.status || 'pending');

  return (
    <li>
      <div className={styles.reservation}>
        <div className={styles.row}>
          <div className={styles.info}>
            <h2 className={styles.title}>Заявка №{data.id}</h2>
            <h3 className={styles.subtitle}>
              Хочет взять: «{data.book.name}», автор: {data.book.author}
            </h3>
          </div>

          <div className={styles.meta}>
            <h2 className={styles.user}>От: {nickname}</h2>
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
            </div>
          </div>
        </div>

        {data.userComment && (
          <p className={styles.comment}>
            Комментарий пользователя: {data.userComment}
          </p>
        )}
      </div>
    </li>
  );
};
export default Reservation;
