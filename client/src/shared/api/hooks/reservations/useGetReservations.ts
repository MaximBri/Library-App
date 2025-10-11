import { useInfiniteQuery } from '@tanstack/react-query';
import { reservationApi } from '../../reservations/reservationApi';

export const useGetReservations = () => {
  return useInfiniteQuery({
    queryKey: ['reservations'],
    queryFn: async () => {
      const data = await reservationApi.getReservations();
      return data;
    },
    getNextPageParam: (lastPage) => {
      return lastPage.nextCursor || undefined;
    },
    initialPageParam: null,
    staleTime: Infinity,
  });
};
