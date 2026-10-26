import { apiClient } from "@/lib/api-client";
import type { ApiResponse } from "@/types/api";
import type { Booking, Property, User } from "@/types/domain";

export const adminService = {
  dashboard: () =>
    apiClient<ApiResponse<Record<string, number>>>("/admin/dashboard"),

  users: (role?: string) =>
    apiClient<ApiResponse<User[]>>(`/users${role ? `?role=${role}` : ""}`),

  updateUserStatus: (id: string, status: string) =>
    apiClient<ApiResponse<User>>(`/users/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status })
    }),

  properties: () => apiClient<ApiResponse<Property[]>>("/properties/admin"),

  bookings: () => apiClient<ApiResponse<Booking[]>>("/bookings/admin"),

  reviews: () => apiClient<ApiResponse<{ id: string; rating: number; comment?: string }[]>>("/reviews/admin")
};
