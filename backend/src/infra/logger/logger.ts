import pino from "pino";
import { config } from "../../app/config.js";

export const logger = pino({
  level: config.LOG_LEVEL,
  redact: ["req.headers.authorization", "password", "token", "refreshToken"]
});
