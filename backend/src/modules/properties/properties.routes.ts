import { Router } from "express";
import { z } from "zod";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/role.middleware.js";
import { validate } from "../../middlewares/validation.middleware.js";
import { asyncHandler } from "../../shared/utils/async-handler.js";
import { sendSuccess } from "../../shared/response/api-response.js";
import { propertiesController } from "./properties.controller.js";
import {
  createPropertySchema,
  moderationSchema,
  propertyIdParamsSchema,
  propertySearchQuerySchema,
  propertySlugParamsSchema,
  updatePropertySchema
} from "./properties.schema.js";

export const propertiesRoutes = Router();

const adminPropertyQuerySchema = z.object({
  status: z.enum(["PENDING", "APPROVED", "REJECTED", "SUSPENDED"]).optional()
});

propertiesRoutes.get("/", validate(propertySearchQuerySchema, "query"), propertiesController.search);
propertiesRoutes.get(
  "/owner/me",
  authenticate,
  authorize("OWNER"),
  propertiesController.ownerList
);
propertiesRoutes.get(
  "/admin",
  authenticate,
  authorize("ADMIN"),
  validate(adminPropertyQuerySchema, "query"),
  propertiesController.adminList
);
propertiesRoutes.get("/:slug", validate(propertySlugParamsSchema, "params"), propertiesController.publicDetail);
propertiesRoutes.post("/", authenticate, authorize("OWNER"), validate(createPropertySchema), propertiesController.create);
propertiesRoutes.patch(
  "/:id",
  authenticate,
  authorize("OWNER"),
  validate(propertyIdParamsSchema, "params"),
  validate(updatePropertySchema),
  propertiesController.update
);
propertiesRoutes.post(
  "/:id/submit",
  authenticate,
  authorize("OWNER"),
  validate(propertyIdParamsSchema, "params"),
  propertiesController.submit
);
propertiesRoutes.patch(
  "/:id/moderation",
  authenticate,
  authorize("ADMIN"),
  validate(propertyIdParamsSchema, "params"),
  validate(moderationSchema),
  propertiesController.moderate
);
propertiesRoutes.delete(
  "/:id",
  authenticate,
  authorize("OWNER"),
  validate(propertyIdParamsSchema, "params"),
  propertiesController.remove
);

// Inquiries
import { inquiryService } from "./inquiry.service.js";
import { createInquirySchema, propertyIdParamsSchema as inquiryPropertyParams } from "./inquiry.schema.js";

propertiesRoutes.post(
  "/:propertyId/inquiries",
  validate(inquiryPropertyParams, "params"),
  validate(createInquirySchema),
  asyncHandler(async (req, res) => {
    const inquiry = await inquiryService.create(req.params.propertyId!, req.body, req.user?.id);
    sendSuccess(res, 201, "Inquiry sent successfully", inquiry);
  })
);
propertiesRoutes.get(
  "/inquiries/owner/me",
  authenticate,
  authorize("OWNER"),
  asyncHandler(async (req, res) => {
    const inquiries = await inquiryService.ownerList(req.user!.id);
    sendSuccess(res, 200, "Inquiries fetched successfully", inquiries);
  })
);
propertiesRoutes.get(
  "/inquiries/admin",
  authenticate,
  authorize("ADMIN"),
  asyncHandler(async (_req, res) => {
    const inquiries = await inquiryService.adminList();
    sendSuccess(res, 200, "Inquiries fetched successfully", inquiries);
  })
);

const inquiryStatusParamsSchema = z.object({ id: z.string().uuid() });
const inquiryStatusBodySchema = z.object({ status: z.enum(["NEW", "CONTACTED", "CLOSED"]) });

propertiesRoutes.patch(
  "/inquiries/:id/status",
  authenticate,
  authorize("OWNER"),
  validate(inquiryStatusParamsSchema, "params"),
  validate(inquiryStatusBodySchema),
  asyncHandler(async (req, res) => {
    const inquiry = await inquiryService.updateStatus(req.user!.id, req.params.id ?? "", req.body.status);
    sendSuccess(res, 200, "Inquiry status updated successfully", inquiry);
  })
);
