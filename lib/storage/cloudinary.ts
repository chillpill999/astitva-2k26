// ============================================================================
// ASTITVA 2K26 - Cloudinary Media & File Storage Engine
// Path: lib/storage/cloudinary.ts
// ============================================================================

import { v2 as cloudinary, UploadApiResponse } from "cloudinary";

const cloudName =
  process.env.CLOUDINARY_CLOUD_NAME ||
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
  "";
const apiKey = process.env.CLOUDINARY_API_KEY || "";
const apiSecret = process.env.CLOUDINARY_API_SECRET || "";

export const isCloudinaryConfigured = Boolean(
  (cloudName && apiKey && apiSecret) || process.env.CLOUDINARY_URL
);

if (isCloudinaryConfigured) {
  if (process.env.CLOUDINARY_URL) {
    cloudinary.config({
      url: process.env.CLOUDINARY_URL,
    });
  } else {
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true,
    });
  }
}

export interface CloudinaryUploadOptions {
  folder?: string;
  publicId?: string;
  transformation?: Array<Record<string, any>>;
  resourceType?: "image" | "raw" | "auto" | "video";
}

/**
 * Uploads a binary buffer to Cloudinary using streaming upload.
 */
export async function uploadBufferToCloudinary(
  buffer: Buffer,
  options: CloudinaryUploadOptions = {}
): Promise<UploadApiResponse> {
  if (!isCloudinaryConfigured) {
    throw new Error(
      "Cloudinary is not configured. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in environment variables."
    );
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: options.folder || "astitva-2k26",
        public_id: options.publicId,
        transformation: options.transformation,
        resource_type: options.resourceType || "auto",
      },
      (error, result) => {
        if (error || !result) {
          reject(error || new Error("Failed to upload to Cloudinary"));
        } else {
          resolve(result);
        }
      }
    );

    uploadStream.end(buffer);
  });
}

/**
 * Uploads a base64 string or data URL to Cloudinary.
 */
export async function uploadBase64ToCloudinary(
  base64Data: string,
  options: CloudinaryUploadOptions = {}
): Promise<UploadApiResponse> {
  if (!isCloudinaryConfigured) {
    throw new Error(
      "Cloudinary is not configured. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in environment variables."
    );
  }

  return cloudinary.uploader.upload(base64Data, {
    folder: options.folder || "astitva-2k26",
    public_id: options.publicId,
    transformation: options.transformation,
    resource_type: options.resourceType || "auto",
  });
}
