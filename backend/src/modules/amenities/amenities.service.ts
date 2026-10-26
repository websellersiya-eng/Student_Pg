import { toSlug } from "../../shared/utils/slug.js";
import { amenitiesRepository } from "./amenities.repository.js";
import type { CreateAmenityInput } from "./amenities.schema.js";

export const amenitiesService = {
  list: () => amenitiesRepository.list(true),
  create: (input: CreateAmenityInput) => amenitiesRepository.create({ ...input, slug: toSlug(input.name) })
};
