import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/role.middleware.js";
import { sendSuccess } from "../../shared/response/api-response.js";
import { asyncHandler } from "../../shared/utils/async-handler.js";
import { destroyOnCloudinary, getCloudinarySignature } from "../../storage/cloudinary.js";
import { Router } from "express";
import { prisma } from "../../db/prisma.js";
import { AppError } from "../../shared/errors/app-error.js";

export const storageRoutes = Router();

storageRoutes.get(
  "/cloudinary/signature",
  authenticate,
  authorize("OWNER", "ADMIN"),
  asyncHandler(async (_req, res) => {
    sendSuccess(res, 200, "Cloudinary signature created successfully", getCloudinarySignature());
  })
);

storageRoutes.delete(
  "/images/:imageId",
  authenticate,
  authorize("OWNER", "ADMIN"),
  asyncHandler(async (req, res) => {
    const image = await prisma.propertyImage.findUnique({ where: { id: req.params.imageId } });
    if (!image) throw new AppError(404, "Image not found");

    // Verify ownership for OWNER role
    if (req.user!.role === "OWNER") {
      const owner = await prisma.ownerProfile.findUnique({ where: { userId: req.user!.id } });
      if (!owner) throw new AppError(403, "Owner profile required");
      const property = await prisma.property.findFirst({ where: { id: image.propertyId, ownerId: owner.id } });
      if (!property) throw new AppError(403, "Not authorized");
    }

    await prisma.propertyImage.delete({ where: { id: image.id } });
    if (image.storageKey) await destroyOnCloudinary(image.storageKey);
    sendSuccess(res, 200, "Image deleted successfully");
  })
);
