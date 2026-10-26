import pinoHttpModule from "pino-http";
import type { HttpLogger } from "pino-http";
import { logger } from "./logger.js";

export const httpLogger = (
  pinoHttpModule as unknown as (opts: { logger: unknown; redact: string[] }) => HttpLogger
)({
  logger,
  redact: ["req.headers.authorization"]
});
