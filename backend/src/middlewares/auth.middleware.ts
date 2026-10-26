import type { RequestHandler } from "express";
import { verifyAccessToken } from "../infra/security/jwt.js";
import { AppError } from "../shared/errors/app-error.js";

export const authenticate: RequestHandler = (req, _res, next) => {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    next(new AppError(401, "Authentication token is required"));
    return;
  }

  try {
    const token = header.slice("Bearer ".length);
    const payload = verifyAccessToken(token);
    req.user = {
      id: payload.sub,
      role: payload.role,
      email: payload.email
    };
    next();
  } catch {
    next(new AppError(401, "Invalid or expired authentication token"));
  }
};
