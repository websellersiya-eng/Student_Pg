import crypto from "node:crypto";
import { config } from "../app/config.js";
import { AppError } from "../shared/errors/app-error.js";

export const getCloudinarySignature = (folder = "nearstay/properties") => {
  if (!config.CLOUDINARY_API_SECRET || !config.CLOUDINARY_API_KEY || !config.CLOUDINARY_CLOUD_NAME) {
    throw new AppError(500, "Cloudinary environment variables are not configured");
  }

  const timestamp = Math.round(Date.now() / 1000);
  const signature = crypto
    .createHash("sha1")
    .update(`folder=${folder}&timestamp=${timestamp}${config.CLOUDINARY_API_SECRET}`)
    .digest("hex");

  return {
    cloudName: config.CLOUDINARY_CLOUD_NAME,
    apiKey: config.CLOUDINARY_API_KEY,
    folder,
    timestamp,
    signature
  };
};

export const destroyOnCloudinary = async (publicId: string) => {
  if (!config.CLOUDINARY_CLOUD_NAME || !config.CLOUDINARY_API_SECRET || !config.CLOUDINARY_API_KEY) return;
  try {
    const timestamp = Math.round(Date.now() / 1000);
    const signature = crypto
      .createHash("sha1")
      .update(`public_id=${publicId}&timestamp=${timestamp}${config.CLOUDINARY_API_SECRET}`)
      .digest("hex");
    const body = new globalThis.URLSearchParams({
      public_id: publicId,
      timestamp: String(timestamp),
      api_key: config.CLOUDINARY_API_KEY,
      signature
    });
    await globalThis.fetch(`https://api.cloudinary.com/v1_1/${config.CLOUDINARY_CLOUD_NAME}/destroy`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body
    });
  } catch {
    // best-effort remote cleanup
  }
};
