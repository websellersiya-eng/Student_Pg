import { sendSuccess } from "../../shared/response/api-response.js";
import { asyncHandler } from "../../shared/utils/async-handler.js";
import { usersRepository } from "./users.repository.js";
import type { UserRole, UserStatus } from "@prisma/client";

export const usersController = {
  list: asyncHandler(async (req, res) => {
    const users = await usersRepository.list(req.query as { role?: UserRole; status?: UserStatus });
    sendSuccess(res, 200, "Users fetched successfully", users);
  }),

  updateStatus: asyncHandler(async (req, res) => {
    const user = await usersRepository.updateStatus(req.params.id ?? "", req.body.status);
    sendSuccess(res, 200, "User status updated successfully", user);
  })
};
