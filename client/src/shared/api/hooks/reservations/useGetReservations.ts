import { useInfiniteQuery } from '@tanstack/react-query';
import { reservationApi } from '../../reservations/reservationApi';
import type { UseGetReservationsParams } from './types';

export const useGetReservations = ({
  limit = 10,
  status = 'all',
}: UseGetReservationsParams = {}) => {
  return useInfiniteQuery({
    queryKey: ['reservations', limit, status],
    queryFn: async ({ pageParam = null }) => {
      const data = await reservationApi.getReservations({
        limit,
        status,
        cursor: pageParam,
      });
      return data;
    },
    getNextPageParam: (lastPage) => {
      return lastPage.nextCursor || undefined;
    },
    initialPageParam: null,
    staleTime: 1000 * 60 * 10,
  });
};
