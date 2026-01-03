import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
  authenticateArive,
  fetchAllAriveLoans,
  transformAriveLoan,
  type AriveAuthConfig,
} from '@/lib/api/arive';

/**
 * API Route: POST /api/sync
 *
 * Syncs loan data from ARIVE LOS to Supabase.
 * Can be called by:
 * - Vercel Cron (with CRON_SECRET header)
 * - Authenticated admin users
 *
 * Headers:
 * - Authorization: Bearer <CRON_SECRET> (for cron jobs)
 * - Cookie: supabase session (for authenticated users)
 */
export async function POST(request: Request) {
  const startTime = new Date();

  try {
    // Check authorization
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    // If cron secret is provided and matches, allow
    const isCronJob = cronSecret && authHeader === `Bearer ${cronSecret}`;

    if (!isCronJob) {
      // Check for authenticated user
      const supabase = await createClient();
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError || !user) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }
    }

    // Get ARIVE credentials
    const ariveConfig: AriveAuthConfig = {
      clientId: process.env.ARIVE_CLIENT_ID || '',
      secret: process.env.ARIVE_SECRET || '',
      apiKey: process.env.ARIVE_API_KEY || '',
    };

    // Validate config
    if (!ariveConfig.clientId || !ariveConfig.secret || !ariveConfig.apiKey) {
      return NextResponse.json(
        { error: 'ARIVE API credentials not configured' },
        { status: 500 }
      );
    }

    const supabase = await createClient();

    // Log sync start
    await supabase
      .from('sync_logs')
      .insert({
        status: 'running' as const,
        records_fetched: 0,
        records_upserted: 0,
      } as any);

    // Authenticate with ARIVE
    const { token, error: ariveAuthError } = await authenticateArive(ariveConfig);
    if (ariveAuthError || !token) {
      throw new Error(`ARIVE authentication failed: ${ariveAuthError}`);
    }

    // Fetch all loans
    const { data: loans, error: fetchError } = await fetchAllAriveLoans(token);
    if (fetchError) {
      throw new Error(`Failed to fetch loans: ${fetchError}`);
    }

    const recordsFetched = loans.length;

    // Transform and upsert loans
    const transformedLoans = loans.map(transformAriveLoan);

    // Upsert in batches
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

      if (!upsertError) {
        recordsUpserted += batch.length;
      }
    }

    // Log completion
    const endTime = new Date();
    const duration = Math.round((endTime.getTime() - startTime.getTime()) / 1000);

    await supabase
      .from('sync_logs')
      .insert({
        status: 'completed' as const,
        records_fetched: recordsFetched,
        records_upserted: recordsUpserted,
      } as any);

    return NextResponse.json({
      success: true,
      message: `Sync completed in ${duration}s`,
      recordsFetched,
      recordsUpserted,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    // Log failure
    const supabase = await createClient();
    await supabase
      .from('sync_logs')
      .insert({
        status: 'failed' as const,
        records_fetched: 0,
        records_upserted: 0,
        error_message: errorMessage,
      } as any);

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

/**
 * GET /api/sync
 *
 * Returns the last sync status
 */
export async function GET() {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { data, error } = await supabase
      .from('sync_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      throw error;
    }

    return NextResponse.json({
      logs: data,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
