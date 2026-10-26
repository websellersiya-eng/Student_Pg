import { sendSuccess } from "../../shared/response/api-response.js";
import { asyncHandler } from "../../shared/utils/async-handler.js";
import { reviewsService } from "./reviews.service.js";

export const reviewsController = {
  create: asyncHandler(async (req, res) => {
    const review = await reviewsService.create(req.user!.id, req.body);
    sendSuccess(res, 201, "Review submitted successfully", review);
  }),

  listByProperty: asyncHandler(async (req, res) => {
    const reviews = await reviewsService.listByProperty(req.params.propertyId ?? "");
    sendSuccess(res, 200, "Reviews fetched successfully", reviews);
  }),

  adminList: asyncHandler(async (_req, res) => {
    const reviews = await reviewsService.adminList();
    sendSuccess(res, 200, "Reviews fetched successfully", reviews);
  })
};
