import { z } from "zod";

const passwordSchema = z.string().min(8).max(72);

export const registerStudentSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().max(180),
  password: passwordSchema,
  phone: z.string().max(20).optional(),
  collegeName: z.string().max(160).optional(),
  courseName: z.string().max(120).optional(),
  preferredCity: z.string().max(120).optional(),
  guardianPhone: z.string().max(20).optional()
});

export const registerOwnerSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().max(180),
  password: passwordSchema,
  phone: z.string().max(20).optional(),
  businessName: z.string().max(160).optional(),
  address: z.string().max(255).optional(),
  verificationId: z.string().max(80).optional()
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(1)
});

export const logoutSchema = refreshSchema;

export type RegisterStudentInput = z.infer<typeof registerStudentSchema>;
export type RegisterOwnerInput = z.infer<typeof registerOwnerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RefreshInput = z.infer<typeof refreshSchema>;
