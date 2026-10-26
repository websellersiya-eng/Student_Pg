import { z } from "zod";

export const favoriteParamsSchema = z.object({
  propertyId: z.string().uuid()
});
