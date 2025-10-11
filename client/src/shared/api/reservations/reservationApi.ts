import api from '../axios';
import type { ReserveBookModel } from '../hooks/books/types';
import type { InfiniteReservationList } from '../hooks/reservations/types';

export const reservationApi = {
  getReservations: async (): Promise<InfiniteReservationList> => {
    const { data } = await api.get('/api/reservations/library');
    return data;
  },
  reserveBook: async (params: ReserveBookModel) => {
    const { data } = await api.post('/api/reservations', params);
    return data;
  },
};
