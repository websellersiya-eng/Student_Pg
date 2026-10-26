import { sendSuccess } from "../../shared/response/api-response.js";
import { asyncHandler } from "../../shared/utils/async-handler.js";
import { authService } from "./auth.service.js";

export const authController = {
  registerStudent: asyncHandler(async (req, res) => {
    const result = await authService.registerStudent(req.body);
    sendSuccess(res, 201, "Student registered successfully", result);
  }),

  registerOwner: asyncHandler(async (req, res) => {
    const result = await authService.registerOwner(req.body);
    sendSuccess(res, 201, "Owner registered successfully", result);
  }),

  login: asyncHandler(async (req, res) => {
    const result = await authService.login(req.body);
    sendSuccess(res, 200, "Logged in successfully", result);
  }),

  me: asyncHandler(async (req, res) => {
    const result = await authService.me(req.user!.id);
    sendSuccess(res, 200, "Profile fetched successfully", result);
  }),

  refresh: asyncHandler(async (req, res) => {
    const result = await authService.refresh(req.body);
    sendSuccess(res, 200, "Token refreshed successfully", result);
  }),

  logout: asyncHandler(async (req, res) => {
    await authService.logout(req.body.refreshToken);
    sendSuccess(res, 200, "Logged out successfully");
  })
};
