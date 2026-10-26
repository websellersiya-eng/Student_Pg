import { sendSuccess } from "../../shared/response/api-response.js";
import { asyncHandler } from "../../shared/utils/async-handler.js";
import { bookingsService } from "./bookings.service.js";

export const bookingsController = {
  create: asyncHandler(async (req, res) => {
    const booking = await bookingsService.create(req.user!.id, req.body);
    sendSuccess(res, 201, "Booking request sent successfully", booking);
  }),

  studentList: asyncHandler(async (req, res) => {
    const bookings = await bookingsService.studentList(req.user!.id);
    sendSuccess(res, 200, "Student bookings fetched successfully", bookings);
  }),

  ownerList: asyncHandler(async (req, res) => {
    const bookings = await bookingsService.ownerList(req.user!.id);
    sendSuccess(res, 200, "Owner booking requests fetched successfully", bookings);
  }),

  updateByOwner: asyncHandler(async (req, res) => {
    const booking = await bookingsService.updateByOwner(req.params.id ?? "", req.user!.id, req.body);
    sendSuccess(res, 200, "Booking status updated successfully", booking);
  }),

  cancelByStudent: asyncHandler(async (req, res) => {
    const booking = await bookingsService.cancelByStudent(req.params.id ?? "", req.user!.id);
    sendSuccess(res, 200, "Booking cancelled successfully", booking);
  }),

  adminList: asyncHandler(async (_req, res) => {
    const bookings = await bookingsService.adminList();
    sendSuccess(res, 200, "Bookings fetched successfully", bookings);
  })
};
