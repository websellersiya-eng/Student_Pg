import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/role.middleware.js";
import { validate } from "../../middlewares/validation.middleware.js";
import { citiesController } from "./cities.controller.js";
import { cityQuerySchema, createCitySchema, createLocalitySchema } from "./cities.schema.js";

export const citiesRoutes = Router();

citiesRoutes.get("/", validate(cityQuerySchema, "query"), citiesController.list);
citiesRoutes.post("/", authenticate, authorize("ADMIN"), validate(createCitySchema), citiesController.createCity);
citiesRoutes.post(
  "/localities",
  authenticate,
  authorize("ADMIN"),
  validate(createLocalitySchema),
  citiesController.createLocality
);
