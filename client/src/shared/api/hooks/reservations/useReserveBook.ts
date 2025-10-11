import { useMutation } from '@tanstack/react-query';
import type { ReserveBookModel } from '../books/types';
import { reservationApi } from '../../reservations/reservationApi';

export const useReserveBook = () => {
  return useMutation({
    mutationFn: (params: ReserveBookModel) =>
      reservationApi.reserveBook(params),
  });
};
