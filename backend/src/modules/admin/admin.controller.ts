import { sendSuccess } from "../../shared/response/api-response.js";
import { asyncHandler } from "../../shared/utils/async-handler.js";
import { adminRepository } from "./admin.repository.js";

export const adminController = {
  dashboard: asyncHandler(async (_req, res) => {
    const dashboard = await adminRepository.dashboard();
    sendSuccess(res, 200, "Admin dashboard fetched successfully", dashboard);
  })
};
