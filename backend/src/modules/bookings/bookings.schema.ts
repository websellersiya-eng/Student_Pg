import { z } from "zod";

export const createBookingSchema = z.object({
  propertyId: z.string().uuid(),
  message: z.string().max(500).optional(),
  requestedMoveIn: z.coerce.date().optional()
});

export const updateBookingStatusSchema = z.object({
  status: z.enum(["ACCEPTED", "REJECTED", "CANCELLED", "COMPLETED"]),
  ownerResponse: z.string().max(500).optional()
});

export const bookingIdParamsSchema = z.object({
  id: z.string().uuid()
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type UpdateBookingStatusInput = z.infer<typeof updateBookingStatusSchema>;
