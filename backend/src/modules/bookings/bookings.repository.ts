import { prisma } from "../../db/prisma.js";
import type { CreateBookingInput, UpdateBookingStatusInput } from "./bookings.schema.js";

const bookingInclude = {
  property: {
    include: {
      city: true,
      locality: true,
      owner: { include: { user: { select: { id: true, name: true, email: true, phone: true } } } }
    }
  },
  student: { select: { id: true, name: true, email: true, phone: true } },
  review: true
};

export const bookingsRepository = {
  findApprovedProperty: (propertyId: string) =>
    prisma.property.findFirst({
      where: { id: propertyId, status: "APPROVED", isActive: true }
    }),

  findActiveDuplicate: (studentId: string, propertyId: string) =>
    prisma.booking.findFirst({
      where: { studentId, propertyId, status: { in: ["PENDING", "ACCEPTED"] } }
    }),

  create: (studentId: string, input: CreateBookingInput) =>
    prisma.booking.create({
      data: {
        studentId,
        propertyId: input.propertyId,
        message: input.message,
        requestedMoveIn: input.requestedMoveIn
      },
      include: bookingInclude
    }),

  listForStudent: (studentId: string) =>
    prisma.booking.findMany({
      where: { studentId },
      include: bookingInclude,
      orderBy: { createdAt: "desc" }
    }),

  listForOwner: (ownerUserId: string) =>
    prisma.booking.findMany({
      where: { property: { owner: { userId: ownerUserId } } },
      include: bookingInclude,
      orderBy: { createdAt: "desc" }
    }),

  updateByOwner: (bookingId: string, ownerUserId: string, input: UpdateBookingStatusInput) =>
    prisma.booking.updateMany({
      where: { id: bookingId, property: { owner: { userId: ownerUserId } } },
      data: {
        status: input.status,
        ownerResponse: input.ownerResponse,
        respondedAt: new Date()
      }
    }),

  cancelByStudent: (bookingId: string, studentId: string) =>
    prisma.booking.updateMany({
      where: { id: bookingId, studentId, status: { in: ["PENDING", "ACCEPTED"] } },
      data: { status: "CANCELLED" }
    }),

  findById: (id: string) => prisma.booking.findUnique({ where: { id }, include: bookingInclude }),

  listAdmin: () =>
    prisma.booking.findMany({
      include: bookingInclude,
      orderBy: { createdAt: "desc" }
    })
};
