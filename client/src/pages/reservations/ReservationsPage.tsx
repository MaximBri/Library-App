import { Reservation } from '@/features/reservation/Reservation';
import { useGetReservations } from '@/shared/api/hooks/reservations/useGetReservations';
import styles from './styles.module.scss';
import { useAuth } from '@/shared/hooks/useAuth';
import { APP_ROLES } from '@/shared/constants';
import { useParams } from 'react-router-dom';
import { Loader } from '@/shared/components/loader/Loader';
import { useState } from 'react';
import { LIMIT_OPTIONS, STATUS_MAP, STATUS_OPTIONS } from './constants';
import Input from '@/shared/components/input/Input';
import { EmptyList } from '@/features/empty-list/EmptyList';

export const ReservationsPage = () => {
  const { user, myLibrary } = useAuth();
  const { id } = useParams();

  const [limit, setLimit] = useState<number>(10);
  const [status, setStatus] = useState<string>('all');

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetReservations({ limit, status });

  const reservations = data?.pages.flatMap((page) => page.items) || [];
  const currentStatusLabel =
    STATUS_OPTIONS.find((s) => s.value === status)?.label ?? 'Все';
  const isOwner =
    user?.role === APP_ROLES.LIBRARIAN && myLibrary?.id === Number(id);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <section className={styles['page']}>
      <h1>Заявки читателей библиотеки:</h1>
      <div className={styles['page__controls']}>
        <div className={styles['page__control']}>
          <label htmlFor="limit">Лимит на странице</label>
          <Input
            id="limit"
            name="limit"
            value={String(limit)}
            options={LIMIT_OPTIONS}
            placeholder="Лимит"
            onChange={(e) => {
              const v = String((e.target as HTMLInputElement).value || '');
              const n = Number(v) || 10;
              setLimit(n);
            }}
          />
        </div>

        <div className={styles['page__control']}>
          <label htmlFor="status">Статус</label>
          <Input
            id="status"
            name="status"
            value={currentStatusLabel}
            options={STATUS_OPTIONS.map((s) => s.label)}
            placeholder="Статус"
            onChange={(e) => {
              const label = String((e.target as HTMLInputElement).value || '');
              const mapped = STATUS_MAP[label] ?? 'all';
              setStatus(mapped);
            }}
          />
        </div>
      </div>

      <ul className={styles['page__list']}>
        {reservations.map((reservation) => (
          <Reservation
            isLibrarian={isOwner}
            data={reservation}
            key={reservation.id}
          />
        ))}
        {!reservations.length && <EmptyList title='Заявок пока нет'/>}
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
