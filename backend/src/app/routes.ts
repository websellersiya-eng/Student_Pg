import { Router } from "express";
import { adminRoutes } from "../modules/admin/admin.routes.js";
import { amenitiesRoutes } from "../modules/amenities/amenities.routes.js";
import { authRoutes } from "../modules/auth/auth.routes.js";
import { bookingsRoutes } from "../modules/bookings/bookings.routes.js";
import { citiesRoutes } from "../modules/cities/cities.routes.js";
import { favoritesRoutes } from "../modules/favorites/favorites.routes.js";
import { propertiesRoutes } from "../modules/properties/properties.routes.js";
import { reviewsRoutes } from "../modules/reviews/reviews.routes.js";
import { usersRoutes } from "../modules/users/users.routes.js";
import { profileRoutes } from "../modules/users/profile.routes.js";
import { storageRoutes } from "../modules/storage/storage.controller.js";

export const routes = Router();

routes.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "NearStay API v1"
  });
});

routes.use("/auth", authRoutes);
routes.use("/profile", profileRoutes);
routes.use("/users", usersRoutes);
routes.use("/properties", propertiesRoutes);
routes.use("/cities", citiesRoutes);
routes.use("/amenities", amenitiesRoutes);
routes.use("/bookings", bookingsRoutes);
routes.use("/reviews", reviewsRoutes);
routes.use("/favorites", favoritesRoutes);
routes.use("/admin", adminRoutes);
routes.use("/storage", storageRoutes);
