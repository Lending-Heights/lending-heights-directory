import { supabase, handleSupabaseError } from '@/lib/supabase';

const HEADSHOT_BUCKET = 'teammate-headshots';
const MARKETING_BUCKET = 'marketing-assets';

/**
 * Upload a headshot image to Supabase Storage
 * @param file - The image file to upload
 * @param teammateId - Optional teammate ID for organizing files
 * @returns Object with public URL or error
 */
export async function uploadHeadshot(
  file: File,
  teammateId?: string
): Promise<{ url: string | null; error: string | null }> {
  try {
    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const timestamp = Date.now();
    const fileName = teammateId
      ? `${teammateId}/${timestamp}.${fileExt}`
      : `${timestamp}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(HEADSHOT_BUCKET)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      return { url: null, error: handleSupabaseError(error) };
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(HEADSHOT_BUCKET)
      .getPublicUrl(data.path);

    return { url: urlData.publicUrl, error: null };
  } catch (error) {
    return { url: null, error: handleSupabaseError(error) };
  }
}

/**
 * Delete a headshot from Supabase Storage
 * @param url - The public URL of the image to delete
 * @returns Object indicating success or error
 */
export async function deleteHeadshot(
  url: string
): Promise<{ success: boolean; error: string | null }> {
  try {
    // Extract file path from URL
    const urlParts = url.split(`${HEADSHOT_BUCKET}/`);
    if (urlParts.length < 2) {
      return { success: false, error: 'Invalid headshot URL' };
    }

    const filePath = urlParts[1];

    const { error } = await supabase.storage
      .from(HEADSHOT_BUCKET)
      .remove([filePath]);

    if (error) {
      return { success: false, error: handleSupabaseError(error) };
    }

    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: handleSupabaseError(error) };
  }
}

/**
 * Upload a marketing asset to Supabase Storage
 * @param file - The file to upload
 * @returns Object with public URL, file info, or error
 */
export async function uploadMarketingAsset(
  file: File
): Promise<{
  url: string | null;
  fileName: string;
  fileSize: number;
  mimeType: string;
  error: string | null;
}> {
  try {
    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(7);
    const fileName = `${timestamp}-${randomStr}.${fileExt}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(MARKETING_BUCKET)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      return {
        url: null,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        error: handleSupabaseError(error),
      };
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(MARKETING_BUCKET)
      .getPublicUrl(data.path);

    return {
      url: urlData.publicUrl,
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type,
      error: null,
    };
  } catch (error) {
    return {
      url: null,
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type,
      error: handleSupabaseError(error),
    };
  }
}

/**
 * Delete a marketing asset from Supabase Storage
 * @param url - The public URL of the file to delete
 * @returns Object indicating success or error
 */
export async function deleteMarketingAsset(
  url: string
): Promise<{ success: boolean; error: string | null }> {
  try {
    // Extract file path from URL
    const urlParts = url.split(`${MARKETING_BUCKET}/`);
    if (urlParts.length < 2) {
      return { success: false, error: 'Invalid asset URL' };
    }

    const filePath = urlParts[1];

    const { error } = await supabase.storage
      .from(MARKETING_BUCKET)
      .remove([filePath]);

    if (error) {
      return { success: false, error: handleSupabaseError(error) };
    }

    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: handleSupabaseError(error) };
  }
}
