import { useInfiniteQuery } from '@tanstack/react-query';
import { reservationApi } from '../../reservations/reservationApi';
import type { ReservationModel, UseGetMyReservationsInfiniteParams, UseGetMyReservationsParams } from './types';

export interface MyReservationsInfinite {
  items: ReservationModel;
  nextCursor: number | null;
  hasMore: boolean;
}

export const useGetMyReservationsInfinite = ({
  userId,
  limit,
  status,
}: UseGetMyReservationsInfiniteParams) => {
  return useInfiniteQuery<MyReservationsInfinite>({
    queryKey: ['my-reservations'],
    queryFn: async ({ pageParam = null }: { pageParam: number | null }) => {
      const data = await reservationApi.getMyReservations(
        userId!,
        limit,
        status,
        pageParam
      );
      return data;
    },
    enabled: !!userId,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: null,
    staleTime: Infinity,
  });
};
