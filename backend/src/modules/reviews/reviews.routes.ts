import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/role.middleware.js";
import { validate } from "../../middlewares/validation.middleware.js";
import { createReviewSchema, propertyReviewParamsSchema } from "./reviews.schema.js";
import { reviewsController } from "./reviews.controller.js";

export const reviewsRoutes = Router();

reviewsRoutes.get(
  "/properties/:propertyId",
  validate(propertyReviewParamsSchema, "params"),
  reviewsController.listByProperty
);
reviewsRoutes.post("/", authenticate, authorize("STUDENT"), validate(createReviewSchema), reviewsController.create);
reviewsRoutes.get("/admin", authenticate, authorize("ADMIN"), reviewsController.adminList);
