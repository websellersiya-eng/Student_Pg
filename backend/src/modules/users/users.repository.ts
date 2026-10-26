import type { UserRole, UserStatus } from "@prisma/client";
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
};

export const usersRepository = {
  list: (filters: { role?: UserRole; status?: UserStatus }) =>
    prisma.user.findMany({
      where: filters,
      select: publicUserSelect,
      orderBy: { createdAt: "desc" }
    }),

  updateStatus: (id: string, status: UserStatus) =>
    prisma.user.update({
      where: { id },
      data: { status },
      select: publicUserSelect
    })
};
