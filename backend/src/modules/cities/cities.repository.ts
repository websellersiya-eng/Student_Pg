import { prisma } from "../../db/prisma.js";
import type { CreateCityInput, CreateLocalityInput } from "./cities.schema.js";

export const citiesRepository = {
  findCities: (activeOnly = true) =>
    prisma.city.findMany({
      where: activeOnly ? { isActive: true } : undefined,
      include: { localities: { where: activeOnly ? { isActive: true } : undefined } },
      orderBy: { name: "asc" }
    }),

  findCityById: (id: string) => prisma.city.findUnique({ where: { id } }),

  createCity: (input: CreateCityInput & { slug: string }) => prisma.city.create({ data: input }),

  createLocality: (input: CreateLocalityInput & { slug: string }) =>
    prisma.locality.create({ data: input })
};
