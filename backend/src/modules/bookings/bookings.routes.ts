import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/role.middleware.js";
import { validate } from "../../middlewares/validation.middleware.js";
import { bookingsController } from "./bookings.controller.js";
import { bookingIdParamsSchema, createBookingSchema, updateBookingStatusSchema } from "./bookings.schema.js";

export const bookingsRoutes = Router();

bookingsRoutes.use(authenticate);
bookingsRoutes.post("/", authorize("STUDENT"), validate(createBookingSchema), bookingsController.create);
bookingsRoutes.get("/student/me", authorize("STUDENT"), bookingsController.studentList);
bookingsRoutes.get("/owner/me", authorize("OWNER"), bookingsController.ownerList);
bookingsRoutes.get("/admin", authorize("ADMIN"), bookingsController.adminList);
bookingsRoutes.patch(
  "/:id/status",
  authorize("OWNER"),
  validate(bookingIdParamsSchema, "params"),
  validate(updateBookingStatusSchema),
  bookingsController.updateByOwner
);
bookingsRoutes.patch(
  "/:id/cancel",
  authorize("STUDENT"),
  validate(bookingIdParamsSchema, "params"),
  bookingsController.cancelByStudent
);
