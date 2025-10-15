import {
  LIMIT_OPTIONS,
  STATUS_MAP,
  STATUS_OPTIONS,
} from '@/pages/reservations/constants';
import Input from '@/shared/components/input/Input';
import styles from './styles.module.scss';
import type { FC } from 'react';

export const ReservationsSort: FC<{
  limit: number;
  setLimit: (arg: number) => void;
  status: string;
  setStatus: (arg: string) => void;
}> = ({ limit, setLimit, status, setStatus }) => {
  const currentStatusLabel =
    STATUS_OPTIONS.find((s) => s.value === status)?.label ?? 'Все';

  return (
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
  );
};
