import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { config } from "../app/config.js";
import { logger } from "../infra/logger/logger.js";
import { AppError } from "../shared/errors/app-error.js";

export const errorMiddleware: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: error.flatten()
    });
    return;
  }

  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
      ...(error.errors ? { errors: error.errors } : {})
    });
    return;
  }

  logger.error({ error }, "Unhandled application error");

  res.status(500).json({
    success: false,
    message: "Internal server error",
    ...(config.NODE_ENV === "development" ? { error: String(error) } : {})
  });
};
