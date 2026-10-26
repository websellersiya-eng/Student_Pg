import { sendSuccess } from "../../shared/response/api-response.js";
import { asyncHandler } from "../../shared/utils/async-handler.js";
import { citiesService } from "./cities.service.js";

export const citiesController = {
  list: asyncHandler(async (req, res) => {
    const cities = await citiesService.list(req.query.activeOnly as boolean | undefined);
    sendSuccess(res, 200, "Cities fetched successfully", cities);
  }),

  createCity: asyncHandler(async (req, res) => {
    const city = await citiesService.createCity(req.body);
    sendSuccess(res, 201, "City created successfully", city);
  }),

  createLocality: asyncHandler(async (req, res) => {
    const locality = await citiesService.createLocality(req.body);
    sendSuccess(res, 201, "Locality created successfully", locality);
  })
};
