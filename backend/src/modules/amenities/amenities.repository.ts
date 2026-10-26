import { prisma } from "../../db/prisma.js";
import type { CreateAmenityInput } from "./amenities.schema.js";

export const amenitiesRepository = {
  list: (activeOnly = true) =>
    prisma.amenity.findMany({
      where: activeOnly ? { isActive: true } : undefined,
      orderBy: { name: "asc" }
    }),

  create: (input: CreateAmenityInput & { slug: string }) => prisma.amenity.create({ data: input })
};
