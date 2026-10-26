import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/role.middleware.js";
import { adminController } from "./admin.controller.js";

export const adminRoutes = Router();

adminRoutes.use(authenticate, authorize("ADMIN"));
adminRoutes.get("/dashboard", adminController.dashboard);
