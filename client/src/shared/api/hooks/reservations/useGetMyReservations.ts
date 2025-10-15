import { useQuery } from '@tanstack/react-query';
import { reservationApi } from '../../reservations/reservationApi';
import { type UseGetMyReservationsParams } from './types';

export const useGetMyReservations = ({
  userId,
  limit = 10,
  status = 'all',
  cursor = null,
}: UseGetMyReservationsParams) => {
  return useQuery({
    queryKey: ['my-reservations'],
    queryFn: () =>
      reservationApi.getMyReservations(userId!, limit, status, cursor),
    enabled: !!userId,
  });
};
