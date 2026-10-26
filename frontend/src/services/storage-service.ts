import { apiClient } from "@/lib/api-client";
import type { ApiResponse } from "@/types/api";

export type CloudinarySignature = {
  cloudName: string;
  apiKey: string;
  folder: string;
  timestamp: number;
  signature: string;
};

export const storageService = {
  signature: () => apiClient<ApiResponse<CloudinarySignature>>("/storage/cloudinary/signature"),
  deleteImage: (imageId: string) =>
    apiClient<ApiResponse<null>>(`/storage/images/${imageId}`, { method: "DELETE" })
};

export async function uploadToCloudinary(
  file: File,
  sig: CloudinarySignature
): Promise<{ url: string; storageKey: string }> {
  const form = new FormData();
  form.append("file", file);
  form.append("api_key", sig.apiKey);
  form.append("timestamp", String(sig.timestamp));
  form.append("signature", sig.signature);
  form.append("folder", sig.folder);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`, {
    method: "POST",
    body: form
  });
  if (!response.ok) throw new Error("Cloudinary upload failed");
  const data = (await response.json()) as { secure_url: string; public_id: string };
  return { url: data.secure_url, storageKey: data.public_id };
}
