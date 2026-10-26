import cors from "cors";
import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { config } from "./config.js";
import { routes } from "./routes.js";
import { errorMiddleware } from "../middlewares/error.middleware.js";
import { notFoundMiddleware } from "../middlewares/not-found.middleware.js";
import { httpLogger } from "../infra/logger/http-logger.js";

export const createApp = () => {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: config.CORS_ORIGIN, credentials: true }));
  app.use(express.json({ limit: "1mb" }));
  app.use(httpLogger);
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: 300,
      standardHeaders: true,
      legacyHeaders: false
    })
  );

  app.get("/health", (_req, res) => {
    res.status(200).json({ success: true, message: "NearStay API is healthy" });
  });

  app.use("/api/v1", routes);
  app.use(notFoundMiddleware);
  app.use(errorMiddleware);

  return app;
};
