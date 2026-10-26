import jwt, { type SignOptions } from "jsonwebtoken";
import type { UserRole } from "@prisma/client";
import { config } from "../../app/config.js";

export type JwtPayload = {
  sub: string;
  role: UserRole;
  email: string;
};

export const signAccessToken = (payload: JwtPayload) =>
  jwt.sign(payload, config.JWT_SECRET, {
    expiresIn: config.JWT_ACCESS_EXPIRES_IN
  } as SignOptions);

export const signRefreshToken = (payload: JwtPayload) =>
  jwt.sign(payload, config.JWT_REFRESH_SECRET, {
    expiresIn: config.JWT_REFRESH_EXPIRES_IN
  } as SignOptions);

export const verifyAccessToken = (token: string) => jwt.verify(token, config.JWT_SECRET) as JwtPayload;

export const verifyRefreshToken = (token: string) => jwt.verify(token, config.JWT_REFRESH_SECRET) as JwtPayload;
