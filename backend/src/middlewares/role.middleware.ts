import type { RequestHandler } from "express";
import type { UserRole } from "@prisma/client";
import { AppError } from "../shared/errors/app-error.js";

export const authorize =
  (...roles: UserRole[]): RequestHandler =>
  (req, _res, next) => {
    if (!req.user) {
      next(new AppError(401, "Authentication is required"));
      return;
    }

    if (!roles.includes(req.user.role)) {
      next(new AppError(403, "You are not authorized to perform this action"));
      return;
    }

    next();
  };
