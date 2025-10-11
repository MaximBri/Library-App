import type { ReservationStatusType } from '@/features/reserve-book/constants';

export const getStatusColor = (status: ReservationStatusType): string => {
  const colors: Record<ReservationStatusType, string> = {
    pending: 'orange',
    approved: 'green',
    rejected: 'red',
    completed: 'blue',
    cancelled: 'gray',
  };
  return colors[status];
};
