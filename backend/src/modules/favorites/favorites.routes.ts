import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/role.middleware.js";
import { validate } from "../../middlewares/validation.middleware.js";
import { favoritesController } from "./favorites.controller.js";
import { favoriteParamsSchema } from "./favorites.schema.js";

export const favoritesRoutes = Router();

favoritesRoutes.use(authenticate, authorize("STUDENT"));
favoritesRoutes.get("/", favoritesController.list);
favoritesRoutes.get("/:propertyId", validate(favoriteParamsSchema, "params"), favoritesController.check);
favoritesRoutes.post("/:propertyId", validate(favoriteParamsSchema, "params"), favoritesController.add);
favoritesRoutes.delete("/:propertyId", validate(favoriteParamsSchema, "params"), favoritesController.remove);
