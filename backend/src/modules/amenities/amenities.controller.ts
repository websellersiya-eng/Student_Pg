import { sendSuccess } from "../../shared/response/api-response.js";
import { asyncHandler } from "../../shared/utils/async-handler.js";
import { amenitiesService } from "./amenities.service.js";

export const amenitiesController = {
  list: asyncHandler(async (_req, res) => {
    const amenities = await amenitiesService.list();
    sendSuccess(res, 200, "Amenities fetched successfully", amenities);
  }),

  create: asyncHandler(async (req, res) => {
    const amenity = await amenitiesService.create(req.body);
    sendSuccess(res, 201, "Amenity created successfully", amenity);
  })
};
