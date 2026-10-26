import { z } from "zod";

export const createAmenitySchema = z.object({
  name: z.string().min(2).max(120),
  icon: z.string().max(80).optional(),
  isActive: z.boolean().optional()
});

export type CreateAmenityInput = z.infer<typeof createAmenitySchema>;
