import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validation.middleware.js";
import { asyncHandler } from "../../shared/utils/async-handler.js";
import { sendSuccess } from "../../shared/response/api-response.js";
import { profileService } from "./profile.service.js";
import { changePasswordSchema, updateProfileSchema } from "./profile.schema.js";

export const profileRoutes = Router();

profileRoutes.use(authenticate);

profileRoutes.patch(
  "/",
  validate(updateProfileSchema),
  asyncHandler(async (req, res) => {
    const user = await profileService.update(req.user!.id, req.body);
    sendSuccess(res, 200, "Profile updated successfully", user);
  })
);

profileRoutes.patch(
  "/password",
  validate(changePasswordSchema),
  asyncHandler(async (req, res) => {
    await profileService.changePassword(req.user!.id, req.body);
    sendSuccess(res, 200, "Password changed successfully");
  })
);
