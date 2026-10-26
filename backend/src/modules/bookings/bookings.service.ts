import { AppError } from "../../shared/errors/app-error.js";
import { bookingsRepository } from "./bookings.repository.js";
import type { CreateBookingInput, UpdateBookingStatusInput } from "./bookings.schema.js";

export const bookingsService = {
  create: async (studentId: string, input: CreateBookingInput) => {
    const property = await bookingsRepository.findApprovedProperty(input.propertyId);
    if (!property) throw new AppError(404, "Property is not available for booking");

    const duplicate = await bookingsRepository.findActiveDuplicate(studentId, input.propertyId);
    if (duplicate) throw new AppError(409, "You already have an active booking request for this property");

    return bookingsRepository.create(studentId, input);
  },

  studentList: (studentId: string) => bookingsRepository.listForStudent(studentId),

  ownerList: (ownerUserId: string) => bookingsRepository.listForOwner(ownerUserId),

  updateByOwner: async (bookingId: string, ownerUserId: string, input: UpdateBookingStatusInput) => {
    const result = await bookingsRepository.updateByOwner(bookingId, ownerUserId, input);
    if (result.count === 0) throw new AppError(404, "Booking request not found");
    return bookingsRepository.findById(bookingId);
  },

  cancelByStudent: async (bookingId: string, studentId: string) => {
    const result = await bookingsRepository.cancelByStudent(bookingId, studentId);
    if (result.count === 0) throw new AppError(404, "Booking request not found or cannot be cancelled");
    return bookingsRepository.findById(bookingId);
  },

  adminList: () => bookingsRepository.listAdmin()
};
