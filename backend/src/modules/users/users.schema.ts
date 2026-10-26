import { z } from "zod";

export const userQuerySchema = z.object({
  role: z.enum(["STUDENT", "OWNER", "ADMIN"]).optional(),
  status: z.enum(["ACTIVE", "INACTIVE", "SUSPENDED"]).optional()
});

export const updateUserStatusSchema = z.object({
  status: z.enum(["ACTIVE", "INACTIVE", "SUSPENDED"])
});

export const userIdParamsSchema = z.object({
  id: z.string().uuid()
});
