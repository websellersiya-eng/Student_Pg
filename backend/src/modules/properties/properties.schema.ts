import { z } from "zod";

export const propertyImageSchema = z.object({
  url: z.string().url().max(500),
  storageKey: z.string().max(255).optional(),
  altText: z.string().max(180).optional(),
  sortOrder: z.number().int().min(0).optional(),
  isCover: z.boolean().optional()
});

export const roomSchema = z.object({
  name: z.string().min(2).max(120),
  occupancy: z.number().int().positive(),
  totalBeds: z.number().int().positive(),
  availableBeds: z.number().int().min(0),
  monthlyRent: z.number().positive()
});

export const createPropertySchema = z.object({
  cityId: z.string().uuid(),
  localityId: z.string().uuid(),
  name: z.string().min(2).max(160),
  propertyType: z.enum(["PG", "HOSTEL"]),
  description: z.string().min(20),
  addressLine: z.string().min(5).max(255),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  monthlyRent: z.number().positive(),
  securityDeposit: z.number().min(0).optional(),
  genderPreference: z.enum(["MALE", "FEMALE", "ANY"]),
  availableBeds: z.number().int().min(0),
  totalBeds: z.number().int().positive(),
  rules: z.string().optional(),
  contactName: z.string().max(120).optional(),
  contactPhone: z.string().max(20).optional(),
  amenityIds: z.array(z.string().uuid()).default([]),
  images: z.array(propertyImageSchema).default([]),
  rooms: z.array(roomSchema).default([])
});

export const updatePropertySchema = createPropertySchema.partial().extend({
  amenityIds: z.array(z.string().uuid()).optional(),
  images: z.array(propertyImageSchema).optional(),
  rooms: z.array(roomSchema).optional()
});

export const propertySearchQuerySchema = z.object({
  city: z.string().optional(),
  locality: z.string().optional(),
  area: z.string().optional(),
  q: z.string().optional(),
  type: z.enum(["PG", "HOSTEL"]).optional(),
  gender: z.enum(["MALE", "FEMALE", "ANY"]).optional(),
  minRent: z.coerce.number().positive().optional(),
  maxRent: z.coerce.number().positive().optional(),
  availableOnly: z.coerce.boolean().optional(),
  amenities: z
    .string()
    .optional()
    .transform((value) => value?.split(",").filter(Boolean) ?? []),
  sort: z.enum(["rent_asc", "rent_desc", "newest"]).optional(),
  lat: z.coerce.number().min(-90).max(90).optional(),
  lng: z.coerce.number().min(-180).max(180).optional(),
  radius: z.coerce.number().positive().max(200).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(12)
});

export const propertyIdParamsSchema = z.object({
  id: z.string().uuid()
});

export const propertySlugParamsSchema = z.object({
  slug: z.string().min(1)
});

export const moderationSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED", "SUSPENDED"]),
  rejectionReason: z.string().max(500).optional()
});

export type CreatePropertyInput = z.infer<typeof createPropertySchema>;
export type UpdatePropertyInput = z.infer<typeof updatePropertySchema>;
export type PropertySearchQuery = z.infer<typeof propertySearchQuerySchema>;
export type ModerationInput = z.infer<typeof moderationSchema>;
