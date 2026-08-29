// ============================================================================
// ASTITVA 2K26 - Supabase Storage Engine
// Path: lib/storage/supabase-storage.ts
// ============================================================================

import { supabase } from "@/lib/supabase/client";

export interface SupabaseUploadOptions {
  bucket?: "avatars" | "event-banners" | "certificates";
  contentType?: string;
  cacheControl?: string;
}

export async function uploadToSupabaseStorage(
  fileName: string,
  fileBody: Buffer | Uint8Array | Blob | File,
  options: SupabaseUploadOptions = {}
) {
  const bucket = options.bucket || "avatars";
  const contentType = options.contentType || "image/jpeg";

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, fileBody, {
      contentType,
      cacheControl: options.cacheControl || "3600",
      upsert: true,
    });

  if (error) {
    throw error;
  }

  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(fileName);

  return {
    path: data.path,
    publicUrl: urlData.publicUrl,
  };
}
