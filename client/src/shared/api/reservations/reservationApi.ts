import api from '../axios';
import type { ReserveBookModel } from '../hooks/books/types';
import type {
  GetReservationParams,
  InfiniteReservationList,
  ReservationChangeStatusModel,
} from '../hooks/reservations/types';

export const reservationApi = {
  getReservations: async (
    params?: GetReservationParams
  ): Promise<InfiniteReservationList> => {
    const searchParams = new URLSearchParams();
    if (params?.limit) searchParams.set('limit', String(params.limit));
    if (params?.status && params.status !== 'all')
      searchParams.set('status', params.status);
    if (params?.cursor) searchParams.set('cursor', String(params.cursor));

    const url = `/api/reservations/library${
      searchParams.toString() ? `?${searchParams.toString()}` : ''
    }`;
    const { data } = await api.get(url);
    return data;
  },

  reserveBook: async (params: ReserveBookModel) => {
    const { data } = await api.post('/api/reservations', params);
    return data;
  },

  changeReservationStatus: async (
    reservationId: number,
    reservationParams: ReservationChangeStatusModel
  ) => {
    const { data } = await api.post(
      `/api/reservations/${reservationId}/review`,
      reservationParams
    );
    return data;
  },

  getMyReservations: async (
    userId: number,
    limit: number,
    status: string,
    cursor: number | null = null
  ) => {
    const searchParams = new URLSearchParams();
    if (limit) searchParams.set('limit', String(limit));
    if (status && status !== 'all') searchParams.set('status', status);

    const { data } = await api.get(
      `/api/reservations?userId=${userId}${
        searchParams.toString() ? `&${searchParams.toString()}` : ''
      }`,
      {
        params: { cursor },
      }
    );
    return data;
  },

  cancelReservation: async (reservationId: number) => {
    const { data } = await api.post(`/api/reservations/${reservationId}/cancel`);
    return data;
  },
};
