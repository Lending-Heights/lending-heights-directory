'use server';

import { createClient } from '@/lib/supabase/server';
import {
  authenticateArive,
  fetchAllAriveLoans,
  transformAriveLoan,
  type AriveAuthConfig,
} from '@/lib/api/arive';

// ============================================================================
// TYPES
// ============================================================================

interface SyncResult {
  success: boolean;
  message: string;
  recordsFetched?: number;
  recordsUpserted?: number;
  error?: string;
}

// ============================================================================
// SYNC FUNCTION
// ============================================================================

/**
 * Sync loans from ARIVE to Supabase
 *
 * This function:
 * 1. Authenticates with ARIVE API using credentials from Supabase Vault
 * 2. Fetches all loans from ARIVE (handles pagination)
 * 3. Upserts loans into Supabase (insert or update based on arive_loan_id)
 * 4. Logs the sync operation
 */
export async function syncAriveLoans(): Promise<SyncResult> {
  const supabase = await createClient();
  const startTime = new Date();

  try {
    // Check user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return {
        success: false,
        message: 'Unauthorized',
        error: 'You must be logged in to sync data',
      };
    }

    // Get ARIVE credentials from environment variables
    const ariveConfig: AriveAuthConfig = {
      clientId: process.env.ARIVE_CLIENT_ID || '',
      secret: process.env.ARIVE_SECRET || '',
      apiKey: process.env.ARIVE_API_KEY || '',
    };

    // Validate config
    if (!ariveConfig.clientId || !ariveConfig.secret || !ariveConfig.apiKey) {
      return {
        success: false,
        message: 'Configuration error',
        error: 'ARIVE API credentials not configured. Please set environment variables.',
      };
    }

    // Log sync start
    const { error: logStartError } = await supabase
      .from('sync_logs')
      .insert({
        status: 'running' as const,
        records_fetched: 0,
        records_upserted: 0,
      } as any);

    if (logStartError) {
      console.error('Failed to log sync start:', logStartError);
    }

    // Authenticate with ARIVE
    const { token, error: ariveAuthError } = await authenticateArive(ariveConfig);
    if (ariveAuthError || !token) {
      throw new Error(`ARIVE authentication failed: ${ariveAuthError}`);
    }

    // Fetch all loans from ARIVE
    const { data: loans, error: fetchError } = await fetchAllAriveLoans(token);
    if (fetchError) {
      throw new Error(`Failed to fetch loans: ${fetchError}`);
    }

    const recordsFetched = loans.length;

    // Transform and upsert loans
    const transformedLoans = loans.map(transformAriveLoan);

    // Upsert in batches of 100 to avoid timeouts
    const batchSize = 100;
    let recordsUpserted = 0;

    for (let i = 0; i < transformedLoans.length; i += batchSize) {
      const batch = transformedLoans.slice(i, i + batchSize);

      const { error: upsertError } = await supabase
        .from('loans')
        .upsert(batch as never[], {
          onConflict: 'arive_loan_id',
          ignoreDuplicates: false,
        });

      if (upsertError) {
        console.error('Upsert error for batch:', upsertError);
        // Continue with next batch instead of failing completely
      } else {
        recordsUpserted += batch.length;
      }
    }

    // Log sync completion
    const endTime = new Date();
    const duration = Math.round((endTime.getTime() - startTime.getTime()) / 1000);

    const { error: logCompleteError } = await supabase
      .from('sync_logs')
      .insert({
        status: 'completed' as const,
        records_fetched: recordsFetched,
        records_upserted: recordsUpserted,
      } as any);

    if (logCompleteError) {
      console.error('Failed to log sync completion:', logCompleteError);
    }

    return {
      success: true,
      message: `Sync completed in ${duration}s`,
      recordsFetched,
      recordsUpserted,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    // Log sync failure
    await supabase
      .from('sync_logs')
      .insert({
        status: 'failed' as const,
        records_fetched: 0,
        records_upserted: 0,
        error_message: errorMessage,
      } as any);

    return {
      success: false,
      message: `Sync failed: ${errorMessage}`,
      error: errorMessage,
    };
  }
}

/**
 * Get the last sync status
 */
export async function getLastSyncStatus(): Promise<{
  lastSync: string | null;
  status: string | null;
  recordsUpserted: number | null;
}> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('sync_logs')
    .select('created_at, status, records_upserted')
    .order('created_at', { ascending: false })
    .limit(1)
    .single() as any;

  if (error || !data) {
    return {
      lastSync: null,
      status: null,
      recordsUpserted: null,
    };
  }

  return {
    lastSync: data.created_at,
    status: data.status,
    recordsUpserted: data.records_upserted,
  };
}
