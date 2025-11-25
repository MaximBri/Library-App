import { EmptyList } from '@/features/empty-list/EmptyList';
import Reservation from '@/features/reservation/Reservation';
import { useGetMyReservationsInfinite } from '@/shared/api/hooks/reservations/useGetMyReservationsInfinte';
import { Loader } from '@/shared/components/loader/Loader';
import { useAuth } from '@/shared/hooks/useAuth';
import styles from './styles.module.scss';
import { ReservationsSort } from '@/features/reservations-sort/ReservationsSort';
import { useState } from 'react';
import { Button } from '@/shared/components/button/Button';

export const MyReservationsPage = () => {
  const { user } = useAuth();

  const [limit, setLimit] = useState<number>(10);
  const [status, setStatus] = useState<string>('all');

  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useGetMyReservationsInfinite({
      userId: user?.id,
      limit,
      status,
    });
  const reservations = data?.pages.flatMap((page) => page.items) || [];

  if (isLoading) {
    return <Loader />;
  }
  
  if (!reservations?.length) {
    return <EmptyList title="У вас нет бронирований" />;
  }

  return (
    <section className={styles['page']}>
      <ReservationsSort
        limit={limit}
        setLimit={setLimit}
        setStatus={setStatus}
        status={status}
      />
      <ul className={styles['page__list']}>
        {reservations.map((reservation) => {
          return (
            <Reservation
              isLibrarian={false}
              data={reservation}
              key={reservation.id}
            />
          );
        })}
      </ul>
      {hasNextPage && (
        <Button
          className={styles['page__more']}
          text={isFetchingNextPage ? 'Загрузка...' : 'Загрузить ещё'}
          isDisabled={isFetchingNextPage}
          onClick={() => fetchNextPage()}
        ></Button>
      )}
    </section>
  );
};
