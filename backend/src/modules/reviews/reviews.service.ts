import { AppError } from "../../shared/errors/app-error.js";
import { reviewsRepository } from "./reviews.repository.js";
import type { CreateReviewInput } from "./reviews.schema.js";

export const reviewsService = {
  create: async (studentId: string, input: CreateReviewInput) => {
    const booking = await reviewsRepository.findEligibleBooking(input.bookingId, studentId);
    if (!booking) throw new AppError(403, "Review is allowed only after a completed booking");

    return reviewsRepository.create(studentId, booking.propertyId, input);
  },

  listByProperty: (propertyId: string) => reviewsRepository.listByProperty(propertyId),

  adminList: () => reviewsRepository.listAdmin()
};
