import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/role.middleware.js";
import { validate } from "../../middlewares/validation.middleware.js";
import { updateUserStatusSchema, userIdParamsSchema, userQuerySchema } from "./users.schema.js";
import { usersController } from "./users.controller.js";

export const usersRoutes = Router();

usersRoutes.use(authenticate, authorize("ADMIN"));
usersRoutes.get("/", validate(userQuerySchema, "query"), usersController.list);
usersRoutes.patch(
  "/:id/status",
  validate(userIdParamsSchema, "params"),
  validate(updateUserStatusSchema),
  usersController.updateStatus
);
