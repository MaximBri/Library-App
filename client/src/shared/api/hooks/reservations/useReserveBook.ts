import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { ReserveBookModel } from '../books/types';
import { reservationApi } from '../../reservations/reservationApi';
import type { InfiniteReservationsModel, ReservationModel } from './types';

export const useReserveBook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: ReserveBookModel) =>
      reservationApi.reserveBook(params),
    onSuccess: (data: ReservationModel) => {
      queryClient.setQueriesData<InfiniteReservationsModel>(
        { queryKey: ['reservations'], exact: false },
        (oldData) => {
          if (!oldData) return oldData;

          const newPages = [...oldData.pages];
          newPages[0] = {
            ...newPages[0],
            items: [data, ...newPages[0].items],
          };

          return {
            pageParams: oldData.pageParams,
            pages: newPages,
          };
        }
      );
    },
  });
};
