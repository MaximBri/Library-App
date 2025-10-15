import { Reservation } from '@/features/reservation/Reservation';
import { useGetReservations } from '@/shared/api/hooks/reservations/useGetReservations';
import styles from './styles.module.scss';
import { useAuth } from '@/shared/hooks/useAuth';
import { APP_ROLES } from '@/shared/constants';
import { useParams } from 'react-router-dom';
import { Loader } from '@/shared/components/loader/Loader';
import { useState } from 'react';
import { EmptyList } from '@/features/empty-list/EmptyList';
import { ReservationsSort } from '@/features/reservations-sort/ReservationsSort';

export const ReservationsPage = () => {
  const { user, myLibrary } = useAuth();
  const { id } = useParams();

  const [limit, setLimit] = useState<number>(10);
  const [status, setStatus] = useState<string>('all');

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetReservations({ limit, status });

  const reservations = data?.pages.flatMap((page) => page.items) || [];

  const isOwner =
    user?.role === APP_ROLES.LIBRARIAN && myLibrary?.id === Number(id);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <section className={styles['page']}>
      <h1>Заявки читателей библиотеки:</h1>
      <ReservationsSort
        limit={limit}
        setLimit={setLimit}
        setStatus={setStatus}
        status={status}
      />

      <ul className={styles['page__list']}>
        {reservations.map((reservation) => (
          <Reservation
            isLibrarian={isOwner}
            data={reservation}
            key={reservation.id}
          />
        ))}
        {!reservations.length && <EmptyList title="Заявок пока нет" />}
      </ul>

      {hasNextPage && (
        <div className={styles['page__more']}>
          <button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
            {isFetchingNextPage ? 'Загрузка...' : 'Загрузить ещё'}
          </button>
        </div>
      )}
    </section>
  );
};
