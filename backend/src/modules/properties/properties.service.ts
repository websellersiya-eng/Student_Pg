import { PropertyStatus } from "@prisma/client";
import { AppError } from "../../shared/errors/app-error.js";
import { getPagination } from "../../shared/pagination/pagination.js";
import { toSlug } from "../../shared/utils/slug.js";
import { propertiesRepository } from "./properties.repository.js";
import type {
  CreatePropertyInput,
  ModerationInput,
  PropertySearchQuery,
  UpdatePropertyInput
} from "./properties.schema.js";

const ensureOwnerProfile = async (userId: string) => {
  const owner = await propertiesRepository.ownerProfileByUserId(userId);
  if (!owner) throw new AppError(403, "Owner profile is required");
  return owner;
};

const withAverageRating = <T extends { reviews?: { rating: number }[] }>(property: T) => {
  const ratings = property.reviews ?? [];
  const averageRating =
    ratings.length > 0 ? ratings.reduce((sum, item) => sum + item.rating, 0) / ratings.length : 0;

  return { ...property, averageRating, reviewCount: ratings.length };
};

export const propertiesService = {
  create: async (userId: string, input: CreatePropertyInput) => {
    if (input.availableBeds > input.totalBeds) {
      throw new AppError(400, "Available beds cannot exceed total beds");
    }

    const owner = await ensureOwnerProfile(userId);
    const slug = `${toSlug(input.name)}-${Date.now()}`;
    return propertiesRepository.create(owner.id, slug, input);
  },

  update: async (userId: string, propertyId: string, input: UpdatePropertyInput) => {
    if (
      input.availableBeds !== undefined &&
      input.totalBeds !== undefined &&
      input.availableBeds > input.totalBeds
    ) {
      throw new AppError(400, "Available beds cannot exceed total beds");
    }

    const owner = await ensureOwnerProfile(userId);
    const property = await propertiesRepository.updateOwnerProperty(propertyId, owner.id, input);
    if (!property) throw new AppError(404, "Property not found");
    return property;
  },

  submit: async (userId: string, propertyId: string) => {
    const owner = await ensureOwnerProfile(userId);
    const result = await propertiesRepository.submitForApproval(propertyId, owner.id);
    if (result.count === 0) throw new AppError(404, "Property not found");
  },

  search: async (query: PropertySearchQuery) => {
    const { data, total } = await propertiesRepository.listPublic(query);
    const paginationInput = getPagination(query.page, query.limit);

    return {
      data: data.map(withAverageRating),
      pagination: {
        page: paginationInput.page,
        limit: paginationInput.limit,
        total,
        totalPages: Math.ceil(total / paginationInput.limit)
      }
    };
  },

  publicDetail: async (slug: string) => {
    const property = await propertiesRepository.findPublicBySlug(slug);
    if (!property) throw new AppError(404, "Property not found");
    return withAverageRating(property);
  },

  ownerList: async (userId: string) => {
    const owner = await ensureOwnerProfile(userId);
    return propertiesRepository.listOwner(owner.id);
  },

  adminList: (status?: PropertyStatus) => propertiesRepository.listAdmin(status),

  moderate: async (id: string, input: ModerationInput) => {
    if (input.status === "REJECTED" && !input.rejectionReason) {
      throw new AppError(400, "Rejection reason is required");
    }
    return propertiesRepository.moderate(id, input);
  },

  remove: async (userId: string, propertyId: string) => {
    const owner = await ensureOwnerProfile(userId);
    const result = await propertiesRepository.deleteOwnerProperty(propertyId, owner.id);
    if (!result) throw new AppError(404, "Property not found");
  }
};
