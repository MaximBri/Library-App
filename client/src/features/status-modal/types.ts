import type { UpdateReservationStatusInput } from "../reserve-book/constants";

export type StatusModalProps = {
  open: boolean;
  initialStatus: UpdateReservationStatusInput['status'];
  reservationId: number;
  onClose: () => void;
  onSubmit: (
    data: UpdateReservationStatusInput & { librarianComment?: string | null }
  ) => void;
  isLoading?: boolean;
};