import { prisma } from "../../db/prisma.js";

export const adminRepository = {
  dashboard: async () => {
    const [
      totalStudents,
      totalOwners,
      totalProperties,
      pendingProperties,
      approvedProperties,
      totalBookings,
      totalReviews
    ] = await prisma.$transaction([
      prisma.user.count({ where: { role: "STUDENT" } }),
      prisma.user.count({ where: { role: "OWNER" } }),
      prisma.property.count(),
      prisma.property.count({ where: { status: "PENDING" } }),
      prisma.property.count({ where: { status: "APPROVED" } }),
      prisma.booking.count(),
      prisma.review.count()
    ]);

    return {
      totalStudents,
      totalOwners,
      totalProperties,
      pendingProperties,
      approvedProperties,
      totalBookings,
      totalReviews
    };
  }
};
