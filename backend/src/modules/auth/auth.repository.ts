import type { Prisma, UserRole } from "@prisma/client";
import { prisma } from "../../db/prisma.js";

const publicUserSelect = {
  id: true,
  name: true,
  email: true,
  phone: true,
  role: true,
  status: true,
  createdAt: true,
  studentProfile: true,
  ownerProfile: true
} satisfies Prisma.UserSelect;

export const authRepository = {
  findUserByEmail: (email: string) =>
    prisma.user.findUnique({
      where: { email },
      include: { studentProfile: true, ownerProfile: true }
    }),

  findPublicUserById: (id: string) =>
    prisma.user.findUnique({
      where: { id },
      select: publicUserSelect
    }),

  createUserWithProfile: (
    data: Prisma.UserCreateInput,
    profile: Prisma.StudentProfileCreateWithoutUserInput | Prisma.OwnerProfileCreateWithoutUserInput,
    role: UserRole
  ) =>
    prisma.user.create({
      data: {
        ...data,
        ...(role === "STUDENT"
          ? { studentProfile: { create: profile as Prisma.StudentProfileCreateWithoutUserInput } }
          : { ownerProfile: { create: profile as Prisma.OwnerProfileCreateWithoutUserInput } })
      },
      select: publicUserSelect
    }),

  createRefreshToken: (userId: string, tokenHash: string, expiresAt: Date) =>
    prisma.refreshToken.create({
      data: { userId, tokenHash, expiresAt }
    }),

  findRefreshToken: (tokenHash: string) =>
    prisma.refreshToken.findUnique({
      where: { tokenHash },
      include: { user: true }
    }),

  revokeRefreshToken: (tokenHash: string) =>
    prisma.refreshToken.updateMany({
      where: { tokenHash, revokedAt: null },
      data: { revokedAt: new Date() }
    })
};
