import type z from "zod";
import { createReservationSchema } from "./constants";

export const createReservationFormSchema = createReservationSchema.omit({
  bookId: true,
});
export type CreateReservationForm = z.infer<typeof createReservationFormSchema>;
