import { createClient } from "@supabase/supabase-js";
import { nanoid } from "nanoid";

// Initialize Supabase client with service role key for server-side operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Bucket name for payment proofs
const PAYMENT_PROOFS_BUCKET = "payment-proofs";

// Allowed file types
const ALLOWED_TYPES = ["image/jpeg", "image/png", "application/pdf"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export interface UploadResult {
  success: boolean;
  url?: string;
  key?: string;
  error?: string;
}

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validate file before upload
 */
export function validateFile(file: File): FileValidationResult {
  // Check file type
  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: "Format file tidak didukung. Gunakan JPG, PNG, atau PDF.",
    };
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: "Ukuran file maksimal 5MB.",
    };
  }

  return { valid: true };
}

/**
 * Upload payment proof to Supabase Storage
 */
export async function uploadPaymentProof(
  bookingId: string,
  file: File
): Promise<UploadResult> {
  try {
    // Validate file
    const validation = validateFile(file);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    // Generate unique filename
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const uniqueId = nanoid(16);
    const key = `${bookingId}/${uniqueId}.${ext}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(PAYMENT_PROOFS_BUCKET)
      .upload(key, file, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error("Upload error:", error);
      return { success: false, error: "Gagal mengupload file. Coba lagi." };
    }

    // Get signed URL (expires in 7 days)
    const { data: urlData } = await supabase.storage
      .from(PAYMENT_PROOFS_BUCKET)
      .createSignedUrl(key, 7 * 24 * 60 * 60); // 7 days

    if (!urlData?.signedUrl) {
      return { success: false, error: "Gagal membuat URL file." };
    }

    return {
      success: true,
      url: urlData.signedUrl,
      key: data.path,
    };
  } catch (error) {
    console.error("Upload error:", error);
    return { success: false, error: "Terjadi kesalahan saat upload." };
  }
}

/**
 * Get signed URL for existing file
 */
export async function getSignedUrl(
  key: string,
  expiresIn: number = 3600 // 1 hour default
): Promise<string | null> {
  try {
    const { data } = await supabase.storage
      .from(PAYMENT_PROOFS_BUCKET)
      .createSignedUrl(key, expiresIn);

    return data?.signedUrl || null;
  } catch (error) {
    console.error("Get signed URL error:", error);
    return null;
  }
}

/**
 * Delete file from storage
 */
export async function deleteFile(key: string): Promise<boolean> {
  try {
    const { error } = await supabase.storage
      .from(PAYMENT_PROOFS_BUCKET)
      .remove([key]);

    if (error) {
      console.error("Delete error:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Delete error:", error);
    return false;
  }
}

/**
 * Get public URL (for public buckets only)
 */
export function getPublicUrl(key: string): string {
  const { data } = supabase.storage
    .from(PAYMENT_PROOFS_BUCKET)
    .getPublicUrl(key);

  return data.publicUrl;
}
