import crypto from "node:crypto";
import { UserRole } from "@prisma/client";
import { AppError } from "../../shared/errors/app-error.js";
import { hashPassword, verifyPassword } from "../../infra/security/password.js";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../../infra/security/jwt.js";
import { authRepository } from "./auth.repository.js";
import type { LoginInput, RefreshInput, RegisterOwnerInput, RegisterStudentInput } from "./auth.schema.js";

const hashToken = (token: string) => crypto.createHash("sha256").update(token).digest("hex");

const refreshExpiryDate = () => {
  const date = new Date();
  date.setDate(date.getDate() + 7);
  return date;
};

const issueTokens = async (user: { id: string; role: UserRole; email: string }) => {
  const payload = { sub: user.id, role: user.role, email: user.email };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);
  await authRepository.createRefreshToken(user.id, hashToken(refreshToken), refreshExpiryDate());

  return { accessToken, refreshToken };
};

export const authService = {
  registerStudent: async (input: RegisterStudentInput) => {
    const existing = await authRepository.findUserByEmail(input.email);
    if (existing) throw new AppError(409, "Email is already registered");

    const user = await authRepository.createUserWithProfile(
      {
        name: input.name,
        email: input.email.toLowerCase(),
        passwordHash: await hashPassword(input.password),
        phone: input.phone,
        role: "STUDENT"
      },
      {
        collegeName: input.collegeName,
        courseName: input.courseName,
        preferredCity: input.preferredCity,
        guardianPhone: input.guardianPhone
      },
      "STUDENT"
    );

    return { user, ...(await issueTokens(user)) };
  },

  registerOwner: async (input: RegisterOwnerInput) => {
    const existing = await authRepository.findUserByEmail(input.email);
    if (existing) throw new AppError(409, "Email is already registered");
    // Admin accounts are created only via seed/direct DB — no public signup

    const user = await authRepository.createUserWithProfile(
      {
        name: input.name,
        email: input.email.toLowerCase(),
        passwordHash: await hashPassword(input.password),
        phone: input.phone,
        role: "OWNER"
      },
      {
        businessName: input.businessName,
        address: input.address,
        verificationId: input.verificationId
      },
      "OWNER"
    );

    return { user, ...(await issueTokens(user)) };
  },

  login: async (input: LoginInput) => {
    const user = await authRepository.findUserByEmail(input.email.toLowerCase());
    if (!user || !(await verifyPassword(input.password, user.passwordHash))) {
      throw new AppError(401, "Invalid email or password");
    }

    if (user.status !== "ACTIVE") {
      throw new AppError(403, "Account is not active");
    }

    const publicUser = await authRepository.findPublicUserById(user.id);
    if (!publicUser) throw new AppError(404, "User not found");

    return { user: publicUser, ...(await issueTokens(user)) };
  },

  me: async (userId: string) => {
    const user = await authRepository.findPublicUserById(userId);
    if (!user) throw new AppError(404, "User not found");
    return user;
  },

  refresh: async (input: RefreshInput) => {
    const payload = verifyRefreshToken(input.refreshToken);
    const storedToken = await authRepository.findRefreshToken(hashToken(input.refreshToken));

    if (!storedToken || storedToken.revokedAt || storedToken.expiresAt < new Date()) {
      throw new AppError(401, "Invalid refresh token");
    }

    await authRepository.revokeRefreshToken(hashToken(input.refreshToken));
    return issueTokens({ id: payload.sub, role: payload.role, email: payload.email });
  },

  logout: async (refreshToken: string) => {
    await authRepository.revokeRefreshToken(hashToken(refreshToken));
  }
};
