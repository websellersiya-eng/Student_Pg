import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z.string().min(2).max(120).optional(),
  phone: z.string().max(20).optional(),
  businessName: z.string().max(160).optional(),
  address: z.string().max(255).optional(),
  collegeName: z.string().max(160).optional(),
  courseName: z.string().max(120).optional(),
  preferredCity: z.string().max(120).optional(),
  guardianPhone: z.string().max(20).optional()
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8).max(72)
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
