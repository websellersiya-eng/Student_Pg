import type { Prisma, PropertyStatus } from "@prisma/client";
import { prisma } from "../../db/prisma.js";
import type {
  CreatePropertyInput,
  ModerationInput,
  PropertySearchQuery,
  UpdatePropertyInput
} from "./properties.schema.js";

const propertyInclude = {
  city: true,
  locality: true,
  owner: { include: { user: { select: { id: true, name: true, email: true, phone: true } } } },
  images: { orderBy: [{ isCover: "desc" }, { sortOrder: "asc" }] },
  amenities: { include: { amenity: true } },
  rooms: true,
  reviews: { select: { rating: true } }
} satisfies Prisma.PropertyInclude;

const buildSearchWhere = (query: PropertySearchQuery): Prisma.PropertyWhereInput => {
  const where: Prisma.PropertyWhereInput = {
    status: "APPROVED",
    isActive: true
  };

  if (query.city) where.city = { slug: query.city };
  if (query.locality || query.area) where.locality = { slug: query.locality ?? query.area };
  if (query.q) where.name = { contains: query.q };
  if (query.type) where.propertyType = query.type;
  if (query.gender) where.genderPreference = query.gender;
  if (query.availableOnly) where.availableBeds = { gt: 0 };
  if (query.minRent || query.maxRent) {
    where.monthlyRent = {
      ...(query.minRent ? { gte: query.minRent } : {}),
      ...(query.maxRent ? { lte: query.maxRent } : {})
    };
  }
  if (query.amenities.length > 0) {
    where.amenities = {
      some: {
        amenity: {
          slug: { in: query.amenities }
        }
      }
    };
  }

  return where;
};

const toRad = (deg: number) => (deg * Math.PI) / 180;

const haversineKm = (lat1: number, lng1: number, lat2: number, lng2: number) => {
  const earthRadiusKm = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * earthRadiusKm * Math.asin(Math.sqrt(a));
};

const orderByFor = (sort?: PropertySearchQuery["sort"]): Prisma.PropertyOrderByWithRelationInput => {
  if (sort === "rent_asc") return { monthlyRent: "asc" };
  if (sort === "rent_desc") return { monthlyRent: "desc" };
  return { createdAt: "desc" };
};

const relationWrites = (input: CreatePropertyInput | UpdatePropertyInput) => ({
  ...(input.amenityIds
    ? {
        amenities: {
          create: input.amenityIds.map((amenityId) => ({ amenityId }))
        }
      }
    : {}),
  ...(input.images
    ? {
        images: {
          create: input.images
        }
      }
    : {}),
  ...(input.rooms
    ? {
        rooms: {
          create: input.rooms
        }
      }
    : {})
});

const propertyScalarData = (input: CreatePropertyInput | UpdatePropertyInput) => {
  const { amenityIds: _amenityIds, images: _images, rooms: _rooms, ...data } = input;
  return data;
};

export const propertiesRepository = {
  ownerProfileByUserId: (userId: string) =>
    prisma.ownerProfile.findUnique({
      where: { userId }
    }),

  create: (ownerId: string, slug: string, input: CreatePropertyInput) =>
    prisma.property.create({
      data: {
        ...propertyScalarData(input),
        slug,
        ownerId,
        status: "PENDING",
        ...relationWrites(input)
      } as Prisma.PropertyUncheckedCreateInput,
      include: propertyInclude
    }),

  updateOwnerProperty: (propertyId: string, ownerId: string, input: UpdatePropertyInput) =>
    prisma.$transaction(async (tx) => {
      const property = await tx.property.findFirst({ where: { id: propertyId, ownerId } });
      if (!property) return null;

      if (input.amenityIds) await tx.propertyAmenity.deleteMany({ where: { propertyId } });
      if (input.images) await tx.propertyImage.deleteMany({ where: { propertyId } });
      if (input.rooms) await tx.room.deleteMany({ where: { propertyId } });

      return tx.property.update({
        where: { id: propertyId },
        data: {
          ...propertyScalarData(input),
          status: property.status === "APPROVED" ? "PENDING" : property.status,
          rejectionReason: null,
          ...relationWrites(input)
        },
        include: propertyInclude
      });
    }),

  submitForApproval: (propertyId: string, ownerId: string) =>
    prisma.property.updateMany({
      where: { id: propertyId, ownerId },
      data: { status: "PENDING", rejectionReason: null }
    }),

  listPublic: async (query: PropertySearchQuery) => {
    const where = buildSearchWhere(query);
    const skip = (query.page - 1) * query.limit;

    if (typeof query.lat === "number" && typeof query.lng === "number") {
      const radiusKm = typeof query.radius === "number" && query.radius > 0 ? query.radius : 10;
      const rows = await prisma.property.findMany({
        where,
        select: { id: true, latitude: true, longitude: true }
      });
      const scored = rows
        .map((row) => ({
          id: row.id,
          distance: haversineKm(query.lat!, query.lng!, Number(row.latitude), Number(row.longitude))
        }))
        .filter((row) => row.distance <= radiusKm)
        .sort((a, b) => a.distance - b.distance);
      const total = scored.length;
      const pageIds = scored.slice(skip, skip + query.limit).map((row) => row.id);
      if (pageIds.length === 0) return { data: [], total };
      const found = await prisma.property.findMany({
        where: { id: { in: pageIds } },
        include: propertyInclude
      });
      const byId = new Map(found.map((property) => [property.id, property]));
      return { data: pageIds.map((id) => byId.get(id)).filter(Boolean) as typeof found, total };
    }

    const [data, total] = await prisma.$transaction([
      prisma.property.findMany({
        where,
        include: propertyInclude,
        orderBy: orderByFor(query.sort),
        skip,
        take: query.limit
      }),
      prisma.property.count({ where })
    ]);

    return { data, total };
  },

  findPublicBySlug: (slug: string) =>
    prisma.property.findFirst({
      where: { slug, status: "APPROVED", isActive: true },
      include: propertyInclude
    }),

  findById: (id: string) => prisma.property.findUnique({ where: { id }, include: propertyInclude }),

  listOwner: (ownerId: string) =>
    prisma.property.findMany({
      where: { ownerId },
      include: propertyInclude,
      orderBy: { createdAt: "desc" }
    }),

  listAdmin: (status?: PropertyStatus) =>
    prisma.property.findMany({
      where: status ? { status } : undefined,
      include: propertyInclude,
      orderBy: { createdAt: "desc" }
    }),

  moderate: (id: string, input: ModerationInput) =>
    prisma.property.update({
      where: { id },
      data: {
        status: input.status,
        rejectionReason: input.status === "REJECTED" ? input.rejectionReason : null
      },
      include: propertyInclude
    }),

  deleteOwnerProperty: async (propertyId: string, ownerId: string) => {
    const property = await prisma.property.findFirst({ where: { id: propertyId, ownerId } });
    if (!property) return null;
    return prisma.property.delete({ where: { id: propertyId } });
  }
};
