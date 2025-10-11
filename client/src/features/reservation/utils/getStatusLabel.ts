import type { ReservationStatusType } from '@/features/reserve-book/constants';

export const getStatusLabel = (status: ReservationStatusType): string => {
  const labels: Record<ReservationStatusType, string> = {
    pending: 'Ожидает одобрения',
    approved: 'Одобрено',
    rejected: 'Отклонено',
    completed: 'Завершено',
    cancelled: 'Отменено',
  };
  return labels[status];
};

