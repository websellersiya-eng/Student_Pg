import { z } from "zod";

export const createInquirySchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().max(180),
  phone: z.string().max(20).optional(),
  message: z.string().max(800).optional()
});

export const inquiryIdParamsSchema = z.object({ id: z.string().uuid() });
export const propertyIdParamsSchema = z.object({ propertyId: z.string().uuid() });

export type CreateInquiryInput = z.infer<typeof createInquirySchema>;
