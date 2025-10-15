import {
  QueryClient,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { reservationApi } from '../../reservations/reservationApi';
import type {
  InfiniteReservationsModel,
  ReservationModel,
  UseChangeReservationStatusResponse,
} from './types';

export const updateReservationsCache = (
  queryClient: QueryClient,
  payload: ReservationModel,
  key: string
) => {
  queryClient.setQueriesData<InfiniteReservationsModel>(
    { queryKey: [key], exact: false },
    (oldData) => {
      if (!oldData) return oldData;
      const newPages = oldData.pages.map((page) => ({
        ...page,
        items: page.items.map((r) => (r.id === payload.id ? payload : r)),
      }));
      return { ...oldData, pages: newPages };
    }
  );
};

export const useChangeReservationStatus = (libraryId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      reservationId,
      params,
    }: UseChangeReservationStatusResponse) =>
      reservationApi.changeReservationStatus(reservationId, params),
    onSuccess: (
      payload: ReservationModel,
      response: UseChangeReservationStatusResponse
    ) => {
      updateReservationsCache(queryClient, payload, 'reservations');
      updateReservationsCache(queryClient, payload, 'my-reservations');

      if (response.params.status !== 'rejected') {
        queryClient.setQueryData<InfiniteReservationsModel>(
          ['libraryBooks', libraryId],
          (books) => {
            if (!books) return books;

            const newPages = books.pages.map((page) => ({
              ...page,
              items: page.items.map((book) => {
                if (book.id === response.bookId) {
                  return {
                    ...book,
                    isReserved: response.params.status !== 'completed',
                  };
                }
                return book;
              }),
            }));

            return { pageParams: books.pageParams, pages: newPages };
          }
        );
      }
    },
  });
};
