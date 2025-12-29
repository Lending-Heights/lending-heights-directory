import { supabase, handleSupabaseError } from '@/lib/supabase';
import type { Database } from '@/types/database';

type MarketingAsset = Database['public']['Tables']['marketing_assets']['Row'];
type MarketingAssetInsert = Database['public']['Tables']['marketing_assets']['Insert'];
type MarketingAssetUpdate = Database['public']['Tables']['marketing_assets']['Update'];

type MarketingCampaign = Database['public']['Tables']['marketing_campaigns']['Row'];
type MarketingCampaignInsert = Database['public']['Tables']['marketing_campaigns']['Insert'];
type MarketingCampaignUpdate = Database['public']['Tables']['marketing_campaigns']['Update'];

// ============================================================================
// ASSET FETCH OPERATIONS
// ============================================================================

/**
 * Fetch all marketing assets
 * @param filters Optional filters for asset type
 * @returns Array of assets or error
 */
export async function fetchAssets(filters?: { assetType?: string }) {
  try {
    let query = supabase
      .from('marketing_assets')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters?.assetType && filters.assetType !== 'all') {
      query = query.eq('asset_type', filters.assetType);
    }

    const { data, error } = await query;

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: handleSupabaseError(error) };
  }
}

/**
 * Fetch a single asset by ID
 * @param id Asset UUID
 * @returns Single asset or error
 */
export async function fetchAssetById(id: string) {
  try {
    const { data, error } = await supabase
      .from('marketing_assets')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: handleSupabaseError(error) };
  }
}

/**
 * Fetch recent assets
 * @param limit Max number of assets to return
 * @returns Array of recent assets
 */
export async function fetchRecentAssets(limit: number = 10) {
  try {
    const { data, error } = await supabase
      .from('marketing_assets')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: handleSupabaseError(error) };
  }
}

/**
 * Get asset counts grouped by type
 * @returns Object with counts per asset type
 */
export async function getAssetCountsByType() {
  try {
    const { data, error } = await supabase
      .from('marketing_assets')
      .select('asset_type');

    if (error) throw error;

    // Count assets by type
    const counts = ((data || []) as { asset_type: string }[]).reduce((acc, asset) => {
      acc[asset.asset_type] = (acc[asset.asset_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return { data: counts, error: null };
  } catch (error) {
    return { data: null, error: handleSupabaseError(error) };
  }
}

// ============================================================================
// ASSET CREATE OPERATIONS
// ============================================================================

/**
 * Create a new marketing asset
 * @param asset Asset data to insert
 * @returns Created asset or error
 */
export async function createAsset(asset: MarketingAssetInsert) {
  try {
    const { data, error } = await supabase
      .from('marketing_assets')
      .insert(asset as any)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: handleSupabaseError(error) };
  }
}

// ============================================================================
// ASSET UPDATE OPERATIONS
// ============================================================================

/**
 * Update an existing marketing asset
 * @param id Asset UUID
 * @param updates Fields to update
 * @returns Updated asset or error
 */
export async function updateAsset(id: string, updates: MarketingAssetUpdate) {
  try {
    const { data, error } = await (supabase
      .from('marketing_assets') as any)
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: handleSupabaseError(error) };
  }
}

// ============================================================================
// ASSET DELETE OPERATIONS
// ============================================================================

/**
 * Delete a marketing asset
 * @param id Asset UUID
 * @returns Success or error
 */
export async function deleteAsset(id: string) {
  try {
    const { error } = await supabase
      .from('marketing_assets')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: handleSupabaseError(error) };
  }
}

// ============================================================================
// CAMPAIGN FETCH OPERATIONS
// ============================================================================

/**
 * Fetch all marketing campaigns
 * @param filters Optional filters for status
 * @returns Array of campaigns or error
 */
export async function fetchCampaigns(filters?: { status?: string }) {
  try {
    let query = supabase
      .from('marketing_campaigns')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters?.status && filters.status !== 'all') {
      query = query.eq('status', filters.status);
    }

    const { data, error } = await query;

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: handleSupabaseError(error) };
  }
}

/**
 * Fetch a single campaign by ID
 * @param id Campaign UUID
 * @returns Single campaign or error
 */
export async function fetchCampaignById(id: string) {
  try {
    const { data, error } = await supabase
      .from('marketing_campaigns')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: handleSupabaseError(error) };
  }
}

// ============================================================================
// CAMPAIGN CREATE OPERATIONS
// ============================================================================

/**
 * Create a new marketing campaign
 * @param campaign Campaign data to insert
 * @returns Created campaign or error
 */
export async function createCampaign(campaign: MarketingCampaignInsert) {
  try {
    const { data, error } = await supabase
      .from('marketing_campaigns')
      .insert(campaign as any)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: handleSupabaseError(error) };
  }
}

// ============================================================================
// CAMPAIGN UPDATE OPERATIONS
// ============================================================================

/**
 * Update an existing marketing campaign
 * @param id Campaign UUID
 * @param updates Fields to update
 * @returns Updated campaign or error
 */
export async function updateCampaign(id: string, updates: MarketingCampaignUpdate) {
  try {
    const { data, error } = await (supabase
      .from('marketing_campaigns') as any)
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: handleSupabaseError(error) };
  }
}

// ============================================================================
// CAMPAIGN DELETE OPERATIONS
// ============================================================================

/**
 * Delete a marketing campaign
 * @param id Campaign UUID
 * @returns Success or error
 */
export async function deleteCampaign(id: string) {
  try {
    const { error } = await supabase
      .from('marketing_campaigns')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: handleSupabaseError(error) };
  }
}
