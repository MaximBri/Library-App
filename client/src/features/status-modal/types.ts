import type { UpdateReservationStatusInput } from "../reserve-book/constants";

export type StatusModalProps = {
  open: boolean;
  reservationId: number;
  onClose: () => void;
  onSubmit: (
    data: UpdateReservationStatusInput & { librarianComment?: string | null }
  ) => void;
  isLoading?: boolean;
};

export interface UpdateReservationForm {
  status: string;
  librarianComment?: string;
}


export interface StatusOptionsModel{
  text: string;
  value: UpdateReservationStatusInput['status'];
}
