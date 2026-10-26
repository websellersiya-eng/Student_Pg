import { AppError } from "../../shared/errors/app-error.js";
import { hashPassword, verifyPassword } from "../../infra/security/password.js";
import { prisma } from "../../db/prisma.js";
import type { ChangePasswordInput, UpdateProfileInput } from "./profile.schema.js";

const publicSelect = {
  id: true, name: true, email: true, phone: true, role: true, status: true,
  studentProfile: true, ownerProfile: true, createdAt: true, updatedAt: true
};

export const profileService = {
  update: async (userId: string, input: UpdateProfileInput) => {
    const { name, phone, businessName, address, collegeName, courseName, preferredCity, guardianPhone } = input;

    return prisma.$transaction(async (tx) => {
      const user = await tx.user.update({
        where: { id: userId },
        data: { ...(name ? { name } : {}), ...(phone !== undefined ? { phone } : {}) },
        select: publicSelect
      });

      if (businessName !== undefined || address !== undefined) {
        await tx.ownerProfile.upsert({
          where: { userId },
          create: { userId, businessName, address },
          update: { ...(businessName !== undefined ? { businessName } : {}), ...(address !== undefined ? { address } : {}) }
        });
      }

      if (collegeName !== undefined || courseName !== undefined || preferredCity !== undefined || guardianPhone !== undefined) {
        await tx.studentProfile.upsert({
          where: { userId },
          create: { userId, collegeName, courseName, preferredCity, guardianPhone },
          update: {
            ...(collegeName !== undefined ? { collegeName } : {}),
            ...(courseName !== undefined ? { courseName } : {}),
            ...(preferredCity !== undefined ? { preferredCity } : {}),
            ...(guardianPhone !== undefined ? { guardianPhone } : {})
          }
        });
      }

      return tx.user.findUnique({ where: { id: userId }, select: publicSelect });
    });
  },

  changePassword: async (userId: string, input: ChangePasswordInput) => {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new AppError(404, "User not found");
    if (!(await verifyPassword(input.currentPassword, user.passwordHash))) {
      throw new AppError(400, "Current password is incorrect");
    }
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash: await hashPassword(input.newPassword) }
    });
  }
};
