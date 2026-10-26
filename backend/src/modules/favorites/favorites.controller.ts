import { sendSuccess } from "../../shared/response/api-response.js";
import { asyncHandler } from "../../shared/utils/async-handler.js";
import { favoritesRepository } from "./favorites.repository.js";

export const favoritesController = {
  add: asyncHandler(async (req, res) => {
    const favorite = await favoritesRepository.add(req.user!.id, req.params.propertyId ?? "");
    sendSuccess(res, 201, "Property added to favorites", favorite);
  }),

  remove: asyncHandler(async (req, res) => {
    await favoritesRepository.remove(req.user!.id, req.params.propertyId ?? "");
    sendSuccess(res, 200, "Property removed from favorites");
  }),

  list: asyncHandler(async (req, res) => {
    const favorites = await favoritesRepository.list(req.user!.id);
    sendSuccess(res, 200, "Favorites fetched successfully", favorites);
  }),

  check: asyncHandler(async (req, res) => {
    const favorite = await favoritesRepository.check(req.user!.id, req.params.propertyId ?? "");
    sendSuccess(res, 200, "Favorite status fetched successfully", { isFavorite: Boolean(favorite) });
  })
};
