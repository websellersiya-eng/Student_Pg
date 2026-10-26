import type { RequestHandler } from "express";
import type { ZodSchema } from "zod";

type RequestPart = "body" | "query" | "params";

export const validate =
  (schema: ZodSchema, part: RequestPart = "body"): RequestHandler =>
  (req, _res, next) => {
    const parsed = schema.parse(req[part]);
    req[part] = parsed;
    next();
  };
