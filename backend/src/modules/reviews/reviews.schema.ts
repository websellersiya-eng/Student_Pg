import { z } from "zod";

export const createReviewSchema = z.object({
  bookingId: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(2000).optional()
});

export const propertyReviewParamsSchema = z.object({
  propertyId: z.string().uuid()
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;
