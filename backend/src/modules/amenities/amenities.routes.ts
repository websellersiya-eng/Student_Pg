import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/role.middleware.js";
import { validate } from "../../middlewares/validation.middleware.js";
import { amenitiesController } from "./amenities.controller.js";
import { createAmenitySchema } from "./amenities.schema.js";

export const amenitiesRoutes = Router();

amenitiesRoutes.get("/", amenitiesController.list);
amenitiesRoutes.post("/", authenticate, authorize("ADMIN"), validate(createAmenitySchema), amenitiesController.create);
