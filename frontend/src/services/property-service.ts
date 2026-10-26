import { apiClient } from "@/lib/api-client";
import type { ApiResponse, PaginatedApiResponse } from "@/types/api";
import type { Amenity, Booking, City, Inquiry, InquiryStatus, Property } from "@/types/domain";

export type PropertyFilters = {
  city?: string;
  locality?: string;
  q?: string;
  type?: string;
  gender?: string;
  minRent?: string;
  maxRent?: string;
  amenities?: string;
  lat?: string;
  lng?: string;
  radius?: string;
  page?: string;
};

const toQuery = (filters: PropertyFilters) => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });
  return params.toString();
};

export const propertyService = {
  search: (filters: PropertyFilters) =>
    apiClient<PaginatedApiResponse<Property>>(`/properties?${toQuery(filters)}`),

  detail: (slug: string) => apiClient<ApiResponse<Property>>(`/properties/${slug}`),

  ownerList: () => apiClient<ApiResponse<Property[]>>("/properties/owner/me"),

  create: (input: unknown) =>
    apiClient<ApiResponse<Property>>("/properties", {
      method: "POST",
      body: JSON.stringify(input)
    }),

  update: (id: string, input: unknown) =>
    apiClient<ApiResponse<Property>>(`/properties/${id}`, {
      method: "PATCH",
      body: JSON.stringify(input)
    }),

  remove: (id: string) =>
    apiClient<ApiResponse<null>>(`/properties/${id}`, { method: "DELETE" }),

  submit: (id: string) =>
    apiClient<ApiResponse<null>>(`/properties/${id}/submit`, { method: "POST" }),

  adminList: () => apiClient<ApiResponse<Property[]>>("/properties/admin"),

  moderate: (id: string, input: { status: string; rejectionReason?: string }) =>
    apiClient<ApiResponse<Property>>(`/properties/${id}/moderation`, {
      method: "PATCH",
      body: JSON.stringify(input)
    })
};

export const referenceService = {
  cities: () => apiClient<ApiResponse<City[]>>("/cities"),
  amenities: () => apiClient<ApiResponse<Amenity[]>>("/amenities")
};

export const bookingService = {
  create: (input: { propertyId: string; message?: string }) =>
    apiClient<ApiResponse<Booking>>("/bookings", { method: "POST", body: JSON.stringify(input) }),
  studentList: () => apiClient<ApiResponse<Booking[]>>("/bookings/student/me"),
  ownerList: () => apiClient<ApiResponse<Booking[]>>("/bookings/owner/me"),
  adminList: () => apiClient<ApiResponse<Booking[]>>("/bookings/admin"),
  updateStatus: (id: string, input: { status: string; ownerResponse?: string }) =>
    apiClient<ApiResponse<Booking>>(`/bookings/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify(input)
    })
};

export const favoriteService = {
  list: () => apiClient<ApiResponse<{ property: Property }[]>>("/favorites"),
  add: (propertyId: string) => apiClient<ApiResponse<unknown>>(`/favorites/${propertyId}`, { method: "POST" }),
  remove: (propertyId: string) =>
    apiClient<ApiResponse<unknown>>(`/favorites/${propertyId}`, { method: "DELETE" })
};

export const inquiryService = {
  create: (
    propertyId: string,
    input: { name: string; email: string; phone?: string; message?: string }
  ) =>
    apiClient<ApiResponse<unknown>>(`/properties/${propertyId}/inquiries`, {
      method: "POST",
      body: JSON.stringify(input)
    }),

  ownerList: () => apiClient<ApiResponse<Inquiry[]>>("/properties/inquiries/owner/me"),

  adminList: () => apiClient<ApiResponse<Inquiry[]>>("/properties/inquiries/admin"),

  updateStatus: (id: string, status: InquiryStatus) =>
    apiClient<ApiResponse<Inquiry>>(`/properties/inquiries/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status })
    })
};
