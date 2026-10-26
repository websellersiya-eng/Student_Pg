import { sendSuccess } from "../../shared/response/api-response.js";
import { asyncHandler } from "../../shared/utils/async-handler.js";
import { propertiesService } from "./properties.service.js";
import type { PropertySearchQuery } from "./properties.schema.js";
import type { PropertyStatus } from "@prisma/client";

export const propertiesController = {
  search: asyncHandler(async (req, res) => {
    const result = await propertiesService.search(req.query as unknown as PropertySearchQuery);
    sendSuccess(res, 200, "Properties fetched successfully", result.data, result.pagination);
  }),

  publicDetail: asyncHandler(async (req, res) => {
    const property = await propertiesService.publicDetail(req.params.slug ?? "");
    sendSuccess(res, 200, "Property fetched successfully", property);
  }),

  create: asyncHandler(async (req, res) => {
    const property = await propertiesService.create(req.user!.id, req.body);
    sendSuccess(res, 201, "Property created successfully", property);
  }),

  update: asyncHandler(async (req, res) => {
    const property = await propertiesService.update(req.user!.id, req.params.id ?? "", req.body);
    sendSuccess(res, 200, "Property updated successfully", property);
  }),

  submit: asyncHandler(async (req, res) => {
    await propertiesService.submit(req.user!.id, req.params.id ?? "");
    sendSuccess(res, 200, "Property submitted for approval");
  }),

  ownerList: asyncHandler(async (req, res) => {
    const properties = await propertiesService.ownerList(req.user!.id);
    sendSuccess(res, 200, "Owner properties fetched successfully", properties);
  }),

  adminList: asyncHandler(async (req, res) => {
    const properties = await propertiesService.adminList(req.query.status as PropertyStatus | undefined);
    sendSuccess(res, 200, "Admin properties fetched successfully", properties);
  }),

  moderate: asyncHandler(async (req, res) => {
    const property = await propertiesService.moderate(req.params.id ?? "", req.body);
    sendSuccess(res, 200, "Property moderation updated successfully", property);
  }),

  remove: asyncHandler(async (req, res) => {
    await propertiesService.remove(req.user!.id, req.params.id ?? "");
    sendSuccess(res, 200, "Property deleted successfully");
  })
};
