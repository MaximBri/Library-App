import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reservationApi } from '../../reservations/reservationApi';
import { updateReservationsCache } from './useChangeReservationStatus';

export const useCancelReservation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reservationId: number) =>
      reservationApi.cancelReservation(reservationId),
    onSuccess: (payload) => {
      updateReservationsCache(queryClient, payload, 'my-reservations');
    },
  });
};
