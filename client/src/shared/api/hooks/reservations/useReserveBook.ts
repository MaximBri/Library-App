import {
  QueryClient,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import type { ReserveBookModel } from '../books/types';
import { reservationApi } from '../../reservations/reservationApi';
import type { InfiniteReservationsModel, ReservationModel } from './types';

const updateCacheByKey = (
  queryClient: QueryClient,
  newValue: ReservationModel,
  key: string
) => {
  queryClient.setQueriesData<InfiniteReservationsModel>(
    { queryKey: [key], exact: false },
    (oldData) => {
      if (!oldData) return oldData;

      const newPages = [...oldData.pages];
      newPages[0] = {
        ...newPages[0],
        items: [newValue, ...newPages[0].items],
      };

      return {
        pageParams: oldData.pageParams,
        pages: newPages,
      };
    }
  );
};

export const useReserveBook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: ReserveBookModel) =>
      reservationApi.reserveBook(params),
    onSuccess: (data: ReservationModel) => {
      updateCacheByKey(queryClient, data, 'reservations');
      updateCacheByKey(queryClient, data, 'my-reservations');
    },
  });
};
