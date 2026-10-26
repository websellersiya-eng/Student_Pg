import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validation.middleware.js";
import { authController } from "./auth.controller.js";
import {
  loginSchema,
  logoutSchema,
  refreshSchema,
  registerOwnerSchema,
  registerStudentSchema
} from "./auth.schema.js";

export const authRoutes = Router();

authRoutes.post("/register/student", validate(registerStudentSchema), authController.registerStudent);
authRoutes.post("/register/owner", validate(registerOwnerSchema), authController.registerOwner);
authRoutes.post("/login", validate(loginSchema), authController.login);
authRoutes.get("/me", authenticate, authController.me);
authRoutes.post("/refresh", validate(refreshSchema), authController.refresh);
authRoutes.post("/logout", validate(logoutSchema), authController.logout);
