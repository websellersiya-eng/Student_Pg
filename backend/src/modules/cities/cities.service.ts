import { AppError } from "../../shared/errors/app-error.js";
import { toSlug } from "../../shared/utils/slug.js";
import { citiesRepository } from "./cities.repository.js";
import type { CreateCityInput, CreateLocalityInput } from "./cities.schema.js";

export const citiesService = {
  list: (activeOnly?: boolean) => citiesRepository.findCities(activeOnly ?? true),

  createCity: async (input: CreateCityInput) =>
    citiesRepository.createCity({ ...input, slug: toSlug(input.name) }),

  createLocality: async (input: CreateLocalityInput) => {
    const city = await citiesRepository.findCityById(input.cityId);
    if (!city) throw new AppError(404, "City not found");

    return citiesRepository.createLocality({ ...input, slug: toSlug(input.name) });
  }
};
