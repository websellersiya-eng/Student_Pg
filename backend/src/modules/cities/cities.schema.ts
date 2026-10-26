import { z } from "zod";

export const createCitySchema = z.object({
  name: z.string().min(2).max(120),
  state: z.string().min(2).max(120),
  isActive: z.boolean().optional()
});

export const createLocalitySchema = z.object({
  cityId: z.string().uuid(),
  name: z.string().min(2).max(120),
  isActive: z.boolean().optional()
});

export const cityQuerySchema = z.object({
  activeOnly: z.coerce.boolean().optional()
});

export type CreateCityInput = z.infer<typeof createCitySchema>;
export type CreateLocalityInput = z.infer<typeof createLocalitySchema>;
