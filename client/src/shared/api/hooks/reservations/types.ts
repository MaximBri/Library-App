import type { User } from '@/shared/hooks/useAuth';
import type { BookModel } from '../books/types';

export interface InfiniteReservationList {
  nextCursor: number | null;
  hasMore: boolean;
  items: ReservationModel[];
}

export type ReservationStatus =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'completed';

export interface ReservationModel {
  book: Omit<BookModel, 'isReserved'>;
  bookId: number;
  id: number;
  librarianComment?: string;
  requestedEndDate: string;
  requestedStartDate: string;
  returnedAt?: string;
  reviewedAt?: string;
  status: ReservationStatus;
  updatedAt: string;
  userComment?: string;
  userId: number;
  user: Omit<NonNullable<User>, 'role'>;
}

export interface ReserveBookModel {
  bookId: number;
  requestedStartDate: string;
  requestedEndDate: string;
  userComment?: string | undefined;
}

export interface ReservationChangeStatusModel {
  status: 'approved' | 'rejected' | 'completed';
  librarianComment: string;
}

export interface InfiniteReservationsModel {
  pageParams: unknown[];
  pages: InfiniteReservationList[];
}

export interface UseChangeReservationStatusParams {
  reservationId: number;
  params: ReservationChangeStatusModel;
}

export interface UseChangeReservationStatusResponse
  extends UseChangeReservationStatusParams {
  bookId: number;
}

export interface GetReservationParams {
  limit?: number;
  status?: string;
  cursor?: number | null;
}

export type UseGetReservationsParams = Omit<GetReservationParams, 'cursor'>
