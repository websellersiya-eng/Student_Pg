import { prisma } from "../../db/prisma.js";
import type { CreateReviewInput } from "./reviews.schema.js";

export const reviewsRepository = {
  findEligibleBooking: (bookingId: string, studentId: string) =>
    prisma.booking.findFirst({
      where: { id: bookingId, studentId, status: "COMPLETED" }
    }),

  create: (studentId: string, propertyId: string, input: CreateReviewInput) =>
    prisma.review.create({
      data: {
        studentId,
        propertyId,
        bookingId: input.bookingId,
        rating: input.rating,
        comment: input.comment
      },
      include: { student: { select: { id: true, name: true } } }
    }),

  listByProperty: (propertyId: string) =>
    prisma.review.findMany({
      where: { propertyId },
      include: { student: { select: { id: true, name: true } } },
      orderBy: { createdAt: "desc" }
    }),

  listAdmin: () =>
    prisma.review.findMany({
      include: {
        student: { select: { id: true, name: true, email: true } },
        property: { select: { id: true, name: true } }
      },
      orderBy: { createdAt: "desc" }
    })
};
