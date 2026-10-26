import { apiClient } from "@/lib/api-client";
import type { ApiResponse } from "@/types/api";
import type { User } from "@/types/domain";

type AuthResult = {
  user: User;
  accessToken: string;
  refreshToken: string;
};

export const authService = {
  login: (input: { email: string; password: string }) =>
    apiClient<ApiResponse<AuthResult>>("/auth/login", {
      method: "POST",
      body: JSON.stringify(input)
    }),

  registerStudent: (input: Record<string, string>) =>
    apiClient<ApiResponse<AuthResult>>("/auth/register/student", {
      method: "POST",
      body: JSON.stringify(input)
    }),

  registerOwner: (input: Record<string, string>) =>
    apiClient<ApiResponse<AuthResult>>("/auth/register/owner", {
      method: "POST",
      body: JSON.stringify(input)
    }),

  me: () => apiClient<ApiResponse<User>>("/auth/me"),

  logout: (refreshToken: string) =>
    apiClient<ApiResponse<null>>("/auth/logout", {
      method: "POST",
      body: JSON.stringify({ refreshToken })
    })
};

export const profileService = {
  update: (input: Record<string, unknown>) =>
    apiClient<ApiResponse<User>>("/profile", {
      method: "PATCH",
      body: JSON.stringify(input)
    }),

  changePassword: (input: { currentPassword: string; newPassword: string }) =>
    apiClient<ApiResponse<null>>("/profile/password", {
      method: "PATCH",
      body: JSON.stringify(input)
    })
};
