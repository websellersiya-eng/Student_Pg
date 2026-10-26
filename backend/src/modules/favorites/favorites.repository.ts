import { prisma } from "../../db/prisma.js";

export const favoritesRepository = {
  add: (studentId: string, propertyId: string) =>
    prisma.favorite.upsert({
      where: { studentId_propertyId: { studentId, propertyId } },
      create: { studentId, propertyId },
      update: {},
      include: { property: { include: { city: true, locality: true, images: true } } }
    }),

  remove: (studentId: string, propertyId: string) =>
    prisma.favorite.deleteMany({ where: { studentId, propertyId } }),

  list: (studentId: string) =>
    prisma.favorite.findMany({
      where: { studentId },
      include: { property: { include: { city: true, locality: true, images: true } } },
      orderBy: { createdAt: "desc" }
    }),

  check: (studentId: string, propertyId: string) =>
    prisma.favorite.findUnique({ where: { studentId_propertyId: { studentId, propertyId } } })
};
