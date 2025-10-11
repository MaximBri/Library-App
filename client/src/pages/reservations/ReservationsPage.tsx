import { Reservation } from '@/features/reservation/Reservation';
import { useGetReservations } from '@/shared/api/hooks/reservations/useGetReservations';
import styles from './styles.module.scss'

export const ReservationsPage = () => {
  const { data } = useGetReservations();
  const reservations = data?.pages.flatMap((page) => page.items) || [];

  return (
    <section className={styles['page']}>
      <h1>Заявки читателей библиотеки:</h1>
      <ul className={styles['page__list']}>
        {reservations.map((reservation) => (
          <Reservation data={reservation} key={reservation.id} />
        ))}
      </ul>
    </section>
  );
};
